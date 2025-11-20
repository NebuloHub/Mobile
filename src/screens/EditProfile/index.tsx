import React, { useEffect, useState } from "react";
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
import { getUserByCPF, putUserByCPF } from "../../api/usuario";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

import Field from "../../components/Field";
import { isValidEmail } from "../../utils/validators";

export default function EditProfileScreen({ navigation }: any) {
  const { user, setUser } = useAuth(); 
  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const [errors, setErrors] = useState({
    nome: false,
    email: false,
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.cpf) return;

      try {
        const data = await getUserByCPF(user.cpf);

        setForm({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone ? String(data.telefone) : "",
        });
      } catch (e) {
        Alert.alert("Erro", "Falha ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleUpdate = async () => {
    let newErrors = { ...errors };
    let msg = "";

    if (!form.nome.trim()) {
      newErrors.nome = true;
      msg = "Nome é obrigatório.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = true;
      msg = "E-mail inválido.";
    }

    setErrors(newErrors);
    if (msg) return Alert.alert("Erro", msg);

    try {
      const payload = {
        cpf: user!.cpf,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone ? Number(form.telefone.replace(/\D/g, "")) : 0,
        role: user!.role, 
        senha: "",
      };

      const updated = await putUserByCPF(user!.cpf, payload);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              nome: updated.nome,
              email: updated.email,
              telefone: updated.telefone,
            }
          : prev
      );

      Alert.alert("Sucesso!", "Dados atualizados com sucesso!");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Não foi possível atualizar.");
    }
  };

  if (loading) {
    return (
      <View style={{ padding: 30 }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.titulo}>Editar Perfil</Text>
        </View>

        <View style={styles.formCorpo}>

          <Field label="Nome" error={errors.nome}>
            <TextInput
              value={form.nome}
              placeholder="Digite seu nome"
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("nome", t)}
              style={[
                styles.input,
                { borderColor: errors.nome ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <TextInput
              value={form.email}
              placeholder="Digite seu email"
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("email", t)}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                { borderColor: errors.email ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <Field label="Telefone" error={false}>
            <MaskedTextInput
              mask="(99) 99999-9999"
              value={form.telefone}
              placeholder="Digite seu telefone"
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("telefone", t)}
              keyboardType="phone-pad"
              style={[styles.input, { borderColor: "#ccc" }]}
            />
          </Field>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.textButton}>Salvar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
