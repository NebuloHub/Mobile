import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AllStartupsResponse, StartupResponse } from "../types/startup";
import { AvaliacaoResponse } from "../types/avaliacao";
import { getStartupByCNPJ } from "../api/startup";

import { useTheme } from "../context/ThemeContext";
import { globalStyles } from "../styles/global";

interface Props {
  data: AllStartupsResponse;
  onPress?: () => void;
}

export default function SearchStartupItem({ data, onPress }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const { colors } = useTheme();
  const styles = globalStyles(colors);

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
    <TouchableOpacity style={styles.cardPesquisa} onPress={onPress}>
      <Text style={styles.textButton}>{data.nomeStartup}</Text>

      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <View style={styles.row}>
          <View style={styles.stars}>{renderStars()}</View>

          <View style={styles.commentsRow}>
            <Ionicons name="chatbox-ellipses-outline" size={18} style={styles.olho} />
            <Text style={styles.commentsText}>{totalComentarios}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
