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

  const { colors } = useTheme();
  const styles = globalStyles(colors);

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

  const visibleAvaliacoes = expanded ? startup.avaliacoes : startup.avaliacoes.slice(0, 1);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>

      <ScrollView>
        {videoId ? (
          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={220}
              play={false}
              videoId={videoId}
            />
          </View>

        ) : (
          // Se você prefirir da pra trocar só para um texto falando que não tem vídeo
          <Image
            source={require("../../../assets/placeholders/video.png")}
            style={{ width: "100%", height: 200 }}
          />
        )}

         <View style={styles.startupCard}>
          
            <Text style={styles.tituloHome}>{startup.nomeStartup}</Text>
            <Text style={styles.dadosStartup}>Email:  {startup.emailStartup}</Text>
            <Text style={styles.dadosStartup}>CNPJ: {startup.cnpj}</Text>

          <View>
            {startup.site && (
              <TouchableOpacity style={styles.buttonProfile} onPress={() => openLink(startup.site)}>
                <Text style={styles.textOutroButton}>Visitar Site</Text>
              </TouchableOpacity>
            )}

          </View>

          
        </View>

        <View style={[styles.startupCard, {paddingBottom: 30, gap:30}]}>

          <View style={{gap:30}}>
            <Text style={styles.dadosStartup}>Descrição do projeto</Text>
            <Text style={styles.textButton}>{startup.descricao}</Text>

          </View>

          <View style={styles.linguagem}>
            <Text style={styles.dadosStartup}>Nome Responsavel: </Text>
            <Text style={styles.textButton}>{startup.nomeResponsavel}</Text>
          </View>
        </View>


        {startup.habilidades?.length > 0 && (
          <View style={[styles.startupCard,{marginTop: 20, gap:25, paddingBottom: 40}]}>
            <Text style={styles.dadosStartup}>Habilidades</Text>

            <View style={{gap:15}}>
              {startup.habilidades.map((hab, index) => (
                <View key={hab.idHabilidade ?? index}>
                  <Text style={styles.textButton}>{hab.nomeHabilidade}</Text>
                  <Text style={styles.textButton}>{hab.tipoHabilidade}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.startupCard, {borderBottomWidth: 0, }]}>
          <Text style={styles.tituloHome}>Notas e avaliações</Text>
          <Text style={styles.dadosStartup}>As notas e avaliações  são verificados e criados por usuarios ja cadastrados no aplicativo</Text>
        </View>
        
        {startup.avaliacoes?.length ? (
          <View>

            <View style={[styles.startupCard, {borderBottomWidth: 0, marginTop: 0,}]}>
              <Text style={[styles.tituloHome, {color: colors.text,}]}>
                {media.toFixed(1)} / 10
              </Text>
              <Stars value={media / 2} />

            </View>


            <View style={[styles.headerHome, {paddingHorizontal: 90}]}>
              <Ionicons name="chatbox-ellipses-outline" size={25} style={styles.olho}/>
              <Text style={styles.dadosStartup}>Avaliações</Text>
              <Text style={styles.dadosStartup}>{startup.avaliacoes.length}</Text>
            </View>
            

            {visibleAvaliacoes.map((a, index) => (
              <View style={[styles.startupCard, {borderBottomWidth: 0, marginTop: 10,}]} key={a.idAvaliacao ?? index}>

                <View style={{flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 5,}}>
                  <Ionicons name="person-circle-outline" size={25}  style={styles.iconUserHome}/>
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
          </View>
        ) : (
          <Text>Nenhuma avaliação ainda.</Text>
        )}

        <TouchableOpacity style={[styles.buttonProfile, {marginBottom: 40,  marginTop: 10}]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textOutroButton}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
