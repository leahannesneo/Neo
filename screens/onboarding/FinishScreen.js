import { Alert, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';
import { useAuth } from '../../lib/AuthContext';
import { useProfile } from '../../lib/ProfileContext';
import { supabase } from '../../lib/supabase';
import finishOnboarding from '../../lib/finishOnboarding';

const ROLE_LABELS = {
  mother: 'Mutter',
  father: 'Vater',
  partner: 'Partnerin/Partner',
  other: 'Andere',
};

const THEME_LABELS = {
  calm: 'Ruhig & stilvoll',
  playful: 'Bunt & verspielt',
};

export default function FinishScreen({ navigation }) {
  const { data, resetData } = useOnboarding();
  const { session } = useAuth();
  const { refresh } = useProfile();
  const [saving, setSaving] = useState(false);

  const pregnancyCount = data.entries.filter((e) => e.type === 'pregnancy').length;
  const childCount = data.entries.filter((e) => e.type === 'child').length;

  async function handleFinish() {
    setSaving(true);
    try {
      await finishOnboarding({ userId: session.user.id, data, supabase });
      resetData();
      refresh();
    } catch (err) {
      console.warn('finishOnboarding Fehler:', err);
      setSaving(false);
      Alert.alert(
        'Speichern fehlgeschlagen',
        'Bitte versuche es erneut. Falls das Problem bestehen bleibt, starte die App neu.',
      );
    }
  }

  return (
    <OnboardingCard
      title="Alles bereit"
      subtitle="Wir speichern deine Angaben und richten die App ein."
      progress={{ current: 8, total: 8 }}
      onNext={handleFinish}
      nextLabel={saving ? 'Wird gespeichert…' : "Los geht's"}
      nextDisabled={saving}
      onBack={saving ? undefined : () => navigation.goBack()}
    >
      <View style={styles.summaryBox}>
        <SummaryRow label="Name" value={data.displayName || '–'} />
        <SummaryRow label="Rolle" value={ROLE_LABELS[data.role] ?? '–'} />
        <SummaryRow
          label="Einträge"
          value={`${data.entries.length} (${pregnancyCount} Schwangerschaft${pregnancyCount !== 1 ? 'en' : ''}, ${childCount} Kind${childCount !== 1 ? 'er' : ''})`}
        />
        <SummaryRow label="Stil" value={THEME_LABELS[data.theme] ?? '–'} />
      </View>
    </OnboardingCard>
  );
}

function SummaryRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryBox: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: { fontSize: 15, color: '#666' },
  rowValue: { fontSize: 15, color: '#1a1a2e', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
});
