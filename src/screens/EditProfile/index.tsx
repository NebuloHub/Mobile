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

export default function EditProfileScreen({ navigation }: any) {
  const { user } = useAuth();
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

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  if (loading || !form) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.pagina}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={styles.titulo}>Editar Perfil</Text>

        <Field label="Nome">
          <TextInput
            style={styles.input}
            value={form.nome}
            onChangeText={(t) => setForm({ ...form, nome: t })}
          />
        </Field>

        <Field label="Email">
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
        </Field>

        <Field label="Telefone">
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={String(form.telefone || "")}
            onChangeText={(t) =>
              setForm({ ...form, telefone: Number(t.replace(/\D/g, "")) })
            }
          />
        </Field>

        <Field label="CPF">
          <TextInput
            style={[styles.input, { opacity: 0.6 }]}
            editable={false}
            value={form.cpf}
          />
        </Field>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.textButton}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.textButton}>Alterar Senha</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textButton}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
