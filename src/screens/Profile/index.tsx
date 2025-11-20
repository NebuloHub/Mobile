import React, { useEffect, useState, useCallback } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { getUserByCPF } from "../../api/usuario";
import StartupCard from "../../components/StartupCard";
import { UserResponse } from "../../types/usuario";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();

  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const defaultImage = require("../../../assets/placeholders/user.jpg");

  const [profileImage, setProfileImage] = useState<any>(defaultImage);
  const [fullUser, setFullUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [showZoom, setShowZoom] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.cpf) return;

      const userData = await getUserByCPF(user.cpf);
      setFullUser(userData);
    } catch (err) {
      console.log("Erro ao carregar usuário:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.cpf]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão da câmera negada!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
    setShowOptions(false);
  };

  const removePhoto = () => {
    setProfileImage(defaultImage);
    setShowOptions(false);
  };

  if (loading || !fullUser) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView contentContainerStyle={styles.profile}>
        {/* Card do perfil */}
        <View style={styles.profileCard}>
          <View style={styles.dadosCard}>
            <View>
              <Text style={styles.nomeCardProfile}>{fullUser.nome}</Text>
              <Info label="Email" value={fullUser.email} />
              <Info label="CPF" value={fullUser.cpf} />
              <Info label="Telefone" value={fullUser.telefone || "—"} />
            </View>

            <View>
              <TouchableOpacity onPress={() => setShowOptions(true)}>
                <Image source={profileImage} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <TouchableOpacity style={styles.buttonProfile} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.textOutroButton}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Startups */}
        {fullUser.startups?.length ? (
          fullUser.startups.map((st) => (
            <View key={st.cnpj}>
              <StartupCard
                data={st}
                onPress={() =>
                  navigation.navigate("StartupDetails", { cnpj: st.cnpj })
                }
              />
            </View>
          ))
        ) : (
          <Text>Você ainda não cadastrou nenhuma Startup.</Text>
        )}
      </ScrollView>

      {/* Opções da Foto */}
      {showOptions && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setShowOptions(false)}
          />

          <View>
            <Option label="Ver a imagem" onPress={() => setShowZoom(true)} />
            <Option label="Trocar foto" onPress={pickImage} />
            <Option label="Tirar foto com a câmera" onPress={takePhoto} />
            <Option label="Remover foto" onPress={removePhoto} danger />
            <Option label="Cancelar" onPress={() => setShowOptions(false)} />
          </View>
        </View>
      )}

      {/* Zoom da Foto */}
      <Modal visible={showZoom} transparent>
        <View style={styles.zoomContainer}>
          <TouchableOpacity onPress={() => setShowZoom(false)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Image
            source={profileImage}
            style={styles.zoomImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Info({ label, value }: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 5,
        paddingVertical: 3,
        marginVertical: 5,
      }}
    >
      <Text style={{ color: "#5D5D5D", fontSize: 15, fontWeight: "bold" }}>
        {label}:
      </Text>
      <Text style={{ color: "#5D5D5D", fontSize: 15, fontWeight: "bold" }}>
        {value}
      </Text>
    </View>
  );
}

function Option({ label, onPress, danger }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[danger && { color: "red" }]}>{label}</Text>
    </TouchableOpacity>
  );
}
