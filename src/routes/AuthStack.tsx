// src/navigation/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
