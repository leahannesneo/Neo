import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../lib/AuthContext';
import { useProfile } from '../lib/ProfileContext';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingStack from './OnboardingStack';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={HomeScreen} options={{ title: 'Neo' }} />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { session, loading: authLoading } = useAuth();
  const { onboardingCompleted, loading: profileLoading } = useProfile();

  if (authLoading || (session && profileLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Lädt...</Text>
      </View>
    );
  }

  if (!session) {
    return <AuthNavigator />;
  }

  if (!onboardingCompleted) {
    return <OnboardingStack />;
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12 },
});
