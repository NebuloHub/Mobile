import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "../../components/ThemeToggleButton";
import { deleteUserByCPF } from "../../api/usuario"; 

export default function SettingsScreen({ navigation }: any) {
  const { signOut, user } = useAuth();

  const handleDeleteUser = async () => {
    if (!user?.cpf) {
      Alert.alert("Erro", "CPF do usuário não encontrado.");
      return;
    }

    Alert.alert(
      "Confirmação",
      "Deseja realmente deletar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteUserByCPF(user.cpf);
              Alert.alert("Sucesso", res.mensagem);
              signOut(); 
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o usuário.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <Text>Configurações</Text>

      <TouchableOpacity onPress={signOut} style={{ marginBottom: 20 }}>
        <Text>Deslogar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteUser}>
        <Text>Deletar Conta</Text>
      </TouchableOpacity>

      <ThemeToggle />
    </SafeAreaView>
  );
}
