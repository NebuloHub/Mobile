import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ navigation }: any) {

  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <Text>Configurações</Text>
    </SafeAreaView>
  );
}






