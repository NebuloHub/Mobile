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

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

import Field from "../../components/Field";
import { postHabilidade } from "../../api/habilidade";
import { HabilidadeResquest } from "../../types/habilidade";

import { t } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

export default function RegisterHabilidadeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);
  const { lang } = useLanguage();

  const [form, setForm] = useState<HabilidadeResquest>({
    nomeHabilidade: "",
    tipoHabilidade: "",
  });

  const [errors, setErrors] = useState({
    nomeHabilidade: false,
    tipoHabilidade: false,
  });

  const updateField = (key: keyof HabilidadeResquest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleRegister = async () => {
    let newErrors = { ...errors };
    let msg = "";

    if (!form.nomeHabilidade.trim()) {
      newErrors.nomeHabilidade = true;
      msg = t("logs.errorInvalidNameSkill");
    }

    if (!form.tipoHabilidade.trim()) {
      newErrors.tipoHabilidade = true;
      msg = t("logs.errorInvalidTypeSkill");
    }

    setErrors(newErrors);
    if (msg) return Alert.alert(t("logs.titleError"), msg);

    try {
      const res = await postHabilidade(form);

      Alert.alert(t("logs.titleSucess"), t("logs.contexRegisterSkill"));

      navigation.goBack(); 
    } catch (err: any) {
      Alert.alert(t("logs.titleErrorRegister"), err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.titulo}>{t("titles.registerSkill")}</Text>
        </View>

        <View style={styles.formCorpo}>
          <Field labelKey="fields.labelNameSkill" error={errors.nomeHabilidade}>
            <TextInput
              value={form.nomeHabilidade}
              placeholder={t("fields.placeholderNameSkill")}
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("nomeHabilidade", t)}
              style={[
                styles.input,
                { borderColor: errors.nomeHabilidade ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <Field labelKey="fields.labelTypeSkill" error={errors.tipoHabilidade}>
            <TextInput
              value={form.tipoHabilidade}
              placeholder={t("fields.placeholderTypeSkill")}
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("tipoHabilidade", t)}
              style={[
                styles.input,
                { borderColor: errors.tipoHabilidade ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.textButton}>{t("buttons.titleRegisterAll")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outroButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textOutroButton}>{t("buttons.titleGoBack")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
