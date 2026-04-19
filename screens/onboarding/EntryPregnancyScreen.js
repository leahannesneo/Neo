import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

function parseGermanDate(input) {
  const match = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2020 || y > 2035) return null;
  return `${year}-${month}-${day}`;
}

export default function EntryPregnancyScreen({ navigation }) {
  const { addEntry } = useOnboarding();
  const [dueDateInput, setDueDateInput] = useState('');
  const [lastPeriodInput, setLastPeriodInput] = useState('');
  const [dueTouched, setDueTouched] = useState(false);

  const dueIso = parseGermanDate(dueDateInput);
  const lastPeriodIso = parseGermanDate(lastPeriodInput);
  const dueDateValid = dueIso !== null;
  const lastPeriodValid = lastPeriodInput.trim() === '' || lastPeriodIso !== null;

  function handleSave() {
    addEntry({
      id: Date.now().toString(),
      type: 'pregnancy',
      dueDate: dueIso,
      lastPeriodDate: lastPeriodIso,
    });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <OnboardingCard
        title="Deine Schwangerschaft"
        subtitle="Der errechnete Geburtstermin reicht fürs Erste. Du kannst später weitere Details ergänzen."
        onNext={handleSave}
        nextLabel="Speichern"
        nextDisabled={!dueDateValid}
        onBack={() => navigation.goBack()}
      >
        <Text style={styles.label}>Errechneter Geburtstermin *</Text>
        <TextInput
          style={[styles.input, dueTouched && !dueDateValid && styles.inputError]}
          value={dueDateInput}
          onChangeText={setDueDateInput}
          onBlur={() => setDueTouched(true)}
          placeholder="TT.MM.JJJJ"
          placeholderTextColor="#aaa"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          returnKeyType="done"
        />
        {dueTouched && !dueDateValid && (
          <Text style={styles.errorText}>Bitte gib ein gültiges Datum ein (z. B. 15.08.2025).</Text>
        )}

        <View style={styles.spacer} />

        <Text style={styles.label}>Letzter Periodentag (optional)</Text>
        <Text style={styles.hint}>Hilfreich, falls der ET noch nicht feststeht.</Text>
        <TextInput
          style={[styles.input, lastPeriodInput.length > 0 && !lastPeriodValid && styles.inputError]}
          value={lastPeriodInput}
          onChangeText={setLastPeriodInput}
          placeholder="TT.MM.JJJJ"
          placeholderTextColor="#aaa"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          returnKeyType="done"
        />
        {lastPeriodInput.length > 0 && !lastPeriodValid && (
          <Text style={styles.errorText}>Bitte gib ein gültiges Datum ein (z. B. 01.03.2025).</Text>
        )}
      </OnboardingCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  hint: { fontSize: 13, color: '#888', marginBottom: 6 },
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
  inputError: { borderColor: '#c0392b' },
  errorText: { fontSize: 13, color: '#c0392b', marginTop: 4 },
  spacer: { height: 20 },
});
