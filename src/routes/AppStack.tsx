import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutes from './TabRoutes';
import TesteScreen from '../screens/Teste';
import { AppStackParams } from '../types/navigation';
import StartupDetails from '../screens/StartupDetails';

const Stack = createNativeStackNavigator<AppStackParams>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="StartupDetails" component={StartupDetails} />
      <Stack.Screen name="Teste" component={TesteScreen} />
    </Stack.Navigator>
  );
}
