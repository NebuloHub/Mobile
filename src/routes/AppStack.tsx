import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutes from './TabRoutes';
import TesteScreen from '../screens/Settings';
import { AppStackParams } from '../types/navigation';
import StartupDetails from '../screens/StartupDetails';
import SearchScreen from '../screens/SearchStartup';
import RegisterStartup from '../screens/RegisterStartup';

const Stack = createNativeStackNavigator<AppStackParams>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="StartupDetails" component={StartupDetails} />
      <Stack.Screen name="RegisterStartup" component={RegisterStartup} />
    </Stack.Navigator>
  );
}
