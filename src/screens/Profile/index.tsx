import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getUserByCPF } from "../../api/usuario";
import { UserResponse } from "../../types/usuario";
import StartupCard from "../../components/StartupCard";

export default function ProfileScreen({navigation}: any) {
  const { user } = useAuth(); 

  const [fullUser, setFullUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      setLoading(true);
      if (!user?.cpf) return;

      const userData = await getUserByCPF(user.cpf);
      setFullUser(userData);
    } catch (err) {
      console.log("Erro ao carregar informações completas do usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [user?.cpf]);

  if (loading || !fullUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Meu Perfil</Text>

        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{fullUser.nome}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{fullUser.cpf}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{fullUser.email}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{fullUser.telefone || "—"}</Text>

        <Text style={styles.label}>Cargo:</Text>
        <Text style={styles.value}>{fullUser.role}</Text>
      </View>

      {/* STARTUPS */}
      <Text style={styles.sectionTitle}>Minhas Startups</Text>

      {fullUser.startups && fullUser.startups.length > 0 ? (
        fullUser.startups.map((st) => (
          <View key={st.cnpj} style={{ marginBottom: 16 }}>
            <StartupCard
              data={st}
              onPress={() => navigation.navigate("StartupDetails", { cnpj: st.cnpj })
              }
            />
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Você ainda não cadastrou nenhuma Startup.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  noData: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 10,
  },
});
