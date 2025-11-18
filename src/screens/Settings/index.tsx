import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ navigation }: any) {

  const { signOut } = useAuth();
  

  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <Text>Configurações</Text>

      <TouchableOpacity onPress={signOut}>
        <Text>Deslogar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}