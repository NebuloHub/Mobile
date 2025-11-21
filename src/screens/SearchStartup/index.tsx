import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAllStartups } from "../../api/startup";
import { AllStartupsResponse } from "../../types/startup";
import SearchStartupItem from "../../components/SearchStartupItem";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

import { t } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

export default function SearchStartupScreen({ navigation }: any) {
  const [startups, setStartups] = useState<AllStartupsResponse[]>([]);
  const [filtered, setFiltered] = useState<AllStartupsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  const { colors } = useTheme();
  const styles = globalStyles(colors);

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
        setFiltered(
          data.filter((s) => s.nomeStartup.toLowerCase().includes(termo))
        );
      } else {
        setFiltered(data);
      }
    } catch (err) {
      Alert.alert(`${t("logs.errorLoadingStartups")}, ${err}`);
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
    setFiltered(
      startups.filter((s) => s.nomeStartup.toLowerCase().includes(termo))
    );
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <TouchableOpacity style={{ padding: 15 }} onPress={loadStartups}>
        <Text style={styles.tituloHome}>{t("buttons.titleSeacrh")}</Text>
      </TouchableOpacity>

      <View style={styles.pesquisa}>
        <Ionicons name="search-outline" size={20} style={{ color: "#000" }} />
        <TextInput
          placeholder={t("fields.placeholderSearchStartup")}
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.cnpj}
        renderItem={({ item }) => (
          <SearchStartupItem
            data={item}
            onPress={() =>
              navigation.navigate("StartupDetails", { cnpj: item.cnpj })
            }
          />
        )}
        refreshing={refreshing}
        onRefresh={loadStartups}
        ListEmptyComponent={<Text>{t("logs.errorNotFoundStartup")}</Text>}
      />
    </SafeAreaView>
  );
}
