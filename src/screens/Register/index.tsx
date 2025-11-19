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

import { globalStyles } from "../../styles/global";

export default function RegisterScreen({ navigation }: any) {

  const styles = globalStyles;

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
      role: "USER",
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
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.forms}>
        <LanguageToggleButton />

        <View style={{ alignItems: "center"}}>
          <Text style={styles.titulo}>Criar uma conta</Text>
        </View>

        <View style={styles.formCorpo}>

          <Field label="CPF" error={errors.cpf}>
            <MaskedTextInput
              mask="999.999.999-99"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={form.cpf}
              onChangeText={(t) => updateField("cpf", t)}
              placeholder="Digite aqui seu CPF"
              style={[styles.input,{borderColor: errors.cpf ? "red" : "#ccc"}]}
            />
          </Field>

          <Field label="Nome" error={errors.nome}>
            <TextInput
              value={form.nome}
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("nome", t)}
              placeholder="Digite aqui seu nome"
              style={[styles.input,{
                borderColor: errors.nome ? "red" : "#ccc",
              }]}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <TextInput
              value={form.email}
              placeholderTextColor="#888"
              onChangeText={(t) => updateField("email", t)}
              placeholder="Digite aqui seu email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input,{
                borderColor: errors.email ? "red" : "#ccc",
              }]}
            />
          </Field>

          <Field label="Telefone (opcional)" error={false}>
            <MaskedTextInput
              mask="(99) 99999-9999"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={form.telefone}
              onChangeText={(t) => updateField("telefone", t)}
              placeholder="Digite aqui seu telefone"
              style={[styles.input,{
                borderColor: "#ccc",
              }]}
            />
          </Field>

          <View>

            <Field label="Senha" error={errors.senha}>
            <View
              style={[styles.passwordContainer,{
                borderColor: errors.senha ? "red" : "#ccc",
              }]}
            >
              <TextInput
                value={form.senha}
                placeholderTextColor="#888"
                onChangeText={(t) => updateField("senha", t)}
                placeholder="Digite aqui sua senha"
                secureTextEntry={!showPass}
                style={styles.textoSenha}
              />


              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  style={styles.olho}
                />
              </TouchableOpacity>
            </View>

            
          </Field>

          <PasswordStrengthBar score={getPasswordStrength(form.senha)} />

          </View>

          



          <Field label="Confirmar Senha" error={errors.confirmarSenha}>
            <View
              style={[styles.passwordContainer,{
                borderColor: errors.confirmarSenha ? "red" : "#ccc",
              }]}
            >
              <TextInput
                value={form.confirmarSenha}
                placeholderTextColor="#888"
                onChangeText={(t) => updateField("confirmarSenha", t)}
                placeholder="Confirme sua senha"
                secureTextEntry={!showConfirmPass}
                style={styles.textoSenha}
              />
              <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                <Ionicons
                  name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  style={styles.olho}
                />
              </TouchableOpacity>
            </View>
          </Field>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.textButton}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

        </View>

        

        <View>
          <TouchableOpacity style={styles.outroButton}  onPress={() => navigation.navigate("Login")}>
            <Text style={styles.textOutroButton}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
