import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppStackParams } from "../../types/navigation";
import { StartupResponse } from "../../types/startup";
import { getStartupByCNPJ } from "../../api/startup";

type Props = NativeStackScreenProps<AppStackParams, "StartupDetails">;

export default function StartupDetails({ route, navigation }: Props) {
  const { cnpj } = route.params;

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStartup = async () => {
      try {
        const data = await getStartupByCNPJ(cnpj);
        setStartup(data);
      } catch (err) {
        console.error("Erro ao carregar startup:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStartup();
  }, [cnpj]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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

  return (
    <ScrollView style={styles.container}>
      {/* Vídeo */}
      {startup.video ? (
        <Video
          source={{ uri: startup.video }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
        />
      ) : (
        <View style={styles.noVideo}>
          <Text>Sem vídeo disponível</Text>
        </View>
      )}

      {/* Informações da Startup */}
      <Text style={styles.title}>
        {startup.nomeStartup ?? "Nome não disponível"}
      </Text>
      <Text style={styles.desc}>
        {startup.descricao ?? "Descrição não disponível"}
      </Text>

      {/* Habilidades */}
      <Text style={styles.section}>Habilidades</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Volta ai man</Text>
      </TouchableOpacity>
      <View style={styles.tags}>
        {startup.habilidades.map((h, index) => (
          <View
            key={h.id_habilidade?.toString() ?? index.toString()}
            style={styles.tag}
          >
            <Text style={styles.tagText}>
              {h.nome_habilidade ?? "Sem nome"}
            </Text>
          </View>
        ))}
      </View>

      {/* Avaliações */}
      <Text>{startup.video}</Text>
      <Text style={styles.section}>Avaliações</Text>
      {startup.avaliacoes.length === 0 ? (
        <Text>Nenhuma avaliação ainda.</Text>
      ) : (
        startup.avaliacoes.map((a, index) => (
          <View
            key={a.id_avaliacao?.toString() ?? index.toString()}
            style={styles.avaliacao}
          >
            <Text style={styles.avaliador}>{a.Usuario?.nome ?? "Anônimo"}</Text>
            <Text>{a.comentario || "Sem comentário"}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  video: { width: "100%", height: 220, borderRadius: 12 },
  noVideo: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 12 },
  desc: { marginTop: 8, fontSize: 15, color: "#444" },
  section: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
  tags: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: {
    backgroundColor: "#007bff33",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { color: "#007bff", fontSize: 12 },
  avaliacao: {
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  avaliador: { fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
