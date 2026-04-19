import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

const OPTIONS = [
  {
    label: 'Ruhig & stilvoll',
    value: 'calm',
    description: 'Warme Beigetöne, schlicht, erwachsen.',
  },
  {
    label: 'Bunt & verspielt',
    value: 'playful',
    description: 'Kräftigere Farben, fröhlich, lebendig.',
  },
];

export default function ThemeScreen({ navigation }) {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState(data.theme);

  function handleNext() {
    updateData({ theme: selected });
    if (data.hasPartner) {
      navigation.navigate('OnboardingPartnerInvite');
    } else {
      navigation.navigate('OnboardingFinish');
    }
  }

  return (
    <OnboardingCard
      title="Dein Stil"
      subtitle="Welcher Look gefällt dir besser? Du kannst das jederzeit in den Einstellungen ändern."
      progress={{ current: 7, total: 8 }}
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
          <Text style={[styles.optionLabel, selected === opt.value && styles.optionLabelSelected]}>
            {opt.label}
          </Text>
          <Text style={styles.optionDescription}>{opt.description}</Text>
        </TouchableOpacity>
      ))}
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: '#1a1a2e',
    backgroundColor: '#f0f0f8',
  },
  optionLabel: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  optionLabelSelected: { color: '#1a1a2e' },
  optionDescription: { fontSize: 14, color: '#666' },
});
