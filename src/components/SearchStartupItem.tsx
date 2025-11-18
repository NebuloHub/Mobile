import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AllStartupsResponse, StartupResponse } from "../types/startup";
import { AvaliacaoResponse } from "../types/avaliacao";
import { getStartupByCNPJ } from "../api/startup";

interface Props {
  data: AllStartupsResponse;
  onPress?: () => void;
}

export default function SearchStartupItem({ data, onPress }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const detalhe: StartupResponse = await getStartupByCNPJ(data.cnpj);
        setAvaliacoes(detalhe.avaliacoes || []);
      } catch (err) {
        console.log("Erro ao carregar avaliações:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [data.cnpj]);

  const mediaNota = avaliacoes.length
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length / 2
    : 0;

  const totalComentarios = avaliacoes.length;

  function renderStars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(mediaNota)) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i - mediaNota < 1) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
      }
    }
    return stars;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{data.nomeStartup}</Text>

      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <View style={styles.row}>
          <View style={styles.stars}>{renderStars()}</View>

          <View style={styles.commentsRow}>
            <Ionicons name="chatbox-ellipses-outline" size={18} color="#444" />
            <Text style={styles.commentsText}>{totalComentarios}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginRight: 12,
  },
  commentsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
