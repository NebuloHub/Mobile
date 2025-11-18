import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppStackParams } from "../../types/navigation";
import { StartupResponse } from "../../types/startup";
import { getStartupByCNPJ } from "../../api/startup";

type Props = NativeStackScreenProps<AppStackParams, "StartupDetails">;

const Stars = ({ value }: { value: number }) => {
  const stars = [];
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={18} color="#FFD700" />);
    } else if (i === full + 1 && half) {
      stars.push(<Ionicons key={`star-${i}`} name="star-half" size={18} color="#FFD700" />);
    } else {
      stars.push(
        <Ionicons key={`star-${i}`} name="star-outline" size={18} color="#FFD700" />
      );
    }
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

function extractYT(url: string): string | null {
  if (!url) return null;

  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function StartupDetails({ route, navigation }: Props) {
  const { cnpj } = route.params;

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const openLink = async (url?: string | null) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      supported && (await Linking.openURL(url));
    } catch (err) {
      console.log("Erro ao abrir link:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStartupByCNPJ(cnpj);
        setStartup(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cnpj]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!startup) {
    return (
      <View style={styles.center}>
        <Text>Startup não encontrada.</Text>
      </View>
    );
  }

  const videoId = startup.video ? extractYT(startup.video) : null;

  const media =
    startup?.avaliacoes && startup.avaliacoes.length > 0
      ? startup.avaliacoes.reduce((acc, a) => acc + a.nota, 0) / startup.avaliacoes.length
      : 0;

  const visibleAvaliacoes = expanded ? startup.avaliacoes : startup.avaliacoes.slice(0, 1);

  return (
    <ScrollView style={styles.container}>
      {videoId ? (
        <TouchableOpacity onPress={() => openLink(startup.video)}>
          <Image
            source={{ uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
            style={styles.thumbnail}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={require("../../../assets/placeholders/video.png")}
          style={styles.thumbnail}
        />
      )}

      <Text style={styles.title}>{startup.nomeStartup}</Text>
      <Text style={styles.desc}>{startup.descricao}</Text>

      {startup.site && (
        <TouchableOpacity onPress={() => openLink(startup.site)}>
          <Text style={styles.siteLink}>{startup.site}</Text>
        </TouchableOpacity>
      )}

      {startup.habilidades?.length > 0 && (
        <View style={{ marginTop: 22 }}>
          <Text style={styles.section}>Habilidades</Text>

          <View style={styles.skillsContainer}>
            {startup.habilidades.map((hab, index) => (
              <View key={hab.idHabilidade ?? index} style={styles.skillBadge}>
                <Text style={styles.skillName}>{hab.nomeHabilidade}</Text>
                <Text style={styles.skillType}>{hab.tipoHabilidade}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.section}>Avaliações</Text>

      {startup.avaliacoes?.length ? (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.subtitle}>Avaliação Geral</Text>
          <Stars value={media / 2} />
          <Text style={{ marginTop: 4 }}>
            {media.toFixed(1)} / 10 ({startup.avaliacoes.length} avaliações)
          </Text>

          {visibleAvaliacoes.map((a, index) => (
            <View key={a.idAvaliacao ?? index} style={styles.avaliacaoBox}>
              <Text style={styles.avaliadorName}>
                {a.usuario?.nome ?? "Usuário"}
              </Text>
              <Stars value={a.nota / 2} />
              <Text style={styles.avaliacaoComentario}>
                {a.comentario || "Sem comentário"}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>Nenhuma avaliação ainda.</Text>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },

  title: { fontSize: 26, fontWeight: "bold", marginTop: 12 },

  desc: { marginTop: 8, color: "#444", fontSize: 15 },

  siteLink: {
    marginTop: 8,
    color: "#007AFF",
    textDecorationLine: "underline",
  },

  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 22,
  },

  /* -------- SKILLS -------- */
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  skillBadge: {
    backgroundColor: "#e6f0ff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  skillName: {
    fontWeight: "600",
    fontSize: 14,
  },

  skillType: {
    fontSize: 11,
    opacity: 0.6,
  },

  /* -------- AVALIAÇÕES -------- */
  subtitle: { fontWeight: "bold", marginBottom: 4 },

  showMore: { color: "#007AFF", fontWeight: "bold" },

  avaliacaoBox: {
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },

  avaliadorName: { fontWeight: "bold", fontSize: 15, marginBottom: 4 },

  avaliacaoComentario: { marginTop: 4, color: "#333" },

  /* -------- VOLTAR -------- */
  backButton: {
    marginTop: 25,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    alignItems: "center",
  },

  backText: { color: "#fff", fontWeight: "bold" },
});
