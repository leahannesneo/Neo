import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

export default function NameScreen({ navigation }) {
  const { data, updateData } = useOnboarding();
  const [name, setName] = useState(data.displayName);

  function handleNext() {
    updateData({ displayName: name.trim() });
    navigation.navigate('OnboardingPartnership');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OnboardingCard
        title="Wie heißt du?"
        subtitle="Dein Name erscheint in der App, sonst nirgends."
        progress={{ current: 2, total: 8 }}
        onNext={handleNext}
        nextDisabled={!name.trim()}
        onBack={() => navigation.goBack()}
      >
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Dein Vorname"
          placeholderTextColor="#aaa"
          autoCapitalize="words"
          maxLength={50}
          returnKeyType="done"
        />
      </OnboardingCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
  },
});
