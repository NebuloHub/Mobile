import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Home({ navigation }: any) {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>

      <Button
        title="Ir para Informações"
        onPress={() => navigation.navigate("Info")}
      />

      <Button title="Logout" color="red" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
