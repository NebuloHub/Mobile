import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AllStartupsResponse, StartupResponse } from "../types/startup";
import { AvaliacaoResponse } from "../types/avaliacao";
import { getStartupByCNPJ } from "../api/startup";
import { UserResponse } from "../types/usuario";
import { getUserByCPF } from "../api/usuario";

import { useTheme } from "../context/ThemeContext";
import { globalStyles } from "../styles/global";

import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  data: AllStartupsResponse | StartupResponse;
  onPress?: () => void;
}

export default function StartupCard({ data, onPress }: Props) {

  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const { lang } = useLanguage();
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
        Alert.alert(`${t("logs.errorLoadingStartups")} ${err}`);        
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [data.cnpj]);

  const mediaNota = avaliacoes.length
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length / 2
    : 0;

  const totalComentarios = avaliacoes.length;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(mediaNota)) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFB100" />);
      } else if (i - mediaNota < 1) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFB100" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#FFB100" />
        );
      }
    }
    return stars;
  };

  return (
    
    <View style= {styles.card}>

       <View style={styles.userCard}>
        <View style={styles.headerCard}>
          <Ionicons name="person-circle-outline" size={40}  style={styles.iconUserHome}/>
          <Text style={styles.nomeCard}>{user?.nome}</Text>
        </View>

        <TouchableOpacity style={styles.headerCard}  onPress={onPress}>
          <Text style={styles.sobreCard}>{t("buttons.titleAbout")}</Text>
        </TouchableOpacity>

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

      <View style={[styles.userCard, { paddingHorizontal: 45 }]}>

        <View style={[styles.linguagem,{ alignItems: "center" }]}>

          <Text style={styles.textLinguagem}>{data.nomeStartup}</Text>

          <View style={styles.stars}>{renderStars()}</View>

        </View>

        

        <View >
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View>
              <View style={[styles.userCard,{ gap:5}]}>
                <Ionicons name="chatbox-ellipses-outline" size={25} style={styles.olho}/>
                <Text style={styles.textLinguagem}>{totalComentarios}</Text>
              </View>
            </View>
          )}
        </View>
      </View>


    </View>

  );
}

// Extrai ID do YouTube para thumbnail
function extractYT(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}
