export function translateAuthError(error) {
  if (!error) return 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.';

  const msg = (error.message || '').toLowerCase();
  const code = error.code || '';

  if (code === 'user_already_exists' || msg.includes('user already registered')) {
    return 'Diese E-Mail-Adresse ist bereits registriert. Versuche dich stattdessen anzumelden.';
  }
  if (msg.includes('password should be at least') || msg.includes('password must be at least')) {
    return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
  }
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) {
    return 'Die E-Mail-Adresse ist ungültig.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in der E-Mail, die wir dir geschickt haben.';
  }
  if (msg.includes('invalid login credentials')) {
    return 'E-Mail oder Passwort ist falsch.';
  }

  if (__DEV__) {
    return `Es ist ein Fehler aufgetreten. Bitte versuche es erneut.\n[DEV: ${error.message}]`;
  }
  return 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.';
}
