import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { setLocale, t } from "../../i18n";
import { Ionicons } from "@expo/vector-icons";
import { deleteUserByCPF } from "../../api/usuario";
import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function SettingsScreen({ navigation }: any) {
  const { signOut, user } = useAuth();
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);
  const { lang } = useLanguage();

  const { colors, setDarkTheme, setLightTheme } = useTheme();
  const styles = globalStyles(colors);

  const langs = [
    { code: "pt", label: t("components.language.titleOptionPT") },
    { code: "en", label: t("components.language.titleOptionEN") },
    { code: "es", label: t("components.language.titleOptionES") },
  ];

  const changeLanguage = (lang: string) => {
    setLocale(lang as any);
    setOpenLanguage(false);
  };

  const handleDeleteUser = async () => {
    if (!user?.cpf) {
      Alert.alert(t("logs.titleError"), t("logs.errorNotFoundCPF"));
      return;
    }

    Alert.alert(t("logs.titleConfirm"), t("logs.confirmDel"), [
      { text: t("titles.cancel"), style: "cancel" },
      {
        text: t("titles.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            const res = await deleteUserByCPF(user.cpf);
            Alert.alert(t("logs.titleSucess"), res.mensagem);
            signOut();
          } catch (error) {
            Alert.alert(t("logs.titleError"), t("logs.errorDelUser"));
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <View
          style={[
            styles.formCorpo,
            {
              gap: 30,
              borderBottomWidth: 3,
              borderColor: colors.borda,
              paddingBottom: 50,
            },
          ]}
        >
          <Text style={styles.tituloHome}>{t("titles.config")}</Text>

          <TouchableOpacity
            style={styles.buttonConfig}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.textOutroButton}>{t("buttons.titleEditUser")}</Text>
          </TouchableOpacity>

          <View style={[styles.buttonConfig, {gap: 20}]}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
              onPress={() => setOpenLanguage(!openLanguage)}
            >
              <Text style={styles.textOutroButton}>
                {t("components.language.titleLanguage")}
              </Text>
              <Ionicons name="chevron-down-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            {openLanguage && (
              <View style={{ gap: 10, paddingHorizontal: 20 }}>
                {langs.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => changeLanguage(lang.code)}
                  >
                    <Text style={styles.dadosStartup}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.buttonConfig, {gap: 20}]}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
              onPress={() => setOpenTheme(!openTheme)}
            >
              <Text style={styles.textOutroButton}>{t("titles.theme")}</Text>
              <Ionicons name="chevron-down-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            {openTheme && (
              <View style={{ gap: 10, paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={setDarkTheme}>
                  <Text style={styles.dadosStartup}>{t("titles.darkMode")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={setLightTheme}>
                  <Text style={styles.dadosStartup}>{t("titles.lightMode")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.buttonConfig} onPress={() => signOut}>
            <Text style={styles.textOutroButton}>{t("buttons.tittleChangeAccount")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonConfig} onPress={() => signOut}>
            <Text style={styles.textOutroButton}>{t("buttons.tittleCreateOtherAccount")}</Text>
          </TouchableOpacity>
        </View>

        <View style={[
            styles.formCorpo,
            {
              gap: 30,
              borderBottomWidth: 3,
              borderColor: colors.borda,
              paddingBottom: 50,
            },
          ]}>
          <Text style={styles.dadosStartup}>{t("titles.Credits")}</Text>
          <TouchableOpacity style={styles.buttonConfig} onPress={() => navigation.navigate('AboutUs')}>
            <Text style={styles.textOutroButton}>NebuloHub</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.formCorpo, { gap: 30 }]}>
          <Text style={styles.dadosStartup}>{t("titles.account")}</Text>

          <TouchableOpacity
            style={[styles.buttonConfig, { borderColor: "#E60000" }]}
            onPress={handleDeleteUser}
          >
            <Text style={[styles.textOutroButton, { color: "#E60000" }]}>
              {t("buttons.DeleteAccount")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonConfig, { borderColor: "#E60000" }]}
            onPress={signOut}
          >
            <Text style={[styles.textOutroButton, { color: "#E60000" }]}>
              {t("buttons.SignOut")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
