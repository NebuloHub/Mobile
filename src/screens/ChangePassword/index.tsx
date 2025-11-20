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

export default function ChangePasswordScreen({ navigation }: any) {
  const { user } = useAuth();
  const { colors } = useTheme();
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
      return Alert.alert("Erro", "A senha deve ter pelo menos 5 caracteres.");
    }

    if (senha !== confirmSenha) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    try {
      const updated = await putUserByCPF(currentUser.cpf, {
        ...currentUser,
        senha,
      });

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
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
        <Text style={styles.titulo}>Alterar Senha</Text>

        <Field label="Nova Senha">
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </Field>

        <Field label="Confirmar Nova Senha">
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmSenha}
            onChangeText={setConfirmSenha}
          />
        </Field>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.textButton}>Salvar Nova Senha</Text>
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
