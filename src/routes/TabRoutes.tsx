import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import InfoScreen from "../screens/Info";
import TesteScreen from "../screens/Teste";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8e8e8f",
        }}
      />
      <Tab.Screen name="Info" component={InfoScreen} />
    </Tab.Navigator>
  );
}
