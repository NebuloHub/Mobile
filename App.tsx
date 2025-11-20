import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppStack from "./src/routes/AppStack";
import AuthStack from "./src/routes/AuthStack";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LanguageProvider } from "./src/context/LanguageContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function MainNavigator() {
  const { user, loading } = useAuth();

  // Evita piscar telas enquanto carrega AsyncStorage
  if (loading) return null;

  return user ? <AppStack /> : <AuthStack />;
}
