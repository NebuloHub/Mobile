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

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();

  const defaultImage = require("../../../assets/placeholders/user.jpg");

  const [profileImage, setProfileImage] = useState<any>(defaultImage);
  const [fullUser, setFullUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [showZoom, setShowZoom] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  //   Funções de carregamento
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
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
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

  //   Loading
  if (loading || !fullUser) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <ScrollView>
        {/* Card do perfil */}
        <View>
          <View>
            <Text>{fullUser.nome}</Text>
            <View>
              <Info label="Email" value={fullUser.email} />
              <Info label="CPF" value={fullUser.cpf} />
              <Info label="Telefone" value={fullUser.telefone || "—"} />
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={() => setShowOptions(true)}>
              <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity>
              <Text>Editar Perfil</Text>
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
    <>
      <Text>{label}:</Text>
      <Text>{value}</Text>
    </>
  );
}

function Option({ label, onPress, danger }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[danger && { color: "red" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // De preferencias deixa esses estilos aqui, eles são do ícone do perfil, do zoom da foto e das opções da foto
  // Mas pode alterar eles como quiser
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 4,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },

  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  zoomContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  zoomImage: {
    width: "100%",
    height: "80%",
  },

  closeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
