import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './lib/AuthContext';
import { ProfileProvider } from './lib/ProfileContext';
import { OnboardingProvider } from './lib/OnboardingContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ProfileProvider>
          <OnboardingProvider>
            <RootNavigator />
          </OnboardingProvider>
        </ProfileProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
