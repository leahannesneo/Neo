import { StyleSheet, Text, View, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neo</Text>
      <Text style={styles.text}>Du bist eingeloggt.</Text>
      <Button title="Abmelden" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  text: { marginBottom: 24 },
});
