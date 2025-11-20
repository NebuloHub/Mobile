import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Linking,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import { students } from "../../utils/students";
import AboutUsCard from "../../components/AboutUsCard";

export default function AboutUsScreen({ navigation }: any) {
  const openLink = useCallback(async (url?: string | null) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (err) {
      console.warn("Erro abrindo link:", err);
    }
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View>
            <YoutubePlayer height={220} play={false} videoId="MXidFLToZn8" />
          </View>
          <View>
            <Text>Sobre nós</Text>
            <View>
              <View>
                <Text>Criadores do projeto:</Text>
                <Text>NebuloHub</Text>
              </View>
              <Text>Turmas 2TDSPM e 2TDSPX</Text>
            </View>
            <TouchableOpacity
              onPress={() => openLink("https://github.com/NebuloHub")}
            >
              <Text>Visitar github</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View>
            <Text>Descrição do projeto</Text>
          </View>
          <View>
            <Text>
              NebuloHub é uma plataforma inteligente dedicada à descoberta,
              avaliação e conexão de startups. Ao se cadastrar, cada startup
              seleciona suas habilidades e características principais, formando
              um perfil único dentro do ecossistema. Com base em avaliações
              públicas e no desempenho de startups semelhantes, o NebuloHub
              utiliza Inteligência Artificial para estimar o potencial de
              sucesso de cada negócio. Usuários comuns podem criar contas,
              acessar um feed interativo, visualizar startups, deixar avaliações
              em estrelas e registrar comentários, contribuindo para a formação
              de uma comunidade ativa e colaborativa. Assim como estrelas surgem
              dentro de nebulosas, o NebuloHub funciona como um ambiente onde
              novas ideias ganham forma, visibilidade e direção — guiadas por
              dados, tecnologia e avaliação coletiva.
            </Text>
          </View>
        </View>
        <View>
          <View>
            <Text>Integrantes</Text>
          </View>
          <View>
            {students.map((aluno, index) => (
              <AboutUsCard
                key={index}
                image={aluno.image}
                name={aluno.name}
                rm={aluno.rm}
                turma={aluno.turma}
                githubUrl={aluno.githubUrl}
                linkedinUrl={aluno.linkedinUrl}
              />
            ))}
          </View>
        </View>
        <View>
          <View>
            <View>
              <Text>Faculdade:</Text>
              <Text>FIAP</Text>
            </View>
            <TouchableOpacity
              onPress={() => openLink("https://www.fiap.com.br")}
            >
              <Text>fiap.com.br</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Image
              source={require("../../../assets/aboutUs/fiap/image.png")}
              resizeMode="cover"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
