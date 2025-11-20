import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Field from "../../components/Field";
import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

import { useAuth } from "../../context/AuthContext";
import { getUserByCPF, putUserByCPF } from "../../api/usuario";

import { UserResponse } from "../../types/usuario";

import { t } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

export default function ChangePasswordScreen({ navigation }: any) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { lang } = useLanguage();

  const styles = globalStyles(colors);

  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user?.cpf) return;
      const data = await getUserByCPF(user.cpf);
      setCurrentUser(data);
    };
    load();
  }, []);

  const handleChangePassword = async () => {
    if (!currentUser) return;

    if (senha.length < 5) {
      return Alert.alert(t("logs.titleError"), t("logs.errorInvalidPassword"));
    }

    if (senha !== confirmSenha) {
      return Alert.alert(t("logs.titleError"), t("logs.errorDiferentPasswords"));
    }

    try {
      const updated = await putUserByCPF(currentUser.cpf, {
        ...currentUser,
        senha,
      });

      Alert.alert(t("logs.titleSucess"), t("logs.sucessUpdatePassword"));
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert(t("logs.titleError"), t("logs.errorUpdatePassword"));
    }
  };

  if (!currentUser) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.pagina}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={styles.titulo}>{t("buttons.changePassword")}</Text>

        <Field labelKey="fields.labelNewPassword">
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </Field>

        <Field labelKey="fields.labelConfirmNewPassword">
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmSenha}
            onChangeText={setConfirmSenha}
          />
        </Field>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.textButton}>{t("buttons.saveNewPassword")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textButton}>{t("titles.cancel")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
