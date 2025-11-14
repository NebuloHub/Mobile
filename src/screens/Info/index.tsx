import { View, Text, StyleSheet } from "react-native";

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações Gerais</Text>
      <Text style={styles.text}>Aqui ficam informações genéricas do app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, color: "#555" },
});
