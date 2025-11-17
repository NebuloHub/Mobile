import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getAllStartups } from "../../api/startup";
import StartupCard from "../../components/StartupCard";
import { AllStartupsResponse } from "../../types/startup";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Home({ navigation }: any) {
  const { signOut } = useAuth();
  
  const [startups, setStartups] = useState<AllStartupsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    try {
      const data = await getAllStartups();
      setStartups(data);
    } catch (error) {
      console.log("Erro ao carregar startups:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={signOut}>
        <Text>Sair</Text>
      </TouchableOpacity>
      <View>
        <Text>NebuloHub</Text>
        <Ionicons name="add-outline" size={22} />
      </View>
      <FlatList
        data={startups}
        keyExtractor={(item) => item.cnpj}
        renderItem={({ item }) => (
          <StartupCard
            data={item}
            onPress={() =>
              navigation.navigate("StartupDetails", { cnpj: item.cnpj })
            }
          />
        )}
      />
    </View>
  );
}
