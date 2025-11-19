import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { getAllStartups } from "../../api/startup";
import { AllStartupsResponse } from "../../types/startup";
import SearchStartupItem from "../../components/SearchStartupItem";
import { Ionicons } from "@expo/vector-icons";

export default function SearchStartupScreen({ navigation }: any) {
  const [startups, setStartups] = useState<AllStartupsResponse[]>([]);
  const [filtered, setFiltered] = useState<AllStartupsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    try {
      setRefreshing(true);
      const data = await getAllStartups();
      setStartups(data);

      if (query.trim()) {
        const termo = query.toLowerCase();
        setFiltered(data.filter((s) => s.nomeStartup.toLowerCase().includes(termo)));
      } else {
        setFiltered(data);
      }
    } catch (err) {
      console.log("Erro ao carregar startups:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text.trim()) {
      setFiltered(startups);
      return;
    }

    const termo = text.toLowerCase();
    setFiltered(startups.filter((s) => s.nomeStartup.toLowerCase().includes(termo)));
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
      <View>
        <View>
          <TouchableOpacity onPress={loadStartups}>
            <Ionicons name="refresh-outline" size={22} color="#007bff" />
          </TouchableOpacity>
        </View>

        <View>
          <Ionicons name="search-outline" size={20} color="#555"/>
          <TextInput
            placeholder="Pesquisar startup..."
            value={query}
            onChangeText={handleSearch}
          />
        </View>

      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.cnpj}
        renderItem={({ item }) => (
          <SearchStartupItem
            data={item}
            onPress={() => navigation.navigate("StartupDetails", { cnpj: item.cnpj })}
          />
        )}
        refreshing={refreshing}
        onRefresh={loadStartups}
        ListEmptyComponent={
          <Text>Nenhuma startup encontrada</Text>
        }
      />
    </View>
  );
}
