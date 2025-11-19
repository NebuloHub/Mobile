import React, { useEffect, useState } from "react";
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
import { getStartupByCNPJ } from "../../api/startup";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<AppStackParams, "StartupDetails">;

const Stars = ({ value }: { value: number }) => {
  const stars = [];
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      stars.push(
        <Ionicons key={`star-${i}`} name="star" size={18} color="#FFD700" />
      );
    } else if (i === full + 1 && half) {
      stars.push(
        <Ionicons
          key={`star-${i}`}
          name="star-half"
          size={18}
          color="#FFD700"
        />
      );
    } else {
      stars.push(
        <Ionicons
          key={`star-${i}`}
          name="star-outline"
          size={18}
          color="#FFD700"
        />
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
      <View>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!startup) {
    return (
      <View>
        <Text>Startup não encontrada.</Text>
      </View>
    );
  }

  const videoId = startup.video ? extractYT(startup.video) : null;

  const media =
    startup?.avaliacoes && startup.avaliacoes.length > 0
      ? startup.avaliacoes.reduce((acc, a) => acc + a.nota, 0) /
        startup.avaliacoes.length
      : 0;

  const visibleAvaliacoes = expanded
    ? startup.avaliacoes
    : startup.avaliacoes.slice(0, 1);

  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={18} color="#747474" />
            <Text>Voltar</Text>
        </TouchableOpacity>
        {videoId ? (
          <TouchableOpacity onPress={() => openLink(startup.video)}>
            <Image
              source={{
                uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              }}
            />
          </TouchableOpacity>
        ) : (
          // Se você prefirir da pra trocar só para um texto falando que não tem vídeo
          <Image source={require("../../../assets/placeholders/video.png")} />
        )}

        <Text>{startup.nomeStartup}</Text>
        <Text>{startup.descricao}</Text>

        {startup.site && (
          <TouchableOpacity onPress={() => openLink(startup.site)}>
            <Text>{startup.site}</Text>
          </TouchableOpacity>
        )}

        {startup.habilidades?.length > 0 && (
          <View>
            <Text>Habilidades</Text>

            <View>
              {startup.habilidades.map((hab, index) => (
                <View key={hab.idHabilidade ?? index}>
                  <Text>{hab.nomeHabilidade}</Text>
                  <Text>{hab.tipoHabilidade}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text>Avaliações</Text>

        {startup.avaliacoes?.length ? (
          <View>
            <Text>Avaliação Geral</Text>
            <Stars value={media / 2} />
            <Text style={{ marginTop: 4 }}>
              {media.toFixed(1)} / 10 ({startup.avaliacoes.length} avaliações)
            </Text>

            {visibleAvaliacoes.map((a, index) => (
              <View key={a.idAvaliacao ?? index}>
                <Text>{a.usuario?.nome ?? "Usuário"}</Text>
                <Stars value={a.nota / 2} />
                <Text>{a.comentario || "Sem comentário"}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>Nenhuma avaliação ainda.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
