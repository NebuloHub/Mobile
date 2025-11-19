import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from "../screens/Home";
import SearchStartups from "../screens/SearchStartup";
import { Ionicons } from "@expo/vector-icons";
import RegisterStartup from "../screens/RegisterStartup";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {

  const activeSize = 30;
  const inactiveSize = 25;
  const activeColor = "#002fff";
  const inactiveColor = "#8e8e8f";

  return (
    <SafeAreaProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 55,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Início",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={focused ? activeSize : inactiveSize}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="SearchStartup"
          component={SearchStartups}
          options={{
            tabBarLabel: "Pesquisar",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={focused ? activeSize : inactiveSize}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="RegisterStartup"
          component={RegisterStartup}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={focused ? activeSize : inactiveSize}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={focused ? activeSize : inactiveSize}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={focused ? activeSize : inactiveSize}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}
