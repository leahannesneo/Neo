import { StyleSheet, Text, View } from 'react-native';
import OnboardingCard from '../../components/OnboardingCard';

export default function PartnerInviteScreen({ navigation }) {
  return (
    <OnboardingCard
      title="Partner einladen"
      subtitle="Teilt ihr die App zu zweit? Du kannst deinen Partner oder deine Partnerin einladen — dann seht ihr beide dieselben Einträge."
      onNext={() => navigation.navigate('OnboardingFinish')}
      nextLabel="Später einladen"
      onBack={() => navigation.goBack()}
    >
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Die Einladung per QR-Code oder Link bauen wir im nächsten Schritt der App. Du kannst es auch später aus den Einstellungen heraus machen — nichts geht verloren.
        </Text>
      </View>
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 18,
    marginTop: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});
