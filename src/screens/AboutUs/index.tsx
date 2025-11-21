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

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

export default function AboutUsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);

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
    <SafeAreaView style={styles.pagina}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.videoContainer}>
          <YoutubePlayer height={220} play={false} videoId="MXidFLToZn8" />
        </View>

        <View style={styles.startupCard}>
          <View style={{ gap: 20 }}>
            <Text style={styles.tituloHome}>{t("titles.aboutUs")}</Text>
            <View style={{ gap: 20 }}>
              <View style={styles.linguagem}>
                <Text style={styles.dadosStartup}>{t("titles.creators")}</Text>
                <Text style={[styles.dadosStartup, { color: "#FFB100" }]}>
                  NebuloHub
                </Text>
              </View>
              <Text style={styles.dadosStartup}>Turmas 2TDSPM e 2TDSPX</Text>
            </View>
            <TouchableOpacity
              style={styles.buttonProfile}
              onPress={() => openLink("https://github.com/NebuloHub")}
            >
              <Text style={styles.textOutroButton}>
                {t("buttons.visitGithub")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.startupCard, { paddingBottom: 30, gap: 30 }]}>
          <View>
            <Text style={styles.dadosStartup}>
              {t("pages.StartupDetails.titleDesc")}
            </Text>
          </View>

          <View>
            <Text></Text>
            <Text style={styles.textButton}>{t("pages.text")}</Text>
          </View>
        </View>

        <View style={[styles.startupCard, { paddingBottom: 30, gap: 50 }]}>
          <View>
            <Text style={styles.dadosStartup}>{t("Members")}</Text>
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

        <View
          style={[
            styles.startupCard,
            {
              gap: 10,
              paddingBottom: 30,
              marginBottom: 0,
              marginTop: 30,
              borderBottomWidth: 0,
              paddingHorizontal: 0,
            },
          ]}
        >
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            <View style={styles.linguagem}>
              <Text style={[styles.dadosStartup, { fontSize: 20 }]}>
                {t("titles.faculty")}
              </Text>
              <Text
                style={[
                  styles.dadosStartup,
                  { color: "#ED1165", fontSize: 20 },
                ]}
              >
                FIAP
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => openLink("https://www.fiap.com.br")}
            >
              <Text
                style={[
                  styles.dadosStartup,
                  {
                    color: "#ED1165",
                    fontSize: 20,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                fiap.com.br
              </Text>
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
          style={[styles.buttonProfile, { marginTop: 10, marginBottom: 40 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textOutroButton}>{t("buttons.titleGoBack")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
