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
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

export default function Home({ navigation }: any) {
  const { signOut } = useAuth();

  const { colors } = useTheme();
  const styles = globalStyles(colors);

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
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      
      <View style={styles.headerHome}>

        {/* fiz o botão de dar loading ser o nome do nosso projeto*/}
        <TouchableOpacity onPress={loadStartups}>
          <Text style={styles.tituloHome}>NebuloHub</Text>
        </TouchableOpacity>

        <View>

          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterStartup")}>
            <Ionicons name="add-outline" size={35}  style={styles.botaoHeader}/>
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
    </SafeAreaView>
  );
}
