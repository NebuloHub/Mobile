import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useAuth } from "../../context/AuthContext";
import { getUserByCPF } from "../../api/usuario";
import { UserResponse } from "../../types/usuario";
import StartupCard from "../../components/StartupCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();

  const defaultImage = require("../../../assets/placeholders/user.jpg");

  const [profileImage, setProfileImage] = useState<any>(defaultImage);
  const [fullUser, setFullUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [showZoom, setShowZoom] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Carregar usuário completo
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

  // Selecionar da galeria
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
    setShowOptions(false);
  };

  // Tirar foto
  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão da câmera negada!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
    setShowOptions(false);
  };

  // Remover foto
  const removePhoto = () => {
    setProfileImage(defaultImage);
    setShowOptions(false);
  };

  if (loading || !fullUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* CARD DO PERFIL */}
        <View style={styles.card}>

          {/* FOTO */}
          <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.profileWrapper}>
            <Image source={profileImage} style={styles.profileImage} />
          </TouchableOpacity>

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

        {fullUser.startups?.length ? (
          fullUser.startups.map((st) => (
            <View key={st.cnpj} style={{ marginBottom: 16 }}>
              <StartupCard
                data={st}
                onPress={() => navigation.navigate("StartupDetails", { cnpj: st.cnpj })}
              />
            </View>
          ))
        ) : (
          <Text>Você ainda não cadastrou nenhuma Startup.</Text>
        )}

      </ScrollView>

      {/* --- MENU DE OPÇÕES DE FOTO --- */}
      {showOptions && (
        <View style={styles.optionPanel}>
          <TouchableOpacity style={styles.optionRow} onPress={() => setShowZoom(true)}>
            <Text style={styles.optionText}>Ver a imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={pickImage}>
            <Text style={styles.optionText}>Trocar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={takePhoto}>
            <Text style={styles.optionText}>Tirar foto com a câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={removePhoto}>
            <Text style={[styles.optionText, { color: "red" }]}>Remover foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => setShowOptions(false)}>
            <Text style={styles.optionText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- ZOOM FULLSCREEN --- */}
      <Modal visible={showZoom} transparent>
        <View style={styles.zoomContainer}>
          <TouchableOpacity style={styles.zoomBackground} onPress={() => setShowZoom(false)} />
          <Image source={profileImage} style={styles.zoomImage} resizeMode="contain" />
        </View>
      </Modal>

    </SafeAreaView>
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

  profileWrapper: {
    alignSelf: "center",
    marginTop: -60,
    zIndex: 10,
  },

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
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

  optionPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },

  optionRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  optionText: {
    textAlign: "center",
    fontSize: 16,
  },

  zoomContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  zoomBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  zoomImage: {
    width: "100%",
    height: "80%",
  },
});
