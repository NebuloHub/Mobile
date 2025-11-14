import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import InfoScreen from "../screens/Info";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{ title: "Início" }} />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{ title: "Info" }}
      />
    </Tab.Navigator>
  );
}
