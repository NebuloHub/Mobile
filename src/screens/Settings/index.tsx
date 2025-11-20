import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { setLocale, t } from "../../i18n";
import { Ionicons } from "@expo/vector-icons";
import { deleteUserByCPF } from "../../api/usuario";
import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";
import { useState } from "react";


export default function SettingsScreen({ navigation }: any) {
  const { signOut, user } = useAuth();
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);

  const { colors, setDarkTheme, setLightTheme } = useTheme();
  const styles = globalStyles(colors);

  const langs = [
    { code: "pt", label: "Português (Brasil)" },
    { code: "en", label: "Inglês (EUA)" },
    { code: "es", label: "Espanhol" },
  ];

  const changeLanguage = (lang: string) => {
    setLocale(lang as any);
    setOpenLanguage(false);
  };

  const handleDeleteUser = async () => {
    if (!user?.cpf) {
      Alert.alert("Erro", "CPF do usuário não encontrado.");
      return;
    }

    Alert.alert("Confirmação", "Deseja realmente deletar sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await deleteUserByCPF(user.cpf);
            Alert.alert("Sucesso", res.mensagem);
            signOut();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível deletar o usuário.");
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <View style={[styles.formCorpo, { gap: 30,  borderBottomWidth: 3, borderColor:colors.borda, paddingBottom: 50 }]}>
          <Text style={styles.tituloHome}>Configurações</Text>

          <TouchableOpacity style={styles.buttonConfig}>
            <Text style={styles.textOutroButton}>Editar Perfil</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity style={[styles.buttonConfig, {flexDirection: "row", justifyContent: "space-between", alignItems: "center"}]} onPress={() => setOpenLanguage(!openLanguage)}>
              <Text style={styles.textOutroButton}>{t("components.titleLanguage")}</Text>
              <Ionicons name="chevron-down-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            {openLanguage && (
              <View style={ { gap: 10, paddingHorizontal: 20}}>
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

          <View>
            <TouchableOpacity style={[styles.buttonConfig, {flexDirection: "row", justifyContent: "space-between", alignItems: "center"}]} onPress={() => setOpenTheme(!openTheme)}>
              <Text style={styles.textOutroButton}>Tema</Text>
              <Ionicons name="chevron-down-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            {openTheme && (
              <View style={ { gap: 10, paddingHorizontal: 20}}>
                <TouchableOpacity onPress={setDarkTheme}>
                  <Text style={styles.dadosStartup}>Escuro</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={setLightTheme}>
                  <Text style={styles.dadosStartup}>Claro</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.buttonConfig} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.textOutroButton}>Mudar de Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonConfig} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.textOutroButton}>Criar outra conta</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.formCorpo, { gap: 30 }]}>
          <Text style={styles.dadosStartup}>Conta</Text>

          <TouchableOpacity style={[styles.buttonConfig, { borderColor: "#E60000" }]} onPress={handleDeleteUser}>
            <Text style={[styles.textOutroButton, { color: "#E60000" }]}>Apagar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonConfig, { borderColor: "#E60000" }]} onPress={signOut}>
            <Text style={[styles.textOutroButton, { color: "#E60000" }]}>Deslogar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
