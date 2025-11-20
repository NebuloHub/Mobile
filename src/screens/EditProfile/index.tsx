import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
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

export default function EditProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const [form, setForm] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.cpf) return;

      const data = await getUserByCPF(user.cpf);
      setForm(data);
      setLoading(false);
    };

    load();
  }, [user?.cpf]);

  const handleUpdate = async () => {
    if (!form || !user?.cpf) return;

    try {
      const updated = await putUserByCPF(user.cpf, form);

      Alert.alert(t("logs.titleSucess"), t("logs.sucessUpdateUser"));
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert(t("logs.titleError"), t("logs.errorUpdateUser"));
    }
  };

  if (loading || !form) {
    return (
      <View style={{ padding: 20 }}>
        <Text>{t("titles.loading")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.pagina}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={styles.titulo}>{t("buttons.titleEditUser")}</Text>

        <Field labelKey="fields.labelName">
          <TextInput
            style={styles.input}
            value={form.nome}
            onChangeText={(t) => setForm({ ...form, nome: t })}
          />
        </Field>

        <Field labelKey="fields.labelEmail">
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
        </Field>

        <Field labelKey="fields.labelPhone">
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={String(form.telefone || "")}
            onChangeText={(t) =>
              setForm({ ...form, telefone: Number(t.replace(/\D/g, "")) })
            }
          />
        </Field>

        <Field labelKey="fields.labelCPF">
          <TextInput
            style={[styles.input, { opacity: 0.6 }]}
            editable={false}
            value={form.cpf}
          />
        </Field>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.textButton}>{t("buttons.SaveChanges")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.textButton}>{t("buttons.changePassword")}</Text>
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
