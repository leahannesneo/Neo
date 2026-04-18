import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { translateAuthError } from '../../lib/authErrors';
import PrimaryButton from '../../components/PrimaryButton';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSignIn() {
    setErrorMessage(null);

    if (!email.trim()) {
      return setErrorMessage('Bitte gib eine E-Mail-Adresse ein.');
    }
    if (!password) {
      return setErrorMessage('Bitte gib ein Passwort ein.');
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      setErrorMessage(translateAuthError(error));
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Willkommen zurück</Text>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          placeholder="deine@email.de"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Passwort</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          placeholder="Dein Passwort"
          placeholderTextColor="#aaa"
        />

        <PrimaryButton title="Anmelden" onPress={handleSignIn} loading={loading} />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.linkText}>Du hast noch kein Konto? Jetzt registrieren</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#000',
    marginBottom: 4,
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    lineHeight: 20,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#1a1a2e',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
