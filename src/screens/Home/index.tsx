import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
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
      setLoading(true);
      const data = await getAllStartups();
      setStartups(data);
    } catch (error) {
      console.log("Erro ao carregar startups:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View>
        <Text>NebuloHub</Text>

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchStartup")}
          >
            <Ionicons name="search-outline" size={22} />
          </TouchableOpacity>

          <TouchableOpacity onPress={loadStartups}>
            <Ionicons name="refresh-outline" size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterStartup")}
          >
            <Ionicons name="add-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
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
      )}
    </View>
  );
}