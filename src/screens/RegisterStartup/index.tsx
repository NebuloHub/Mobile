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

export default function RegisterStartupScreen({ navigation }: any) {
  const { user } = useAuth();

  // FORM STATES
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

  // Erros do formulário
  const [errors, setErrors] = useState({
    cnpj: false,
    video: false,
    nomeStartup: false,
    site: false,
    descricao: false,
    emailStartup: false,
  });

  // Preenche automaticamente nomeResponsavel + CPF
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

  // ----------------------
  // VALIDADORES
  // ----------------------
  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function isValidURL(url: string) {
    return /^https?:\/\/.+/.test(url);
  }

  // ----------------------
  // HANDLE REGISTER
  // ----------------------
  const handleRegister = async () => {
    let newErrors = { ...errors };
    let msg = "";

    // CNPJ
    const cnpjNumbers = form.cnpj.replace(/\D/g, "");
    if (cnpjNumbers.length !== 14) {
      newErrors.cnpj = true;
      msg = "CNPJ inválido. Deve conter 14 dígitos.";
    }
    // Nome Startup
    else if (!form.nomeStartup.trim()) {
      newErrors.nomeStartup = true;
      msg = "O nome da startup é obrigatório.";
    }
    // Site
    else if (!isValidURL(form.site)) {
      newErrors.site = true;
      msg = "Insira um site válido (http:// ou https://).";
    }
    // Descrição
    else if (form.descricao.length < 10) {
      newErrors.descricao = true;
      msg = "A descrição deve ter pelo menos 10 caracteres.";
    }
    // Email corporativo
    else if (!isValidEmail(form.emailStartup)) {
      newErrors.emailStartup = true;
      msg = "E-mail corporativo inválido.";
    }
    // Vídeo opcional
    else if (form.video && !isValidURL(form.video)) {
      newErrors.video = true;
      msg = "URL do vídeo inválida.";
    }

    setErrors(newErrors);
    if (msg) return Alert.alert("Erro", msg);

    const payload: StartupRequest = {
      ...form,
      cnpj: cnpjNumbers,
      usuarioCPF: form.usuarioCPF, // já vem correto do AuthContext
      nomeResponsavel: form.nomeResponsavel, // também automático
    };

    console.log("📤 Enviando startup:", payload);

    try {
      await registerStartup(payload);
      Alert.alert("Sucesso!", "Startup registrada com sucesso!");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro ao registrar", err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <LanguageToggleButton />

        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>
          Registrar Startup
        </Text>

        {/* CNPJ */}
        <Field label="CNPJ" error={errors.cnpj}>
          <MaskedTextInput
            mask="99.999.999/9999-99"
            keyboardType="numeric"
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            onChangeText={(t) => updateField("cnpj", t)}
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.cnpj ? "red" : "#ccc",
            }}
          />
        </Field>

        {/* Vídeo */}
        <Field label="Vídeo Pitch (opcional)" error={errors.video}>
          <TextInput
            placeholder="URL do vídeo"
            value={form.video}
            onChangeText={(t) => updateField("video", t)}
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.video ? "red" : "#ccc",
            }}
          />
        </Field>

        {/* Nome Startup */}
        <Field label="Nome da Startup" error={errors.nomeStartup}>
          <TextInput
            placeholder="Digite o nome"
            value={form.nomeStartup}
            onChangeText={(t) => updateField("nomeStartup", t)}
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.nomeStartup ? "red" : "#ccc",
            }}
          />
        </Field>

        {/* Site */}
        <Field label="Site" error={errors.site}>
          <TextInput
            placeholder="https://suaempresa.com"
            value={form.site}
            onChangeText={(t) => updateField("site", t)}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.site ? "red" : "#ccc",
            }}
          />
        </Field>

        {/* Descrição */}
        <Field label="Descrição" error={errors.descricao}>
          <TextInput
            placeholder="Descreva sua startup"
            value={form.descricao}
            multiline
            onChangeText={(t) => updateField("descricao", t)}
            style={{
              height: 100,
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              textAlignVertical: "top",
              borderColor: errors.descricao ? "red" : "#ccc",
            }}
          />
        </Field>

        {/* Email corporativo */}
        <Field label="Email Corporativo" error={errors.emailStartup}>
          <TextInput
            placeholder="email@startup.com"
            value={form.emailStartup}
            onChangeText={(t) => updateField("emailStartup", t)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.emailStartup ? "red" : "#ccc",
            }}
          />
        </Field>

        {/* Botão */}
        <TouchableOpacity
          onPress={handleRegister}
          style={{
            backgroundColor: "#007bff",
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            Registrar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Componente de layout */
function Field({ label, error, children }: any) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontSize: 15, fontWeight: "500", marginBottom: 6 }}>
        {label}
      </Text>
      {children}
      {error && (
        <Text style={{ color: "red", fontSize: 13, marginTop: 3 }}>
          Campo inválido
        </Text>
      )}
    </View>
  );
}
