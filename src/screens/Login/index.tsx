import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();

  function handleLogin() {
    login({ name: "Usuário" });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Button title="Entrar" onPress={handleLogin} />
      <Button
        title="Criar conta"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
