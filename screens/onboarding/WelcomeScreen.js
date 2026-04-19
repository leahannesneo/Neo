import OnboardingCard from '../../components/OnboardingCard';

export default function WelcomeScreen({ navigation }) {
  return (
    <OnboardingCard
      title="Willkommen bei Neo"
      subtitle="Lass uns gemeinsam ein paar Dinge einstellen, damit die App zu dir passt. Das dauert nur zwei Minuten."
      nextLabel="Los geht's"
      onNext={() => navigation.navigate('OnboardingGender')}
    />
  );
}
