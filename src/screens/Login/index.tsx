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

export default function LoginScreen({ navigation }: any) {
  const { user, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const [errors, setErrors] = useState({
    email: false,
    senha: false,
  });

  const handleLogin = async () => {
    let newErrors = { email: false, senha: false };
    let msg = "";

    if (!isValidEmail(email)) {
      newErrors.email = true;
      msg = "Email inválido.";
    } else if (!senha.trim()) {
      newErrors.senha = true;
      msg = "A senha é obrigatória.";
    }

    setErrors(newErrors);

    if (msg) return Alert.alert("Erro", msg);

    try {
      await signIn({ email, senha });
      alert(`Bem-vindo, ${user?.nome}`);
    } catch (err) {
      console.log("Erro no login:", err);
      alert(t("logs.errorInvalidcredentials"));
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <LanguageToggleButton />

        <View>
          <Text>{t("home.title")}</Text>
        </View>

        <Field label="Email" error={errors.email}>
          <TextInput
            placeholder="Digite aqui seu email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors((prev) => ({ ...prev, email: false }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              errors.email && { borderColor: "red" },
            ]}
          />
        </Field>

        <Field label="Senha" error={errors.senha}>
          <View
            style={[
              styles.passwordContainer,
              errors.senha && { borderColor: "red" },
            ]}
          >
            <TextInput
              placeholder="Digite aqui sua senha"
              secureTextEntry={!showSenha}
              value={senha}
              onChangeText={(t) => {
                setSenha(t);
                setErrors((prev) => ({ ...prev, senha: false }));
              }}
              style={{ flex: 1 }}
            />

            <TouchableOpacity onPress={() => setShowSenha(!showSenha)}>
              <Ionicons
                name={showSenha ? "eye-off-outline" : "eye-outline"}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </Field>

        <View>
          <TouchableOpacity onPress={handleLogin}>
            <Text>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text>Criar nova conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  passwordContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
