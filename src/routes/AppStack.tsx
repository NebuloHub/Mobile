import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabRoutes from "./TabRoutes";
import InfoScreen from "../screens/Info";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  );
}
