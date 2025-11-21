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
import { MaskedTextInput } from "react-native-mask-text";
import { registerStartup } from "../../api/startup";
import { StartupRequest } from "../../types/startup";
import LanguageToggleButton from "../../components/LanguageToggleButton";
import { useAuth } from "../../context/AuthContext";
import { isValidEmail, isValidURL } from "../../utils/validators";
import Field from "../../components/Field";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

import { t } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

export default function RegisterStartupScreen({ navigation }: any) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const [form, setForm] = useState<StartupRequest>({
    cnpj: "",
    video: "",
    nomeStartup: "",
    site: "",
    descricao: "",
    nomeResponsavel: "",
    emailStartup: "",
    usuarioCPF: user?.cpf ?? "",
  });

  const [errors, setErrors] = useState({
    cnpj: false,
    video: false,
    nomeStartup: false,
    site: false,
    descricao: false,
    emailStartup: false,
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nomeResponsavel: user.nome || "",
        usuarioCPF: user.cpf || "",
      }));
    }
  }, [user]);

  const updateField = (key: keyof StartupRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleRegister = async () => {
    let newErrors = { ...errors };
    let msg = "";

    const cnpjNumbers = form.cnpj.replace(/\D/g, "");

    if (cnpjNumbers.length !== 14) {
      newErrors.cnpj = true;
      msg = t("logs.errorInvalidCNPJ");
    } else if (!form.nomeStartup.trim()) {
      newErrors.nomeStartup = true;
      msg = t("logs.errorInvalidNameStartup");
    } else if (!isValidURL(form.site)) {
      newErrors.site = true;
      msg = t("logs.errorInvalidWebsite");
    } else if (form.descricao.length < 10) {
      newErrors.descricao = true;
      msg = t("logs.errorInvalidDescription");
    } else if (!isValidEmail(form.emailStartup)) {
      newErrors.emailStartup = true;
      msg = t("logs.errorInvalidEmail");
    } else if (form.video && !isValidURL(form.video)) {
      newErrors.video = true;
      msg = t("logs.errorInvalidVideo");
    }

    setErrors(newErrors);
    if (msg) return Alert.alert(t("titleError"), msg);

    const payload: StartupRequest = {
      ...form,
      cnpj: cnpjNumbers,
    };

    try {
      await registerStartup(payload);
      Alert.alert(t("logs.titleSucess"), t("logs.contexRegisterStartup"));
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(t("logs.titleErrorRegister"), err.message);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <LanguageToggleButton />

        <View style={{ alignItems: "center" }}>
          <Text style={styles.titulo}>{t("titles.registerStartup")}</Text>
        </View>

        <View style={styles.formCorpo}>
          {/* CNPJ */}
          <Field labelKey="fields.labelCNPJ" error={errors.cnpj}>
            <MaskedTextInput
              mask="99.999.999/9999-99"
              placeholderTextColor="#888"
              keyboardType="numeric"
              placeholder={t("fields.placeholderCNPJ")}
              value={form.cnpj}
              onChangeText={(t) => updateField("cnpj", t)}
              style={[styles.input, errors.cnpj && { borderColor: "red" }]}
            />
          </Field>

          <Field labelKey="fields.labelVideo" error={errors.video}>
            <TextInput
              placeholder={t("fields.placeholderVideo")}
              placeholderTextColor="#888"
              value={form.video}
              onChangeText={(t) => updateField("video", t)}
              style={[styles.input, errors.video && { borderColor: "red" }]}
            />
          </Field>

          <Field labelKey="fields.labelNameStartup" error={errors.nomeStartup}>
            <TextInput
              placeholder={t("fields.placeholderNameStartup")}
              placeholderTextColor="#888"
              value={form.nomeStartup}
              onChangeText={(t) => updateField("nomeStartup", t)}
              style={[
                styles.input,
                errors.nomeStartup && { borderColor: "red" },
              ]}
            />
          </Field>

          {/* Site */}
          <Field labelKey="fields.labelNameWebsite" error={errors.site}>
            <TextInput
              placeholder={t("fields.placeholderWebsite")}
              placeholderTextColor="#888"
              value={form.site}
              onChangeText={(t) => updateField("site", t)}
              autoCapitalize="none"
              style={[styles.input, errors.site && { borderColor: "red" }]}
            />
          </Field>

          <Field
            labelKey="fields.labelNameDescription"
            error={errors.descricao}
          >
            <TextInput
              placeholder={t("fields.placeholderDescription")}
              placeholderTextColor="#888"
              value={form.descricao}
              multiline
              onChangeText={(t) => updateField("descricao", t)}
              style={[
                styles.textArea,
                errors.descricao && { borderColor: "red" },
              ]}
            />
          </Field>

          <Field labelKey="fields.labelEmail" error={errors.emailStartup}>
            <TextInput
              placeholder={t("fields.placeholderEmailStartup")}
              placeholderTextColor="#888"
              value={form.emailStartup}
              onChangeText={(t) => updateField("emailStartup", t)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                errors.emailStartup && { borderColor: "red" },
              ]}
            />
          </Field>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.textButton}>
              {t("buttons.titleRegisterAll")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
