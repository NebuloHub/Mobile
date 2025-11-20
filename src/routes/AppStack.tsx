import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabRoutes from './TabRoutes';
import StartupDetails from '../screens/StartupDetails';
import RegisterStartup from '../screens/RegisterStartup';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import { AppStackParams } from '../types/navigation';

const Stack = createNativeStackNavigator<AppStackParams>();

export default function AppStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabRoutes} />
        <Stack.Screen name="StartupDetails" component={StartupDetails} />
        <Stack.Screen name="RegisterStartup" component={RegisterStartup} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
