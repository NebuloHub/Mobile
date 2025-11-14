import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AppStack from "./src/routes/AppStack";
import AuthStack from "./src/routes/AuthStack";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MainNavigator() {
  const { user } = useAuth();
  return user ? <AppStack /> : <AuthStack />;
}
