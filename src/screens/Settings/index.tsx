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
      <ScrollView>
        <View>
          <Text>Configurações</Text>

          <TouchableOpacity>
            <Text>Editar Perfil</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity onPress={() => setOpenLanguage(!open)}>
              <Text>{t("components.titleLanguage")}</Text>
              <Ionicons name="chevron-down-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            {openLanguage && (
              <View>
                {langs.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => changeLanguage(lang.code)}
                  >
                    <Text>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View>
            <TouchableOpacity onPress={() => setOpenTheme(!openTheme)}>
              <Text>Tema</Text>
              <Ionicons name="chevron-down-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            {openTheme && (
              <View>
                <TouchableOpacity onPress={setDarkTheme}>
                  <Text>Escuro</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={setLightTheme}>
                  <Text>Claro</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text>Mudar de Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text>Criar outra conta</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>Conta</Text>

          <TouchableOpacity onPress={handleDeleteUser}>
            <Text>Apagar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={signOut}>
            <Text>Deslogar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
