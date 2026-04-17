import { StyleSheet, Text, View, Button } from 'react-native';

export default function SignInScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen zurück</Text>
      <Text style={styles.text}>Hier kommt der Login-Screen hin.</Text>
      <Button title="Zur Registrierung" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  text: { marginBottom: 24 },
});
