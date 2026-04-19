# Neo — Claude Code Leitfaden

Dies ist die Arbeits-Leitdatei für Claude Code im Projekt Neo.
Die vollständige Projekt-Vision, Roadmap und Designentscheidungen stehen in `PROJECT_CONTEXT.md` im gleichen Ordner — lies sie bei Bedarf, aber wiederhole sie nicht.

## Projekt in einem Satz

Neo ist eine React-Native-/Expo-App, die Schwangerschaftsbegleitung und Foto-Mediathek/digitales Kinderbuch durchgängig von Schwangerschaft bis zum 3. Lebensjahr kombiniert. Supabase als Backend.

## Tech-Stack

- **App:** React Native + Expo (iOS primär, Android sekundär)
- **Sprache:** JavaScript (kein TypeScript im MVP)
- **Backend:** Supabase (Auth, Postgres, Storage)
- **Versionskontrolle:** Git + GitHub
- **Live-Test:** Expo Go auf iPhone

## Arbeitsweise

- Hannes ist Nicht-Entwickler und testet ausschließlich auf dem iPhone via Expo Go.
- Aufträge kommen meistens als kopierter Text aus einem Chat mit Claude (Planer).
- Vor größeren Änderungen: erst Plan zeigen, dann auf "Go" warten.
- Bei Unsicherheiten nachfragen, nicht raten.
- Commit-Nachrichten auf Deutsch; erste Zeile mit Etappen-Bezug (z.B. `Etappe 2 Sitzung B: ...`), darunter Bindestrich-Liste der Änderungen.

## Code-Konventionen

- **JavaScript, keine TypeScript-Typen.**
- Saubere, minimale Dateien. Keine überflüssigen Kommentare.
- Funktionale React-Komponenten mit Hooks (`useState`, `useEffect` etc.).
- Supabase-Client wird aus `lib/supabase.js` importiert: `import { supabase } from './lib/supabase'`.
- Umgebungsvariablen kommen aus `.env` und haben den Prefix `EXPO_PUBLIC_`.
- Keine Secrets im Code. Keine Secrets committen. `.env` ist in `.gitignore`.
- Supabase-Auth-Fehler (englisch) werden über `lib/authErrors.js` → `translateAuthError()` zu deutschen User-Texten übersetzt. Nie rohe Fehlermeldungen direkt anzeigen.
- Profil-Daten (inkl. `onboarding_completed_at`) werden über den `useProfile()`-Hook aus `lib/ProfileContext.js` geladen. Gibt `{ profile, loading, error, onboardingCompleted, refresh }` zurück.
- `RootNavigator` unterscheidet drei Zustände: kein Session → AuthStack; Session + `onboarding_completed_at IS NULL` → OnboardingStack; Session + Onboarding abgeschlossen → AppStack.
- App-weite States (Profil, Onboarding-Daten) werden als Context+Provider+Hook-Muster umgesetzt (`createContext` + Provider-Komponente + `useX()`-Hook). Keine isolierten `useState`-Hooks für Daten, die zwischen mehreren Screens geteilt werden.

## Ordnerstruktur (wachsend)

- `App.js` — Einstiegspunkt
- `lib/` — Hilfsmodule (z.B. `supabase.js`, `AuthContext.js`, `ProfileContext.js`, `OnboardingContext.js`, `authErrors.js`, `finishOnboarding.js`)
- `components/` — wiederverwendbare UI-Elemente (z.B. `PrimaryButton.js`, `OnboardingCard.js`)
- `screens/` — App-Screens; Auth-Screens unter `screens/auth/`, Onboarding-Screens unter `screens/onboarding/`
- `navigation/` — Navigator-Definitionen (z.B. `RootNavigator.js`, `OnboardingStack.js`)
- `PROJECT_CONTEXT.md` — Projekt-Verfassung
- `CLAUDE.md` — diese Datei

## Wichtige Regeln

- **Nichts in `.env` verändern**, ohne Hannes explizit zu fragen.
- **Keine neuen npm-Pakete installieren**, ohne vorher zu erklären warum und auf Bestätigung zu warten.
- **MVP-Scope respektieren:** Keine Features aus V1.1 oder später vorziehen (siehe `PROJECT_CONTEXT.md` Abschnitt 4).
- **Bei Dateiänderungen:** erst Plan zeigen, dann umsetzen.
- **Git-Commits:** nur auf ausdrückliche Anweisung erstellen.

## Ordnerstruktur-Konventionen

- Datenbank-Migrationen liegen ausschließlich unter supabase/migrations/
- Migrationen sind durchnummeriert: 0001_initial_schema.sql, 0002_*.sql, ...
- Bestehende Migrationsdateien werden nie bearbeitet, nur neue angelegt
- Der aktuelle Stand des Schemas ergibt sich aus der Reihenfolge aller Migrationen

## Sprach-Konventionen

- Alle technischen Bezeichner (Tabellennamen, Spaltennamen, Variablennamen,
  Funktionsnamen, Enum-Werte, Konstanten) sind auf Englisch
- Alle Inhalte, die Endnutzer in der App sehen (UI-Texte, Fehlermeldungen,
  Push-Benachrichtigungen, E-Mail-Vorlagen), sind ausschließlich auf Deutsch
- Übersetzungen von Enum-Werten (z.B. visibility=private → "Nur ich")
  passieren ausschließlich im UI-Layer, nicht in der Datenbank
