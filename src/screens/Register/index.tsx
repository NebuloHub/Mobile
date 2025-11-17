import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import PasswordStrengthBar, {
  getPasswordStrength,
} from "../../components/PasswordStrengthBar";
import {
  validateEmail,
  validatePassword,
} from "../../utils/validators";
import LanguageToggleButton from '../../components/LanguageToggleButton';

export default function RegisterScreen({ navigation }: any) {
  const { signUp } = useAuth();

  // FORM STATES
  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    role: "USER",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  // Senha visível
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Errors visuais
  const [errors, setErrors] = useState({
    cpf: false,
    nome: false,
    email: false,
    senha: false,
    confirmarSenha: false,
  });

  // --- HANDLE REGISTER ---
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
    } else if (!validateEmail(form.email)) {
      newErrors.email = true;
      msg = "E-mail inválido.";
    } else if (!validatePassword(form.senha)) {
      newErrors.senha = true;
      msg =
        "A senha deve conter letra maiúscula, minúscula, número, caractere especial e mínimo 8 caracteres.";
    } else if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = true;
      msg = "As senhas não coincidem.";
    }

    setErrors(newErrors);

    if (msg) {
      Alert.alert("Erro", msg);
      return;
    }

    const payload = {
      CPF: form.cpf,
      Nome: form.nome,
      Email: form.email,
      Senha: form.senha,
      Role: form.role,
      Telefone: form.telefone
        ? Number(form.telefone.replace(/\D/g, ""))
        : 0,
    };

    console.log("📤 Enviando para API:", payload);

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
      <View>
        <LanguageToggleButton/>
      </View>

      <View>
        <Text> Criar uma conta</Text>
      </View>

      <View>
        {/* CPF */}
        <View>
          <Text>CPF</Text>
          <MaskedTextInput
            mask="999.999.999-99"
            keyboardType="numeric"
            value={form.cpf}
            onChangeText={(t) => updateField("cpf", t)}
            placeholder="Digite aqui seu cpf"
            style={{
              borderWidth: 1,
              borderColor: errors.cpf ? "red" : "#ccc",
            }}
          />
        </View>

        {/* Nome */}
        <View>
          <Text>Nome</Text>
          <TextInput
            value={form.nome}
            onChangeText={(t) => updateField("nome", t)}
            placeholder="Digite aqui seu nome"
            style={{
              borderWidth: 1,
              borderColor: errors.nome ? "red" : "#ccc",
            }}
          />
        </View>

        {/* Email */}
        <View>
          <Text>Email</Text>  
          <TextInput
            value={form.email}
            onChangeText={(t) => updateField("email", t)}
            placeholder="Digite aqui seu email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: errors.email ? "red" : "#ccc",

            }}
          />
        </View>

        {/* Telefone */}
        <View>
          <Text>Telefone (opcional)</Text>
          <MaskedTextInput
            mask="(99) 99999-9999"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={(t) => updateField("telefone", t)}
            placeholder="Digite aqui seu telefone"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          />
        </View>

        {/* Senha */}
        <View>
          <Text>Senha</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.senha ? "red" : "#ccc",
            }}
          >
            <TextInput
              value={form.senha}
              onChangeText={(t) => updateField("senha", t)}
              placeholder="Digite aqui sua senha"
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </View>

        <PasswordStrengthBar score={getPasswordStrength(form.senha)} />

        {/* Confirmar Senha */}
        <View>
          <Text>Confirmar Senha</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.confirmarSenha ? "red" : "#ccc",
            }}
          >
            <TextInput
              value={form.confirmarSenha}
              onChangeText={(t) => updateField("confirmarSenha", t)}
              placeholder="Confirme sua senha aqui"
              secureTextEntry={!showConfirmPass}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPass(!showConfirmPass)}
            >
              <Ionicons
                name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role */}
        <Text>Tipo de usuário:</Text>
        <Picker
          selectedValue={form.role}
          onValueChange={(v) => updateField("role", v)}
        >
          <Picker.Item label="Usuário" value="USER" />
          <Picker.Item label="Administrador" value="ADMIN" />
        </Picker>
      </View>

      {/* Botão */}
      <View>

        <TouchableOpacity
          onPress={handleRegister}
          >
          <Text>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}