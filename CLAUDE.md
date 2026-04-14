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

## Code-Konventionen

- **JavaScript, keine TypeScript-Typen.**
- Saubere, minimale Dateien. Keine überflüssigen Kommentare.
- Funktionale React-Komponenten mit Hooks (`useState`, `useEffect` etc.).
- Supabase-Client wird aus `lib/supabase.js` importiert: `import { supabase } from './lib/supabase'`.
- Umgebungsvariablen kommen aus `.env` und haben den Prefix `EXPO_PUBLIC_`.
- Keine Secrets im Code. Keine Secrets committen. `.env` ist in `.gitignore`.

## Ordnerstruktur (wachsend)

- `App.js` — Einstiegspunkt
- `lib/` — Hilfsmodule (z.B. `supabase.js`)
- `PROJECT_CONTEXT.md` — Projekt-Verfassung
- `CLAUDE.md` — diese Datei

## Wichtige Regeln

- **Nichts in `.env` verändern**, ohne Hannes explizit zu fragen.
- **Keine neuen npm-Pakete installieren**, ohne vorher zu erklären warum und auf Bestätigung zu warten.
- **MVP-Scope respektieren:** Keine Features aus V1.1 oder später vorziehen (siehe `PROJECT_CONTEXT.md` Abschnitt 4).
- **Bei Dateiänderungen:** erst Plan zeigen, dann umsetzen.
- **Git-Commits:** nur auf ausdrückliche Anweisung erstellen.
