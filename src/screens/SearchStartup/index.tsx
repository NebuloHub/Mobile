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

      // Aplica filtro novamente se houver texto
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
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Topo: Refresh + Search */}
      <View style={styles.topBar}>

        {/* Botão Refresh */}
        <TouchableOpacity onPress={loadStartups} style={styles.refreshBtn}>
          <Ionicons name="refresh-outline" size={22} color="#007bff" />
        </TouchableOpacity>

        {/* Campo de busca */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#555" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Pesquisar startup..."
            value={query}
            onChangeText={handleSearch}
            style={{ flex: 1 }}
          />
        </View>

      </View>

      {/* Lista filtrada */}
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
          <Text style={styles.empty}>Nenhuma startup encontrada</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  refreshBtn: {
    padding: 8,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007bff55",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
