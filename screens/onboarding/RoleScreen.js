import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

const OPTIONS = [
  { label: 'Mutter', value: 'mother' },
  { label: 'Vater', value: 'father' },
  { label: 'Partnerin/Partner', value: 'partner' },
  { label: 'Andere', value: 'other' },
];

export default function RoleScreen({ navigation }) {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState(data.role);

  function handleNext() {
    updateData({ role: selected });
    navigation.navigate('OnboardingTheme');
  }

  return (
    <OnboardingCard
      title="Deine Rolle in der Familie"
      subtitle="So passen wir die Inhalte für dich an."
      progress={{ current: 6, total: 8 }}
      onNext={handleNext}
      nextDisabled={selected === null}
      onBack={() => navigation.goBack()}
    >
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.optionSelected]}
          onPress={() => setSelected(opt.value)}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionText, selected === opt.value && styles.optionTextSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f8',
  },
  optionText: { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#1a1a2e', fontWeight: '600' },
});
