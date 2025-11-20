import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import LanguageToggleButton from "../../components/LanguageToggleButton";
import { t } from "../../i18n";
import Field from "../../components/Field";
import { isValidEmail } from "../../utils/validators";
import { useLanguage } from "../../context/LanguageContext";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

export default function LoginScreen({ navigation }: any) {
  const { user, signIn } = useAuth();
  const { lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const [errors, setErrors] = useState({
    email: false,
    senha: false,
  });

  const handleLogin = async () => {
    let newErrors = { email: false, senha: false };
    let msg = "";

    if (!isValidEmail(email)) {
      newErrors.email = true;
      msg = t("logs.errorInvalidEmail");
    } else if (!senha.trim()) {
      newErrors.senha = true;
      msg = t("logs.errorEmptyPassword");
    }

    setErrors(newErrors);

    if (msg) return Alert.alert(t("logs.titleError"), msg);

    try {
      await signIn({ email, senha });
      alert(t("logs.titleWelcome"));
    } catch (err) {
      console.log(t("titleErrorLogIn"), err);
      alert(t("logs.errorInvalidcredentials"));
    }
  };


  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <LanguageToggleButton />

        <View style={{ alignItems: "center" }}>
          <Text style={styles.titulo}>{t("titles.welcome")}</Text>
        </View>

        <View style={styles.formCorpo}>
          <Field labelKey="fields.labelEmail" error={errors.email}>
            <TextInput
              placeholder={t("fields.placeholderEmail")}
              placeholderTextColor="#888"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErrors((prev) => ({ ...prev, email: false }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, errors.email && { borderColor: "red" }]}
            />
          </Field>

          <Field labelKey="fields.labelPassword" error={errors.senha}>
            <View
              style={[
                styles.passwordContainer,
                errors.senha && { borderColor: "red" },
              ]}
            >
              <TextInput
                placeholder={t("fields.placeholderPassword")}
                placeholderTextColor="#888"
                secureTextEntry={!showSenha}
                value={senha}
                onChangeText={(t) => {
                  setSenha(t);
                  setErrors((prev) => ({ ...prev, senha: false }));
                }}
                style={styles.textoSenha}
              />

              <TouchableOpacity onPress={() => setShowSenha(!showSenha)}>
                <Ionicons
                  name={showSenha ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  style={styles.olho}
                />
              </TouchableOpacity>
            </View>
          </Field>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.textButton}>{t("buttons.titleLogIn")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.outroButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.textOutroButton}>{t("buttons.titleRegister")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
