import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './lib/AuthContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
