import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaskedTextInput } from "react-native-mask-text";
import { registerStartup } from "../../api/startup";
import { StartupRequest } from "../../types/startup";
import LanguageToggleButton from "../../components/LanguageToggleButton";
import { useAuth } from "../../context/AuthContext";
import { isValidEmail, isValidURL } from "../../utils/validators";
import Field from "../../components/Field";

import { globalStyles } from "../../styles/global";

export default function RegisterStartupScreen({ navigation }: any) {
  const { user } = useAuth();

    const styles = globalStyles;

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
      msg = "CNPJ inválido. Deve conter 14 dígitos.";
    } else if (!form.nomeStartup.trim()) {
      newErrors.nomeStartup = true;
      msg = "O nome da startup é obrigatório.";
    } else if (!isValidURL(form.site)) {
      newErrors.site = true;
      msg = "Insira um site válido (http:// ou https://).";
    } else if (form.descricao.length < 10) {
      newErrors.descricao = true;
      msg = "A descrição deve ter pelo menos 10 caracteres.";
    } else if (!isValidEmail(form.emailStartup)) {
      newErrors.emailStartup = true;
      msg = "E-mail corporativo inválido.";
    } else if (form.video && !isValidURL(form.video)) {
      newErrors.video = true;
      msg = "URL do vídeo inválida.";
    }

    setErrors(newErrors);
    if (msg) return Alert.alert("Erro", msg);

    const payload: StartupRequest = {
      ...form,
      cnpj: cnpjNumbers,
    };

    try {
      await registerStartup(payload);
      Alert.alert("Sucesso!", "Startup registrada com sucesso!");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro ao registrar", err.message);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <LanguageToggleButton />

        <View style={{ alignItems: "center"}}>
          <Text style={styles.titulo}>Cadastro Startup</Text>
        </View>

        <View style={styles.formCorpo}>

          {/* CNPJ */}
          <Field label="CNPJ" error={errors.cnpj}>
            <MaskedTextInput
              mask="99.999.999/9999-99"
              placeholderTextColor="#888"
              keyboardType="numeric"
              placeholder="Digite aqui o CNPJ da startup"
              value={form.cnpj}
              onChangeText={(t) => updateField("cnpj", t)}
              style={[
                styles.input,
                errors.cnpj && { borderColor: "red" },
              ]}
            />
          </Field>

          <Field label="Vídeo Pitch (opcional)" error={errors.video}>
            <TextInput
              placeholder="URL do Pitch (YouTube, Loom, etc.)"
              placeholderTextColor="#888"
              value={form.video}
              onChangeText={(t) => updateField("video", t)}
              style={[
                styles.input,
                errors.video && { borderColor: "red" },
              ]}
            />
          </Field>

          <Field label="Nome da Startup" error={errors.nomeStartup}>
            <TextInput
              placeholder="Digite o nome da startup"
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
          <Field label="Site" error={errors.site}>
            <TextInput
              placeholder="https://sua-startup.com"
              placeholderTextColor="#888"
              value={form.site}
              onChangeText={(t) => updateField("site", t)}
              autoCapitalize="none"
              style={[
                styles.input,
                errors.site && { borderColor: "red" },
              ]}
            />
          </Field>

          <Field label="Descrição" error={errors.descricao}>
            <TextInput
              placeholder="Descreva sua startup"
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

          <Field label="Email Corporativo" error={errors.emailStartup}>
            <TextInput
              placeholder="email@suaempresa.com"
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
            <Text style={styles.textButton}>Registrar</Text>
          </TouchableOpacity>

        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

