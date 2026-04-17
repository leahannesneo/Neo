# Neo – Projekt-Kontext

> Diese Datei ist der "Single Source of Truth" für das Projekt Neo.
> Sie wird zu Beginn jedes neuen Chats mit Claude reinkopiert und liegt
> zusätzlich im Projektordner, damit Claude Code sie lesen kann.
>
> **Stand:** Etappe 1 (Datenbank-Schema) abgeschlossen — bereit für Etappe 2 (Authentifizierung)
> **Letztes Update:** 2026-04-17
> **Architekt:** Hannes
> **Technische Umsetzung:** Claude (Planung) + Claude Code (Ausführung)

---

## 1. Vision & Kernidee

**Neo** ist eine App, die zwei bisher getrennte Märkte kombiniert:
Schwangerschaftsbegleitung (Wochentracker, Infos, Tagebuch) und
Foto-Mediathek / digitales Kinderbuch – und zwar durchgängig vom
Beginn der Schwangerschaft bis mindestens zum dritten Lebensjahr
des Kindes.

Die Idee stammt ursprünglich von Hannes' Frau (beide sind zum zweiten
Mal schwanger) und wurde gemeinsam weiterentwickelt. Die Motivation:
Bestehende Apps wie Flo oder Schwangerschaft+ sind gut für die
Schwangerschaft, werden danach aber irrelevant. Foto-Tagebuch-Apps
fangen erst nach der Geburt an. Neo schlägt die Brücke und bietet
durchgängige Begleitung aus einer Hand.

**Differenzierungsmerkmale am Markt:**
- Durchgängige Nutzung vor, während und nach der Geburt
- Adaptive Story-Karten, die sich an die individuelle Situation
  der Nutzerin anpassen (statt generischer Wochentexte)
- Nahtlose Verbindung von Content (Wochenupdates) und Erinnerungen
  (Fotos, Tagebuch)
- Partnerzentriert: Mann und Frau nutzen dieselbe App mit geteiltem
  Kind-Profil, aber eigenen Accounts
- Keine KI-Bildanalyse – Privatsphäre als bewusste Produktentscheidung
  und Verkaufsargument

---

## 2. Technologie-Stack (entschieden)

| Bereich | Technologie |
|---|---|
| Mobile App | React Native + Expo (iOS primär, Android sekundär) |
| Website (später) | React Web |
| Backend / Datenbank / Auth / Storage | Supabase |
| Versionskontrolle | GitHub |
| Website-Hosting (später) | Vercel |
| Coding-Ausführung | Claude Code (Terminal) |
| Live-Test | Expo Go auf iPhone |

