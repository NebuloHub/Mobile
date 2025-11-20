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

export default function RegisterHabilidadeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);

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
      msg = "O nome da habilidade é obrigatório.";
    }

    if (!form.tipoHabilidade.trim()) {
      newErrors.tipoHabilidade = true;
      msg = "O tipo da habilidade é obrigatório.";
    }

    setErrors(newErrors);
    if (msg) return Alert.alert("Erro", msg);

    try {
      const res = await postHabilidade(form);

      Alert.alert("Sucesso!", "Habilidade cadastrada com sucesso!");

      navigation.goBack(); // ou navega para listagem se preferir
    } catch (err: any) {
      Alert.alert("Erro ao cadastrar", err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.titulo}>Cadastrar Habilidade</Text>
        </View>

        <View style={styles.formCorpo}>

          <Field label="Nome da Habilidade" error={errors.nomeHabilidade}>
            <TextInput
              value={form.nomeHabilidade}
              placeholder="Ex: Comunicação"
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("nomeHabilidade", t)}
              style={[
                styles.input,
                { borderColor: errors.nomeHabilidade ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <Field label="Tipo de Habilidade" error={errors.tipoHabilidade}>
            <TextInput
              value={form.tipoHabilidade}
              placeholder="Ex: Técnica, Comportamental..."
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("tipoHabilidade", t)}
              style={[
                styles.input,
                { borderColor: errors.tipoHabilidade ? "red" : "#ccc" },
              ]}
            />
          </Field>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.textButton}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outroButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textOutroButton}>Voltar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
