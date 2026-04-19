import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

const OPTIONS = [
  { label: 'Eine Schwangerschaft läuft gerade', value: 'pregnant' },
  { label: 'Wir haben schon ein Kind', value: 'child_exists' },
  { label: 'Beides gleichzeitig', value: 'both' },
];

export default function SituationScreen({ navigation }) {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState(data.situation);

  function handleNext() {
    updateData({ situation: selected });
    navigation.navigate('OnboardingEntriesOverview');
  }

  return (
    <OnboardingCard
      title="Wie ist eure aktuelle Situation?"
      subtitle="Wir passen die App an eure Lebensphase an."
      progress={{ current: 4, total: 8 }}
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
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
});