**Setup-Status:**
- Node.js installiert
- Claude Code installiert, mit Anthropic-Account verbunden, einsatzbereit
- Xcode installiert
- VS Code installiert
- Expo Go auf iPhone installiert
- GitHub-Account vorhanden
- Supabase-Account vorhanden
- Projektordner ~/Projekte/neo angelegt
- Expo-Projekt initialisiert (blank template)
- Supabase-Projekt "neo" angelegt (Region Frankfurt, Free Plan)
- Supabase-Credentials in .env eingetragen (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
- .env in .gitignore eingetragen
- @supabase/supabase-js installiert
- lib/supabase.js angelegt (Client-Initialisierung)
- App.js mit Supabase-Verbindungstest erweitert
- Live-Test erfolgreich: "✅ Supabase verbunden" auf iPhone via Expo Go bestätigt
- CLAUDE.md im Projektordner angelegt (Leitfaden für Claude Code)
- Git-Repo lokal initialisiert
- GitHub-Repo "Neo" angelegt (privat) und verknüpft
- GitHub CLI (gh) installiert und authentifiziert
- Initial commit auf GitHub gepusht
- Supabase-Datenbank-Schema komplett angelegt (25 Tabellen)
- Row Level Security auf allen Tabellen aktiv
- Storage Buckets "photos" und "profile-photos" privat angelegt
- Auto-Trigger aktiv: legt bei neuer Registrierung automatisch Profile + leere Familie + Settings an
- System-Seed-Daten eingespielt: ca. 30 Moment-Tags und 18 STIKO-Impfungen
- SQL-Migration versioniert unter supabase/migrations/0001_initial_schema.sql
- IDEAS_BACKLOG.md im Projektordner angelegt (sammelt verschobene Ideen, aktuell 6 Einträge)

**Noch offen (kommt später):**
- Apple Developer Account (erst zur App-Store-Einreichung)
- Vercel Account (erst für Website-Phase)
- Domain (erst für Website-Phase)

---

## 3. Arbeitsweise & Rollen

- **Hannes** ist der Architekt: bringt Ideen, trifft Entscheidungen,
  testet auf dem iPhone, gibt Feedback.
- **Claude (Chat)** ist der Planer: bespricht Features, schreibt die
  konkreten Anweisungen ("Baubefehle"), die Hannes in Claude Code
  kopiert. Diskutiert Designentscheidungen, löst Probleme.
- **Claude Code (Terminal)** ist der Ausführende: setzt die Baubefehle
  direkt in den Projektdateien um.

**Typischer Ablauf pro Schritt:**
1. Claude (Chat) schreibt eine Anweisung mit einem Textblock
2. Hannes kopiert den Textblock in sein Terminal/Claude Code
3. Claude Code arbeitet, fragt bei Unsicherheiten nach
4. Hannes prüft das Ergebnis auf dem iPhone via Expo Go
5. Hannes meldet Ergebnis zurück an Claude (Chat)
6. Weiter zu Schritt n+1 oder Korrektur

**Hannes muss keine Zeile Code verstehen** – nur kopieren, einfügen,
auf dem iPhone schauen, und beschreiben was er sieht.

---

## 4. MVP-Scope (fest entschieden)

### Enthalten im MVP (wird in einem Rutsch gebaut):

**Account & Onboarding**
- Account-Anlage via Supabase Auth (E-Mail + Passwort)
- Adaptiver Onboarding-Karten-Flow:
  - Geschlecht
  - Aktuelle Situation: schwanger / Kind vorhanden / beides
  - Persönliche Daten (Name, ggf. Größe/Gewicht)
  - Partnerschaft? Ja/Nein
  - Einladung Partner per QR-Code/Link optional
- Paralleler Modus möglich (z.B. 1-jähriges Kind + neue Schwangerschaft)

**Account-Modell: Variante C**
- Jeder Nutzer hat einen eigenen Login
- Kind ist eine geteilte Entität, mehrere User können verknüpft sein
- Rollen pro User: `mother`, `father`, `partner`, `other`
- Einladung per QR-Code oder Link
- Rollenbasierte Inhalte (Mutter sieht andere Tipps als Vater)

**Sharing-Logik**
- Globale Defaults in den Settings (pro Datentyp: geteilt/privat)
- Pro-Eintrag-Toggle beim Tagebuch, direkt im Editor sichtbar
- Fotos, Gesundheitsdaten, Meilensteine: Default geteilt
- Tagebuch: Default geteilt, pro Eintrag umstellbar

**Schwangerschafts-Modus**
- Wochenansicht mit Größenvergleich
- Text pro Woche (Was passiert gerade, was kommt)
- Tipps für Mutter und Tipps für Partner (rollenbasiert)
- Adaptive Story-Karten mit Ja/Nein-Verzweigung
  (z.B. "Siehst du schon einen Babybauch?" → ja → Foto hochladen)
- Content für alle ~40 Schwangerschaftswochen wird erstellt

**Baby-Modus**
- Wochenansicht Monat 0-6 (wöchentliche Updates)
- Monatsansicht Monat 6-36 (monatliche Updates)
- Entwicklungs-Content, Themen-Tipps (Stillen, Brei, wunder Po, etc.)
- Adaptive Story-Karten mit Ja/Nein-Verzweigung
- **Content-Strategie:** Voller Content für erste 3 Babymonate,
  Struktur und Platzhalter für Monat 4-36 (Code fertig, Texte
  kommen später ohne Code-Änderung)
- Automatischer Modus-Wechsel Schwangerschaft → Baby am
  errechneten Geburtstermin

**Zentrale Kamera-Funktion**
- Kamera-Button prominent erreichbar
- Foto aufnehmen oder aus Galerie wählen
- Danach: manuelles Moment-Tagging
  - Titel-Freitext (z.B. "Erstes Mal im Sandkasten")
  - Vorgeschlagene Tags zur schnellen Auswahl
  - Keine KI-Bildanalyse (bewusste Entscheidung)
- Zuordnung zu Tagebucheintrag

**Tagebuch**
- Zeitstrahl aller Einträge (Text + Fotos)
- Privat/Geteilt-Toggle pro Eintrag im Editor
- Verknüpfung mit Fotos und Momenten

**Gesundheitsdaten-Bereich**
- Kind-Profil (Name, Geburtsdatum/ET, Geschlecht, Profilfoto)
- Größe, Gewicht, Kopfumfang (mit Wachstumskurve im Vergleich
  zur Idealkurve)
- Impfungen
- Kontakte: Hebamme, Arzt, Kinderarzt

**Settings**
- Theme-Auswahl (siehe Abschnitt 5)
- Sharing-Defaults pro Datentyp
- Sprache (Deutsch im MVP)
- Account-Verwaltung

**Push-Benachrichtigungen**
- Wochenupdate-Reminder
- Adaptive Story-Karten-Reminder

### NICHT im MVP (kommt später):

**V1.1 (kurz nach MVP):**
- Wehentracker
- KI-Features (Schreibanstöße fürs Tagebuch, Bildunterschriften)
- Erweiterte Entwicklungs-Meilensteine
- Erste Desktop-/Website-Features
- Voller Content für Monat 4-36

**Später (Monetarisierung):**
- Fotobücher aus App
- Poster-Shop (z.B. Wehen-Zeitdiagramme als Wandposter)
- Abo-Modell für Premium-Features
- Partnerschaften (CEWE etc.)
- Erweiterung auf Zyklustracking vor Schwangerschaft
- Erweiterung über 3. Lebensjahr hinaus

---

## 5. Look & Feel

**Grundstil:** Clean & modern im Apple-Stil. Viel Weißraum. Klare
Typografie. SF Pro als Standard-Font (iOS-System-Font).

**Charakter:** Clean-Basis mit fröhlichen Akzenten und gelegentlichen
Illustrationen zur Auflockerung. Keine Überladung, aber auch nicht
steril.

**Zwei wählbare Themes (User entscheidet im Onboarding, jederzeit
in Settings umstellbar):**
1. **Ruhig & stilvoll** – pastellige Beigetöne, schlicht, erwachsen
2. **Bunt & verspielt** – kräftigere Farben, fröhlich

**Technisch:** Themes sind Theme-Objekte/CSS-Variablen, Wechsel ohne
App-Neustart.

---

## 6. Datenmodell (Grobstruktur, finales Schema kommt in Etappe 1)

Geplante Haupttabellen in Supabase:

- `users` – via Supabase Auth, erweitert um Profil
- `children` – ein Kind, geteilt zwischen mehreren Usern
- `child_users` – M:N-Verknüpfung mit Rolle (mother/father/partner/other)
- `pregnancies` – Schwangerschaft eines Kindes (ET, letzter
  Periodentag etc.), parallele Schwangerschaften möglich
- `invitations` – Einladungscodes/QR-Links für Partner
- `journal_entries` – Tagebucheinträge mit `is_private`-Flag
- `photos` – Fotos, verknüpft mit Einträgen und Kind
- `moments` – Moment-Tags (z.B. "Erstes Mal im Sandkasten")
- `health_records` – Größe/Gewicht/Kopfumfang-Messungen
- `vaccinations` – Impfungen
- `contacts` – Hebamme, Arzt etc.
- `content_weeks` – Redaktioneller Content für Schwangerschaftswochen
- `content_baby_periods` – Redaktioneller Content für Wochen/Monate
  nach Geburt
- `story_cards` – Adaptive Story-Karten mit Ja/Nein-Logik
- `user_story_responses` – Welche Karten hat welcher User wie
  beantwortet
- `sharing_settings` – User-spezifische Sharing-Defaults

(Das ist die Grobstruktur – finale Felder/Beziehungen werden in
Etappe 1 beim Anlegen des Schemas konkretisiert.)

---

## 7. Bau-Etappen (Roadmap MVP)

**Schritt 0 – Setup** ✅ abgeschlossen
- Projektordner anlegen
- Expo-Projekt initialisieren
- Supabase-Projekt anlegen, Credentials holen
- GitHub-Repo erstellen und verbinden
- CLAUDE.md anlegen
- Erster Test: Leere App auf iPhone via Expo Go

**Etappe 1 – Datenbank-Schema in Supabase ✅ abgeschlossen**
**Etappe 2 – Authentifizierung** (Register, Login, Logout)
**Etappe 3 – Onboarding-Flow** (adaptive Karten)
**Etappe 4 – Kind-Profil & Gesundheitsdaten**
**Etappe 5 – Schwangerschafts-Modus** mit Wochenansicht
**Etappe 6 – Baby-Modus** mit Wochen-/Monatsansicht
**Etappe 7 – Adaptive Story-Karten**
**Etappe 8 – Kamera & Foto-Upload**
**Etappe 9 – Tagebuch** mit Sharing-Logik
**Etappe 10 – Partner-Einladung per QR**
**Etappe 11 – Themes & Settings**
**Etappe 12 – Push-Benachrichtigungen**
**Etappe 13 – Feinschliff & Tests**

Nach jeder Etappe: Test auf iPhone, dann nächste Etappe. Der MVP
wird nicht feature-by-feature diskutiert, sondern direkt nach
diesem Plan durchgebaut.

---

## 8. Regeln für Claude in neuen Chats

Wenn ein neuer Chat mit dieser Datei gestartet wird, soll Claude:

1. Bestätigen, dass der Kontext verstanden wurde
2. Nicht erneut die Vision hinterfragen – sie ist entschieden
3. Hannes fragen, an welchem Punkt der Roadmap wir gerade sind
4. Hannes schrittweise an die Hand nehmen – kopierfertige
   Anweisungen, nie trockener Code ohne Erklärung
5. Immer klar benennen, welches Tool Hannes gerade benutzen soll
   (Chat / Terminal+Claude Code / iPhone+Expo Go / Browser+Supabase)
6. Bei Unklarheiten Rückfragen stellen, nicht raten
7. Die MVP-Grenzen respektieren – keine Features aus V1.1 oder
   später vorziehen, außer Hannes entscheidet es bewusst
8. Konvention: Technische Namen (Tabellen, Felder, Variablen im
   Code, SQL-Bezeichner) sind auf Englisch. Alle Inhalte, die
   Userinnen in der App sehen (Texte, Buttons, Benachrichtigungen,
   Fehlermeldungen, Content), sind ausschließlich auf Deutsch.
   Übersetzungs-Mapping findet im UI-Layer statt.

---

## 9. Offene Punkte / Entscheidungen für später

- Exakte Push-Benachrichtigungs-Frequenz (täglich? wöchentlich?)
- Genaues Einladungsverfahren für Partner (Deep Link oder Code?)
- Finale Farbwerte der beiden Themes
- App-Icon & Splash Screen
- Impressum/Datenschutz-Texte (vor Store-Einreichung nötig)
- Content-Erstellung: Wer schreibt die Wochentexte final?
  (Claude entwirft, Hannes + Frau redigieren)

---

## 10. Etappen-Übergabe-Protokoll

Neo wird entlang der Bau-Etappen aus Abschnitt 7 entwickelt.
Jede Etappe wird in einem **eigenen Chat mit Claude** bearbeitet,
damit der Kontext fokussiert und die Antworten schnell bleiben.
Zwischen den Etappen findet eine strukturierte Übergabe statt.
Dieses Protokoll ist verbindlich – Claude führt es in jedem Chat
automatisch aus, ohne dass Hannes daran erinnern muss.

### Während einer Etappe

- Claude bleibt bei den Aufgaben der aktuellen Etappe
- Features aus späteren Etappen werden nicht vorgezogen
- Claude schreibt kopierfertige Baubefehle für Claude Code

### Am Ende einer Etappe

Sobald Claude den Eindruck hat, dass die aktuelle Etappe
inhaltlich abgeschlossen ist, macht Claude folgendes
**automatisch und ohne Aufforderung**:

1. Claude fragt Hannes explizit:
   *"Wir sind am Ende von Etappe X. Bist du fertig damit,
   oder gibt es noch offene Punkte?"*
2. Wenn Hannes bestätigt, liefert Claude in einer einzigen
   Nachricht drei Dinge:
   a) **Update-Baubefehl für die Projekt-Kontext-Datei** –
      ein kopierfertiger Auftrag an Claude Code, der die
      PROJECT_CONTEXT.md im Projektordner auf den neuen
      Stand bringt (Setup-Status, erledigte Etappen,
      neue offene Punkte, Datum).
   b) **Übergabe-Prompt für den neuen Chat** – ein
      kopierfertiger Text, den Hannes im neuen Chat als
      erste Nachricht einfügt. Dieser Prompt enthält:
      - Kurzen Statusbericht (was wurde in der Etappe
        erreicht, was ist der aktuelle Stand)
      - Optional: offene Kleinigkeiten aus der alten Etappe
      - Klare Nennung der nächsten Etappe
      - Hinweis, dass die aktualisierte
        PROJECT_CONTEXT.md mitgeliefert wird
   c) **Sync-Erinnerung** – Hinweis an Hannes, die
      lokale PROJECT_CONTEXT.md nach dem Update
      **zusätzlich** in den Claude-Projekt-Bereich
      (online) hochzuladen, damit beide Versionen
      synchron bleiben und neue Chats den aktuellen
      Stand sehen.
