import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GenderScreen from '../screens/onboarding/GenderScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import PartnershipScreen from '../screens/onboarding/PartnershipScreen';
import SituationScreen from '../screens/onboarding/SituationScreen';
import EntriesOverviewScreen from '../screens/onboarding/EntriesOverviewScreen';
import EntryPregnancyScreen from '../screens/onboarding/EntryPregnancyScreen';
import EntryChildScreen from '../screens/onboarding/EntryChildScreen';
import RoleScreen from '../screens/onboarding/RoleScreen';
import ThemeScreen from '../screens/onboarding/ThemeScreen';
import PartnerInviteScreen from '../screens/onboarding/PartnerInviteScreen';
import FinishScreen from '../screens/onboarding/FinishScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingWelcome" component={WelcomeScreen} />
      <Stack.Screen name="OnboardingGender" component={GenderScreen} />
      <Stack.Screen name="OnboardingName" component={NameScreen} />
      <Stack.Screen name="OnboardingPartnership" component={PartnershipScreen} />
      <Stack.Screen name="OnboardingSituation" component={SituationScreen} />
      <Stack.Screen name="OnboardingEntriesOverview" component={EntriesOverviewScreen} />
      <Stack.Screen name="OnboardingEntryPregnancy" component={EntryPregnancyScreen} />
      <Stack.Screen name="OnboardingEntryChild" component={EntryChildScreen} />
      <Stack.Screen name="OnboardingRole" component={RoleScreen} />
      <Stack.Screen name="OnboardingTheme" component={ThemeScreen} />
      <Stack.Screen name="OnboardingPartnerInvite" component={PartnerInviteScreen} />
      <Stack.Screen name="OnboardingFinish" component={FinishScreen} />
    </Stack.Navigator>
  );
}
