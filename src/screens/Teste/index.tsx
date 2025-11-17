import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParams } from "../../types/navigation";

type Props = NativeStackScreenProps<AppStackParams, 'Teste'>;

export default function TesteScreen({ route, navigation }: Props) {
  const { userId, name } = route.params;

  return (
    <View>
      <Text>ID: {userId}</Text>
      <Text>Nome: {name}</Text>
    </View>
  );
}