3. Zusätzlich prüft Claude, ob sich in der Etappe eine
   technische Konvention, eine Arbeitsregel oder die
   Ordnerstruktur geändert hat. Falls ja, schreibt Claude
   einen separaten kopierfertigen Auftrag an Claude Code,
   um CLAUDE.md entsprechend anzupassen. Falls nein,
   bleibt CLAUDE.md unverändert und wird nicht erwähnt.
4. Erst danach schließt Hannes den aktuellen Chat und
   öffnet einen neuen Chat mit dem Übergabe-Prompt.

### In einem neuen Chat

Claude liest zu Beginn des neuen Chats die
PROJECT_CONTEXT.md (inklusive dieses Protokolls) und
bestätigt Hannes kurz:
- welche Etappe laut Datei als nächste dran ist
- dass das Übergabe-Protokoll verstanden und aktiv ist

Danach geht die Arbeit an der neuen Etappe weiter.

### Warum dieses Protokoll existiert

- Hält Chats kurz und fokussiert, damit Antworten schnell
  und präzise bleiben
- Verhindert, dass Kontext zwischen Etappen verloren geht
- Macht den Projektstand jederzeit nachvollziehbar
- Erlaubt Hannes, sich auf das Testen und Entscheiden zu
  konzentrieren, während der Workflow im Hintergrund läuft

