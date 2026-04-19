import { StyleSheet, Text, View, Button } from 'react-native';
import { supabase } from '../lib/supabase';
import { useProfile } from '../lib/ProfileContext';

export default function HomeScreen() {
  const { profile } = useProfile();
  const name = profile?.display_name || null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name ? `Hallo, ${name}!` : 'Hallo!'}</Text>
      <Text style={styles.text}>Schön, dass du da bist.</Text>
      <Text style={styles.hint}>Hier wird bald deine Wochenübersicht angezeigt.</Text>
      <Button title="Abmelden" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  text: { fontSize: 16, color: '#333', marginBottom: 8 },
  hint: { fontSize: 14, color: '#999', marginBottom: 32 },
});
