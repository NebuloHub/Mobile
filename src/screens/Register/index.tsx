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
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import PasswordStrengthBar, {
  getPasswordStrength,
} from "../../components/PasswordStrengthBar";
import { isValidEmail, isValidatePassword } from "../../utils/validators";
import LanguageToggleButton from "../../components/LanguageToggleButton";
import Field from "../../components/Field";

export default function RegisterScreen({ navigation }: any) {
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
      msg = "CPF inválido. Deve conter 11 dígitos.";
    } else if (!form.nome.trim()) {
      newErrors.nome = true;
      msg = "Nome é obrigatório.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = true;
      msg = "E-mail inválido.";
    } else if (!isValidatePassword(form.senha)) {
      newErrors.senha = true;
      msg =
        "A senha deve conter letra maiúscula, minúscula, número, caractere especial e mínimo 8 caracteres.";
    } else if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = true;
      msg = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    if (msg) return Alert.alert("Erro", msg);

    const payload = {
      cpf: cpfNumbers,
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      role: form.role,
      telefone: form.telefone
        ? Number(form.telefone.replace(/\D/g, ""))
        : 0,
    };

    try {
      await signUp(payload);
      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Erro no cadastro", err.message);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <LanguageToggleButton />

        <View>
          <Text>Criar uma conta</Text>
        </View>

        <Field label="CPF" error={errors.cpf}>
          <MaskedTextInput
            mask="999.999.999-99"
            keyboardType="numeric"
            value={form.cpf}
            onChangeText={(t) => updateField("cpf", t)}
            placeholder="Digite aqui seu CPF"
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.cpf ? "red" : "#ccc",
            }}
          />
        </Field>

        <Field label="Nome" error={errors.nome}>
          <TextInput
            value={form.nome}
            onChangeText={(t) => updateField("nome", t)}
            placeholder="Digite aqui seu nome"
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.nome ? "red" : "#ccc",
            }}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <TextInput
            value={form.email}
            onChangeText={(t) => updateField("email", t)}
            placeholder="Digite aqui seu email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: errors.email ? "red" : "#ccc",
            }}
          />
        </Field>

        <Field label="Telefone (opcional)" error={false}>
          <MaskedTextInput
            mask="(99) 99999-9999"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={(t) => updateField("telefone", t)}
            placeholder="Digite aqui seu telefone"
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: "#ccc",
            }}
          />
        </Field>

        <Field label="Senha" error={errors.senha}>
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.senha ? "red" : "#ccc",
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              value={form.senha}
              onChangeText={(t) => updateField("senha", t)}
              placeholder="Digite aqui sua senha"
              secureTextEntry={!showPass}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </Field>

        <PasswordStrengthBar score={getPasswordStrength(form.senha)} />

        <Field label="Confirmar Senha" error={errors.confirmarSenha}>
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.confirmarSenha ? "red" : "#ccc",
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              value={form.confirmarSenha}
              onChangeText={(t) => updateField("confirmarSenha", t)}
              placeholder="Confirme sua senha"
              secureTextEntry={!showConfirmPass}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
              <Ionicons
                name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </Field>

        <View>
          <View>
            <Text>Tipo de usuário:</Text>
          </View>
          <Picker
            selectedValue={form.role}
            onValueChange={(v) => updateField("role", v)}
            >
            <Picker.Item label="Usuário" value="USER" />
            <Picker.Item label="Administrador" value="ADMIN" />
          </Picker>
        </View>

        <View>
          <TouchableOpacity onPress={handleRegister}>
            <Text>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