---

## 11. Zusätzliche Projekt-Dateien

Neben dieser PROJECT_CONTEXT.md liegen folgende ergänzende Dateien
im Projektordner:

### IDEAS_BACKLOG.md

Sammelt alle Ideen, Features und Konzepte, die während der Entwicklung
aufkommen, aber bewusst nicht im MVP umgesetzt werden. Jede Idee hat
ein Datum, einen Status und eine Begründung, warum sie vertagt wurde.

Claude liest diese Datei bei Bedarf zusätzlich zur PROJECT_CONTEXT.md,
insbesondere wenn es um Features nach dem MVP geht oder wenn eine neue
Idee entsteht, die dorthin verschoben werden sollte.

Regel: Neue Ideen werden sofort beim Entstehen eingetragen, nicht erst
am Ende einer Etappe. So geht nichts verloren, und diese
PROJECT_CONTEXT.md bleibt fokussiert auf aktuelle Entscheidungen.

### supabase/migrations/

Enthält versionierte SQL-Migrationen für das Datenbank-Schema.
Jede Migration liegt als einzelne .sql-Datei vor und ist
durchnummeriert (0001_initial_schema.sql, 0002_..., etc.).
Neue Migrationen werden nie in bestehende Dateien geschrieben,
sondern immer als neue Datei angelegt, damit der Verlauf
nachvollziehbar bleibt.

---

*Ende der Projekt-Kontext-Datei. Diese Datei wird bei wichtigen
Meilensteinen aktualisiert.*
