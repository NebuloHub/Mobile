import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../../types/navigation";
import { StartupResponse } from "../../types/startup";
import { AvaliacaoResponse } from "../../types/avaliacao";
import { getStartupByCNPJ } from "../../api/startup";
import { getUserByCPF } from "../../api/usuario";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

type Props = NativeStackScreenProps<AppStackParams, "StartupDetails">;

const Stars = ({ value }: { value: number }) => {
  const stars = [];
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      stars.push(<Ionicons key={i} name="star" size={18} color="#FFD700" />);
    } else if (i === full + 1 && half) {
      stars.push(<Ionicons key={i} name="star-half" size={18} color="#FFD700" />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={18} color="#FFD700" />);
    }
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

function extractYT(url: string): string | null {
  if (!url) return null;
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function attachUsersToEvaluations(avaliacoes: AvaliacaoResponse[]) {
  const results = [];

  for (const a of avaliacoes) {
    try {
      const user = await getUserByCPF(a.usuarioCPF!);
      results.push({ ...a, usuario: user });
    } catch {
      results.push({ ...a, usuario: null }); // fallback
    }
  }

  return results;
}

export default function StartupDetails({ route, navigation }: Props) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const { cnpj } = route.params;

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const openLink = useCallback(async (url?: string | null) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      supported && Linking.openURL(url);
    } catch (err) {
      console.log("Erro ao abrir link:", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getStartupByCNPJ(cnpj);
        setStartup(data);

        if (data.avaliacoes?.length) {
          const fullAvaliacoes = await attachUsersToEvaluations(data.avaliacoes);
          setAvaliacoes(fullAvaliacoes);
        }
      } catch (err) {
        console.error("ERRO AO BUSCAR STARTUP:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cnpj]);

  if (loading) {
    return (
      <View >
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  if (!startup) {
    return (
      <View >
        <Text style={styles.textButton}>Startup não encontrada.</Text>
      </View>
    );
  }

  const videoId = extractYT(startup.video ?? "");
  const media =
    avaliacoes.length > 0
      ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
      : 0;

  const visibleAvaliacoes = expanded ? avaliacoes : avaliacoes.slice(0, 1);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Vídeo */}
        {videoId ? (
          <View style={styles.videoContainer}>
            <YoutubePlayer height={220} play={false} videoId={videoId} />
          </View>
        ) : (
          <Image
            source={require("../../../assets/placeholders/video.png")}
            style={{ width: "100%", height: 200 }}
          />
        )}

        <View style={styles.startupCard}>
          <Text style={styles.tituloHome}>{startup.nomeStartup}</Text>
          <Text style={styles.dadosStartup}>Email: {startup.emailStartup}</Text>
          <Text style={styles.dadosStartup}>CNPJ: {startup.cnpj}</Text>

          {startup.site && (
            <TouchableOpacity
              style={styles.buttonProfile}
              onPress={() => openLink(startup.site)}
            >
              <Text style={styles.textOutroButton}>Visitar Site</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.startupCard, { paddingBottom: 30, gap: 30 }]}>
          <Text style={styles.dadosStartup}>Descrição do projeto</Text>
          <Text style={styles.textButton}>{startup.descricao}</Text>

          <Text style={styles.dadosStartup}>Nome Responsável</Text>
          <Text style={styles.textButton}>{startup.nomeResponsavel}</Text>
        </View>

        {/* Habilidades */}
        {startup.habilidades?.length > 0 && (
          <View style={[styles.startupCard, { gap: 25, paddingBottom: 40 }]}>
            <Text style={styles.dadosStartup}>Habilidades</Text>

            {startup.habilidades.map((hab) => (
              <View key={hab.idHabilidade}>
                <Text style={styles.textButton}>{hab.nomeHabilidade}</Text>
                <Text style={styles.textButton}>{hab.tipoHabilidade}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.startupCard]}>
          <Text style={styles.tituloHome}>Notas e avaliações</Text>
          <Text style={styles.dadosStartup}>
            As avaliações são criadas por usuários cadastrados no aplicativo.
          </Text>
        </View>

        <View style={[styles.startupCard, { marginTop: 0, borderBottomWidth: 0 }]}>
          <Text style={[styles.tituloHome]}>{media.toFixed(1)} / 10</Text>
          <Stars value={media / 2} />
        </View>

        {avaliacoes.length > 0 ? (
          <View>
            {visibleAvaliacoes.map((a, index) => (
              <View
                key={a.idAvaliacao ?? index}
                style={[styles.startupCard, { marginTop: 10, borderBottomWidth: 0 }]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Ionicons
                    name="person-circle-outline"
                    size={25}
                    style={styles.iconUserHome}
                  />
                  <Text style={styles.textButton}>
                    {a.usuario?.nome ?? "Usuário"}
                  </Text>
                </View>

                <Stars value={a.nota / 2} />
                <Text style={styles.textButton}>
                  {a.comentario || "Sem comentário"}
                </Text>
              </View>
            ))}

            {avaliacoes.length > 1 && (
              <TouchableOpacity
                style={[styles.buttonProfile, { marginVertical: 20 }]}
                onPress={() => setExpanded((prev) => !prev)}
              >
                <Text style={styles.textOutroButton}>
                  {expanded ? "Ver menos" : "Ver mais"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.textButton}>Nenhuma avaliação ainda.</Text>
        )}

        <TouchableOpacity
          style={[styles.buttonProfile, { marginBottom: 40, marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textOutroButton}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
