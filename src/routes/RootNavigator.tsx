import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import LoadingScreen from "../screens/LoadingScreen";

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
