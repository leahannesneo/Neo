import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

const OPTIONS = [
  { label: 'Ja, gemeinsam', value: true },
  { label: 'Nein, alleine', value: false },
];

export default function PartnershipScreen({ navigation }) {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState(data.hasPartner);

  function handleNext() {
    updateData({ hasPartner: selected });
    navigation.navigate('OnboardingSituation');
  }

  return (
    <OnboardingCard
      title="Nutzt ihr die App zu zweit?"
      subtitle="Du kannst später einen Partner oder eine Partnerin einladen, mit dem oder der du die Einträge teilst."
      progress={{ current: 3, total: 8 }}
      onNext={handleNext}
      nextDisabled={selected === null}
      onBack={() => navigation.goBack()}
    >
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={String(opt.value)}
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
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
});
