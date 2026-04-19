import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OnboardingCard from '../../components/OnboardingCard';
import { useOnboarding } from '../../lib/OnboardingContext';

function formatDate(isoDate) {
  if (!isoDate) return '–';
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}

function titleForSituation(situation) {
  if (situation === 'pregnant') return 'Zu deiner Schwangerschaft';
  if (situation === 'child_exists') return 'Zu deinem Kind';
  return 'Zu deiner Familie';
}

export default function EntriesOverviewScreen({ navigation }) {
  const { data, removeEntry } = useOnboarding();
  const { entries, situation } = data;

  const showBothButtons = situation === 'both' || entries.length > 0;

  function renderAddButtons() {
    if (showBothButtons) {
      return (
        <View style={styles.addRow}>
          <TouchableOpacity
            style={[styles.addBtn, styles.addBtnHalf]}
            onPress={() => navigation.navigate('OnboardingEntryPregnancy')}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+ Schwangerschaft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, styles.addBtnHalf]}
            onPress={() => navigation.navigate('OnboardingEntryChild')}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+ Kind</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (situation === 'child_exists') {
      return (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('OnboardingEntryChild')}
          activeOpacity={0.7}
        >
          <Text style={styles.addBtnText}>+ Kind hinzufügen</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('OnboardingEntryPregnancy')}
        activeOpacity={0.7}
      >
        <Text style={styles.addBtnText}>+ Schwangerschaft hinzufügen</Text>
      </TouchableOpacity>
    );
  }

  return (
    <OnboardingCard
      title={titleForSituation(situation)}
      subtitle="Hier sammelst du alle Kinder und Schwangerschaften. Du kannst später jederzeit weitere hinzufügen."
      progress={{ current: 5, total: 8 }}
      onNext={() => navigation.navigate('OnboardingRole')}
      nextDisabled={entries.length === 0}
      onBack={() => navigation.goBack()}
    >
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>Noch keine Einträge. Füge jetzt deinen ersten hinzu.</Text>
      ) : (
        entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryInfo}>
              <Text style={styles.entryType}>
                {entry.type === 'pregnancy' ? '♥ Schwangerschaft' : '★ Kind'}
              </Text>
              {entry.type === 'pregnancy' && (
                <Text style={styles.entryDetail}>ET: {formatDate(entry.dueDate)}</Text>
              )}
              {entry.type === 'child' && (
                <Text style={styles.entryDetail}>Geburt: {formatDate(entry.birthDate)}</Text>
              )}
              {entry.name ? <Text style={styles.entryDetail}>{entry.name}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => removeEntry(entry.id)} activeOpacity={0.7}>
              <Text style={styles.removeBtn}>Entfernen</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      <View style={styles.addSection}>{renderAddButtons()}</View>
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  entryInfo: {
    flex: 1,
  },
  entryType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  entryDetail: {
    fontSize: 14,
    color: '#555',
  },
  removeBtn: {
    fontSize: 13,
    color: '#c0392b',
  },
  addSection: {
    marginTop: 12,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#1a1a2e',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  addBtnHalf: {
    flex: 1,
  },
  addBtnText: {
    fontSize: 15,
    color: '#1a1a2e',
    fontWeight: '500',
  },
});
