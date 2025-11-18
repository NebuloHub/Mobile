import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AllStartupsResponse, StartupResponse } from "../types/startup";
import { AvaliacaoResponse } from "../types/avaliacao";
import { getStartupByCNPJ } from "../api/startup";
import { UserResponse } from "../types/usuario";
import { getUserByCPF } from "../api/usuario";

interface Props {
  data: AllStartupsResponse | StartupResponse;
  onPress?: () => void;
}

export default function StartupCard({ data, onPress }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponse[]>([]);
  const [user, setUser] = useState<UserResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const detalhe: StartupResponse = await getStartupByCNPJ(data.cnpj);
        setAvaliacoes(detalhe.avaliacoes || []);
        const userDetalhe : UserResponse = await getUserByCPF(detalhe.usuarioCPF);
        setUser(userDetalhe)
      } catch (err) {
        console.log("Erro ao carregar detalhes da startup:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [data.cnpj]);

  // Calcula média da nota
  const mediaNota = avaliacoes.length
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length / 2
    : 0;

  const totalComentarios = avaliacoes.length;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(mediaNota)) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i - mediaNota < 1) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#FFD700" />
        );
      }
    }
    return stars;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Ionicons name="person-circle-outline" size={22} />
        <Text>{user?.nome}</Text>
      </View>
      {data.video ? (
        <Image
          source={{
            uri: `https://img.youtube.com/vi/${extractYT(
              data.video
            )}/hqdefault.jpg`,
          }}
          style={styles.thumbnail}
        />
      ) : (
        <Image
          source={require("../../assets/placeholders/video.png")}
          style={styles.thumbnail}
        />
      )}

      <View>
        <Text>{data.nomeStartup}</Text>
        <Text>{data.emailStartup}</Text>

        <View>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View>
              <View style={styles.stars}>{renderStars()}</View>
              <View>
                <Text>{totalComentarios}</Text>
                <Ionicons name="chatbox-ellipses-outline" size={22} />
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Extrai ID do YouTube para thumbnail
function extractYT(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}

const styles = StyleSheet.create({
  // A thumbnail tu deixa Luiz ela q mostra o vídeo
  thumbnail: {
    width: "100%",
    height: 180,
  },
  stars: {
    flexDirection: "row",
  },
});
