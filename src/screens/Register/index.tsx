import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaskedTextInput } from "react-native-mask-text";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import PasswordStrengthBar, {
  getPasswordStrength,
} from "../../components/PasswordStrengthBar";
import { isValidEmail, isValidatePassword } from "../../utils/validators";
import LanguageToggleButton from "../../components/LanguageToggleButton";
import Field from "../../components/Field";

import { t } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

export default function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);
  const { lang } = useLanguage();

  const { signUp } = useAuth();

  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({
    cpf: false,
    nome: false,
    email: false,
    senha: false,
    confirmarSenha: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleRegister = async () => {
    let newErrors = { ...errors };
    let msg = "";

    const cpfNumbers = form.cpf.replace(/\D/g, "");

    if (cpfNumbers.length !== 11) {
      newErrors.cpf = true;
      msg = t("logs.errorInvalidCPF");
    } else if (!form.nome.trim()) {
      newErrors.nome = true;
      msg = t("logs.errorEmptyName");
    } else if (!isValidEmail(form.email)) {
      newErrors.email = true;
      msg = t("logs.errorInvalidEmail");
    } else if (!isValidatePassword(form.senha)) {
      newErrors.senha = true;
      msg = t("logs.errorInvalidPassword");
    } else if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = true;
      msg = t("logs.errorInvalidPassword");
    }

    setErrors(newErrors);
    if (msg) return Alert.alert(t("logs.titleError"), msg);

    const payload = {
      cpf: cpfNumbers,
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      role: "USER",
      telefone: form.telefone ? Number(form.telefone.replace(/\D/g, "")) : 0,
    };

    try {
      await signUp(payload);
      Alert.alert(t("logs.titleSucess"), t("logs.contexSignUp"));
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert(t("logs.titleErrorSignUp"), err.message);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <LanguageToggleButton />

        <View style={{ alignItems: "center" }}>
          <Text style={styles.titulo}>{t("titles.SingUp")}</Text>
        </View>

        <View style={styles.formCorpo}>
          <Field labelKey="fields.labelCPF" error={errors.cpf}>
            <MaskedTextInput
              mask="999.999.999-99"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={form.cpf}
              onChangeText={(t) => updateField("cpf", t)}
              placeholder={t("fields.placeholderCPF")}
              style={[
                styles.input,
                { borderColor: errors.cpf ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <Field labelKey="fields.labelName" error={errors.nome}>
            <TextInput
              value={form.nome}
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("nome", t)}
              placeholder={t("fields.placeholderName")}
              style={[
                styles.input,
                {
                  borderColor: errors.nome ? "red" : "#ccc",
                },
              ]}
            />
          </Field>

          <Field labelKey="fields.labelEmail" error={errors.email}>
            <TextInput
              value={form.email}
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("email", t)}
              placeholder={t("fields.placeholderEmail")}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  borderColor: errors.email ? "red" : "#ccc",
                },
              ]}
            />
          </Field>

          <Field labelKey="fields.labelPhone" error={false}>
            <MaskedTextInput
              mask="(99) 99999-9999"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={form.telefone}
              onChangeText={(t) => updateField("telefone", t)}
              placeholder={t("fields.placeholderPhone")}
              style={[
                styles.input,
                {
                  borderColor: "#ccc",
                },
              ]}
            />
          </Field>

          <View>
            <Field labelKey="fields.labelPassword" error={errors.senha}>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    borderColor: errors.senha ? "red" : "#ccc",
                  },
                ]}
              >
                <TextInput
                  value={form.senha}
                  placeholderTextColor="#888"
                  onChangeText={(t) => updateField("senha", t)}
                  placeholder={t("fields.placeholderPassword")}
                  secureTextEntry={!showPass}
                  style={styles.textoSenha}
                />

                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    style={styles.olho}
                  />
                </TouchableOpacity>
              </View>
            </Field>

            <PasswordStrengthBar score={getPasswordStrength(form.senha)} />
          </View>

          <Field labelKey="fields.labelConfirmPassword" error={errors.confirmarSenha}>
            <View
              style={[
                styles.passwordContainer,
                {
                  borderColor: errors.confirmarSenha ? "red" : "#ccc",
                },
              ]}
            >
              <TextInput
                value={form.confirmarSenha}
                placeholderTextColor="#888"
                onChangeText={(t) => updateField("confirmarSenha", t)}
                placeholder={t("fields.placeholderPassword")}
                secureTextEntry={!showConfirmPass}
                style={styles.textoSenha}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Ionicons
                  name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  style={styles.olho}
                />
              </TouchableOpacity>
            </View>
          </Field>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.textButton}>{t("buttons.titleSignUp")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.outroButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.textOutroButton}>{t("buttons.titleHaveAccount")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
