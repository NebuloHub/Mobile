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
import { t } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

export default function AboutUsScreen({ navigation }: any) {
  const { lang } = useLanguage();

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
            <Text>{t("titles.aboutUs")}</Text>
            <View>
              <View>
                <Text>{t("titles.creators")}</Text>
                <Text>NebuloHub</Text>
              </View>
              <Text>Turmas 2TDSPM e 2TDSPX</Text>
            </View>
            <TouchableOpacity
              onPress={() => openLink("https://github.com/NebuloHub")}
            >
              <Text>{t("buttons.visitGithub")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View>
            <Text>{t("pages.StartupDetails.titleDesc")}</Text>
          </View>
          <View>
            <Text>{t("pages.text")}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text>{t("Members")}</Text>
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
              <Text>{t("titles.faculty")}</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>{t("buttons.titleGoBack")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
