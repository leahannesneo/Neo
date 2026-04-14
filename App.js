import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  const [status, setStatus] = useState('Verbinde mit Supabase...');

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      if (error) {
        setStatus(`❌ Fehler: ${error.message}`);
      } else {
        setStatus('✅ Supabase verbunden');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{status}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
