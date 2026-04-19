import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PrimaryButton from './PrimaryButton';

export default function OnboardingCard({
  title,
  subtitle,
  children,
  onNext,
  nextDisabled = false,
  nextLabel = 'Weiter',
  onBack,
  progress,
}) {
  const showButtonRow = onBack || onNext;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {progress && (
          <View style={styles.progressRow}>
            {Array.from({ length: progress.total }).map((_, i) => (
              <View
                key={i}
                style={[styles.bar, i < progress.current && styles.barFilled]}
              />
            ))}
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {showButtonRow && (
        <View style={styles.buttonRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
          )}
          {onNext && (
            <View style={onBack ? styles.nextFlex : styles.nextFull}>
              <PrimaryButton title={nextLabel} onPress={onNext} disabled={nextDisabled} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingBottom: 34,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 28,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
  },
  barFilled: {
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  backBtn: {
    paddingVertical: 14,
  },
  backBtnText: {
    fontSize: 15,
    color: '#555',
  },
  nextFlex: {
    flex: 1,
  },
  nextFull: {
    flex: 1,
  },
});
