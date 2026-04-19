import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

const GENDER_OPTIONS = [
  { label: 'Weiblich', value: 'female' },
  { label: 'Männlich', value: 'male' },
  { label: 'Divers', value: 'diverse' },
  { label: 'Keine Angabe', value: 'prefer_not_to_say' },
];

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

export default function EntryChildScreen({ navigation }) {
  const { addEntry } = useOnboarding();
  const [birthDateInput, setBirthDateInput] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthTouched, setBirthTouched] = useState(false);

  const birthIso = parseGermanDate(birthDateInput);
  const birthDateValid = birthIso !== null;

  function handleSave() {
    addEntry({
      id: Date.now().toString(),
      type: 'child',
      birthDate: birthIso,
      name: name.trim() || null,
      gender: gender,
    });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <OnboardingCard
        title="Dein Kind"
        subtitle="Die Basisdaten reichen fürs Erste."
        onNext={handleSave}
        nextLabel="Speichern"
        nextDisabled={!birthDateValid}
        onBack={() => navigation.goBack()}
      >
        <Text style={styles.label}>Geburtsdatum *</Text>
        <TextInput
          style={[styles.input, birthTouched && !birthDateValid && styles.inputError]}
          value={birthDateInput}
          onChangeText={setBirthDateInput}
          onBlur={() => setBirthTouched(true)}
          placeholder="TT.MM.JJJJ"
          placeholderTextColor="#aaa"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          returnKeyType="done"
        />
        {birthTouched && !birthDateValid && (
          <Text style={styles.errorText}>Bitte gib ein gültiges Datum ein (z. B. 12.05.2023).</Text>
        )}

        <View style={styles.spacer} />

        <Text style={styles.label}>Name (optional)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Vorname des Kindes"
          placeholderTextColor="#aaa"
          autoCapitalize="words"
          maxLength={50}
          returnKeyType="done"
        />

        <View style={styles.spacer} />

        <Text style={styles.label}>Geschlecht (optional)</Text>
        <View style={styles.genderGrid}>
          {GENDER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.genderBtn, gender === opt.value && styles.genderBtnSelected]}
              onPress={() => setGender(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.genderBtnText, gender === opt.value && styles.genderBtnTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </OnboardingCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
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
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderBtn: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  genderBtnSelected: {
    borderWidth: 2,
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f8',
  },
  genderBtnText: { fontSize: 15, color: '#333' },
  genderBtnTextSelected: { color: '#1a1a2e', fontWeight: '600' },
});
