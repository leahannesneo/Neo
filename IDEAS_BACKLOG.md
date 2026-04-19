# Neo – Ideas Backlog

> Diese Datei sammelt alle Ideen, Features und Konzepte, die während
> der Entwicklung aufkommen, aber bewusst nicht im MVP umgesetzt werden.
> Jede Idee hat ein Datum, einen Kontext und eine aktuelle Entscheidung.
>
> **Regel:** Ideen werden sofort hier eingetragen, sobald sie entstehen
> und auf "später" vertagt werden – nicht erst am Ende einer Etappe.
> So geht nichts verloren, und die PROJECT_CONTEXT.md bleibt fokussiert.
>
> **Status-Werte:**
> - `Vorgemerkt` – Idee aufgenommen, nicht näher spezifiziert
> - `Geplant für V1.1` / `Geplant für V1.2` / `Geplant für V2` – konkreter Zeitrahmen
> - `Vorbereitet im Schema` – im MVP-Schema bereits so angelegt, dass die
>   Idee später ohne Daten-Migration aktiviert werden kann
> - `Verworfen` – nach Diskussion doch nicht gewollt (mit Begründung)

---

## Idee #001 – Familien-übergreifende Übersicht

**Datum:** 2026-04-16
**Status:** Vorgemerkt, Geplant für V1.1 oder später
**Entstanden in:** Etappe 1, Block 1 (Schema-Design)

**Beschreibung:**
Eine zusätzliche App-Ansicht, die Kinder aus allen Familien eines Users
in einer kombinierten Übersicht zeigt. Heute muss man über den
Familien-Switcher zwischen Familien wechseln, um z.B. beide Kinder aus
unterschiedlichen Familien zu sehen.

**Warum nicht im MVP:**
Erhöht die UI-Komplexität deutlich, bevor klar ist, wie viele User
tatsächlich mehrere Familien parallel führen. Erst Realdaten abwarten.

**Voraussetzung im Schema:**
Bereits erfüllt durch die Tabellen families und family_users. Keine
Schema-Änderung bei späterer Umsetzung nötig.

---

## Idee #002 – Erweitertes Rollen- und Berechtigungssystem

**Datum:** 2026-04-16
**Status:** Vorbereitet im Schema, Geplant für V1.1 oder V1.2
**Entstanden in:** Etappe 1, Block 1 (Schema-Design)

**Beschreibung:**
Ein mehrstufiges Rechtesystem für User, die zu einer Familie eingeladen
werden (z.B. Onkel, Oma, Großeltern, Freunde). Beim Einladen legt der
einladende User fest, welche Berechtigungsstufe der Eingeladene bekommt.

**Dreistufiges Modell:**

1. Eigentums-Ebene: Wer einen Inhalt erstellt, hat immer 100% Kontrolle
   darüber (sehen, ändern, löschen, Sichtbarkeit bestimmen).

2. Rollen-Ebene pro Familie: Jeder User bekommt beim Beitreten eine
   Berechtigungsstufe zugewiesen, die festlegt was er darf:
   - Fotos sehen ja/nein
   - Tagebuch sehen ja/nein
   - Gesundheitsdaten sehen ja/nein
   - Kontakte (Hebamme, Arzt) sehen ja/nein
   - Neue Einträge schreiben ja/nein
   - Kind-Profil bearbeiten ja/nein

3. Einzeleintrag-Ebene: Pro Foto / Tagebucheintrag wählt der Ersteller
   eine Sichtbarkeitsstufe: "Nur Ich" / "Vertraute" / "Alle in Familie".

**Beispiel-Rollen, die später zusätzlich zum MVP-Set denkbar sind:**
- extended_family (Onkel, Oma): sieht Fotos + Gesundheit, kein Tagebuch
- viewer_only: darf nur lesen, nichts schreiben
- weitere frei konfigurierbar

**UI-Anforderung (für spätere Etappe):**
Beim Erstellen einer Einladung öffnet sich ein Dialog mit
Berechtigungs-Checkboxen, bevor der Einladungslink erzeugt wird.

**Warum nicht im MVP:**
Würde Etappe 1 (Schema) deutlich verlängern und jede nachfolgende
Etappe um etwa 30% aufwendiger machen (komplexere RLS-Policies,
zusätzliche Abfragen). Im MVP sind die realen User erstmal Hannes und
seine Frau – beide brauchen vollen Zugriff, der vorhandene
private/family-Toggle reicht dafür.

**Voraussetzung im Schema (wird in Etappe 1 umgesetzt):**
- family_users.role ist erweiterbares Textfeld – neue Rollen ohne
  Schema-Änderung möglich
- journal_entries.visibility und photos.visibility haben drei Werte:
  private, family, trusted. Im MVP wird "trusted" noch nicht genutzt
  und genauso behandelt wie "family", ist aber bereits da für die
  spätere Aktivierung.
- Daten-Migration bei späterer Aktivierung: nicht nötig.

---

## Idee #003 – Content-Erstellung durch Claude (Chat)

**Datum:** 2026-04-16
**Status:** Vorgemerkt, wird in der zuständigen Content-Etappe aktiviert
**Entstanden in:** Etappe 1, Block 2 (Schema-Design Story-Karten)

**Beschreibung:**
Claude (Chat) erstellt die inhaltlichen Texte für:
- content_weeks: Schwangerschaftswochen 1–42 (Titel, Größenvergleich,
  Inhaltstexte Mutter, Inhaltstexte Partner, Tipps-Listen)
- content_baby_periods: Baby-Wochen 0–26 und Baby-Monate 6–36
  (Titel, Inhaltstexte, Tipps)
- story_cards: konkrete Ja/Nein-Fragen inklusive trigger_context,
  audience_role, yes_follow_up, no_follow_up, yes_action, no_action,
  on_no_behavior, persist_until_context, repeat_frequency

**Arbeitsteilung:**
- Claude liefert erste Fassung in strukturierter Markdown- oder
  CSV-Form, die direkt via Import-Skript in die Datenbank wandert.
- Hannes und seine Frau redigieren und entscheiden über Ton,
  inhaltliche Schwerpunkte und Auslassungen.
- Medizinische Aussagen werden mit angemessenen Hinweisen versehen
  (keine ärztliche Beratung ersetzend).

**Zeitpunkt der Umsetzung:**
Die Content-Erstellung passiert nicht in Etappe 1 (Schema), sondern
in einer eigenen späteren Etappe – voraussichtlich nach Etappe 6
(Baby-Modus), wenn die technischen Anzeige-Flächen für den Content
fertig sind. Vorher wird mit Platzhaltern und Testdaten gearbeitet.

**MVP-Strategie (laut PROJECT_CONTEXT.md Abschnitt 4):**
Voller Content für die ersten 3 Babymonate, Struktur und Platzhalter
für Monat 4–36. Code fertig, Texte kommen später ohne Code-Änderung.

---

## Idee #004 – Vollwertige integrierte Wunschliste

**Datum:** 2026-04-16
**Status:** Vorbereitet im Schema, Geplant für V1.1 oder V1.2
**Entstanden in:** Etappe 1, Block 3 (Schema-Design)

**Beschreibung:**
Erweiterung der Wunschlisten-Funktion über den simplen Link hinaus.
Die App soll eigene Listeneinträge innerhalb von Neo führen können:
- Produkte manuell eintragen (Titel, Beschreibung, Preis-Schätzung,
  Priorität, Foto)
- Produkte als "erhalten" markieren (wer hat es geschenkt)
- Mehrere thematische Listen (Erstausstattung, Weihnachten, 1. Geburtstag)
- Teilen mit Nicht-Familien-Usern: ein Großeltern-Elternpaar bekommt
  einen temporären Lese-Link, um zu sehen, was noch nicht geschenkt wurde
- Optional: Produkt-Scanner für Barcode/Link-Import aus Online-Shops

**Warum nicht im MVP:**
Würde eine neue größere UI-Fläche und weitere Tabellen erfordern.
Für den Start reicht die Möglichkeit, einen externen Link (z.B. zur
Amazon-Wunschliste) zu hinterlegen und zu öffnen.

**Voraussetzung im Schema:**
Tabelle wishlists existiert bereits im MVP. Erweiterung später durch
Zusatztabelle wishlist_items, ohne bestehende Strukturen zu brechen.

---

## Idee #005 – Termine mit Benachrichtigungen und externer Kalender-Integration

**Datum:** 2026-04-16
**Status:** Vorgemerkt, Geplant für V1.1
**Entstanden in:** Etappe 1, Block 3 (Schema-Design)

**Beschreibung:**
Die appointments-Tabelle im MVP dient zunächst als einfache
Termin-Notizfunktion (Eintragen, Anzeigen, als erledigt markieren).
Für V1.1 ist geplant:
- Automatische Push-Erinnerung vor dem Termin (konfigurierbar:
  1 Tag vorher, 1 Stunde vorher, etc.)
- Export zu Apple Calendar / Google Calendar (.ics-Datei oder direkter
  Kalendereintrag via System-Schnittstelle)
- Wiederkehrende Termine (z.B. Stillgruppen-Treffen wöchentlich)
- Vorgeschlagene Termine aus dem STIKO-Impfkatalog: Wenn z.B. die
  6-fach-Impfung im 2. Monat fällig ist, schlägt die App vor, einen
  Termin anzulegen
- Vorsorgeuntersuchungs-Templates (U-Untersuchungen U1 bis U9 mit
  empfohlenen Altersfenstern)

**Warum nicht im MVP:**
Benachrichtigungs-Integration und Kalender-APIs sind jeweils eigene
Themen, die Fokus brauchen. Minimalfunktion reicht für den Start.

**Voraussetzung im Schema:**
Tabelle appointments ist im MVP bereits angelegt. Erweiterung später
durch zusätzliche Felder (recurrence_rule, reminder_offset_minutes)
und ggf. Verknüpfung zum vaccination_catalog.

---

## Idee #006 – Erweitertes Stimmungs- und Rückblicks-System

**Datum:** 2026-04-16
**Status:** Vorbereitet im Schema, Geplant für V1.2 oder später
**Entstanden in:** Etappe 1, Block 3 (Schema-Design)

**Beschreibung:**
Das Feld journal_entries.mood (happy / proud / peaceful / tired /
overwhelmed / worried / sad) wird im MVP nur passiv gespeichert und
unauffällig als Smiley-Zeile unter dem Textfeld erfasst. Spätere
Ausbaustufen:
- Jahres- oder Zeitraum-Rückblicke mit Stimmungsverlauf visualisiert
- Filter im Tagebuch ("Zeige mir alle glücklichen Einträge")
- Korrelation mit Entwicklungsphasen (z.B. automatischer Hinweis:
  "Du warst oft müde um Woche 12 – das ist typisch für den
  Wachstumsschub")
- Sanfte, nicht-medizinische Impulse wenn über längere Zeit viele
  negative Stimmungen eingetragen werden (mit Hinweis auf Hebammen-
  oder Ärzte-Kontakt aus den eigenen Kontakten)

**Warum nicht im MVP:**
Erfordert Visualisierungen, Filter-UI und inhaltliche Sorgfalt bei
Hinweisen. Das Schema-Feld wird aber ab Tag 1 genutzt, damit später
genug Daten zur Verfügung stehen.

**Voraussetzung im Schema:**
Bereits erfüllt durch journal_entries.mood.

---

## Idee #007 – Alternative Login-Methoden (Apple, Google, Phone)

**Datum:** 2026-04-17
**Status:** Vorgemerkt, Geplant für V1.1 oder später
**Entstanden in:** Etappe 2 (Authentifizierung)

**Beschreibung:**
Zusätzlich zum klassischen E-Mail/Passwort-Login sollen später
weitere Anmelde-Methoden angeboten werden, um den Einstieg in die
App niedrigschwelliger zu machen:
- Sign in with Apple (Pflicht-Feature für App Store, sobald andere
  Social Logins angeboten werden)
- Sign in with Google (OAuth über Google Cloud Console)
- Phone-Login (SMS-OTP via Supabase)

**Warum nicht im MVP:**
- Sign in with Apple setzt einen aktiven Apple Developer Account
  voraus (laut PROJECT_CONTEXT.md erst kurz vor Store-Einreichung).
- Google-Login erfordert separates OAuth-Setup in Google Cloud
  Console mit Redirect-URIs und Deep-Linking – eigenes Arbeitspaket.
- Phone-Login verursacht im Supabase Free Plan Kosten pro SMS und
  braucht Provider-Anbindung (z.B. Twilio).
- E-Mail/Passwort reicht für die ersten Tester (Hannes + Frau).

**Voraussetzung im Schema:**
Keine Schema-Änderung nötig. Supabase Auth unterstützt alle
Methoden parallel über denselben auth.users-Eintrag; das bestehende
profiles-Modell und der Auto-Trigger funktionieren unverändert.

**UI-Anforderung (für spätere Etappe):**
Login- und Registrierungs-Screen bekommen zusätzliche Buttons
"Mit Apple anmelden" / "Mit Google anmelden" / "Mit Telefonnummer
anmelden" oberhalb oder unterhalb des E-Mail/Passwort-Formulars.

---

## Idee #008 – Claude Design für Mockups, Themes und Website

**Datum:** 2026-04-19
**Status:** Vorgemerkt, erstmals zu nutzen in Etappe 11 (Themes)
                    und zur Website-Phase nach MVP
**Entstanden in:** Ende Etappe 3 (Onboarding-Flow), auf Anregung
                    von Hannes

**Beschreibung:**
Claude Design (Research Preview, gelauncht April 2026) ist
Anthropics neues Tool zur Generierung von Design-Systemen,
Website-Prototypen, interaktiven Mockups und Präsentationen per
Dialog. Verfügbar für Pro/Max/Team/Enterprise-Plans.

Fähigkeiten, die für Neo relevant sein können:
- Design-Systeme aus Code oder Designfiles einlesen und auf neue
  Projekte anwenden (Farben, Typografie, Komponenten)
- Mockups und Prototypen aus Text-Prompts
- Export nach Canva, Figma, oder direkt zu Claude Code
- Web-Capture-Tool für Referenz-Elemente

Konkrete Einsatzstellen für Neo:

1. Vor Etappe 11 (Themes & Settings):
   Die zwei MVP-Themes ("ruhig & stilvoll" vs. "bunt & verspielt")
   visuell in Claude Design ausprobieren, finale Farbwerte
   festlegen, bevor sie im Code hinterlegt werden. Spart uns das
   mühsame "probier mal ein anderes Blau"-Hin-und-Her.

2. App-Icon und Splash Screen:
   Laut PROJECT_CONTEXT.md Abschnitt 9 noch offen. Claude Design
   kann hier mehrere Varianten generieren, zur Auswahl.

3. Screens im Voraus visualisieren (optional):
   Bevor Etappe 5 (Schwangerschafts-Modus) oder Etappe 8 (Kamera)
   gebaut werden, kann Claude Design erste Mockups erzeugen, um
   UI-Entscheidungen früher zu treffen.

4. Website-Phase nach MVP:
   Claude Design als Hauptwerkzeug für Landing Page, Marketing-
   Seiten, Blog, ggf. Web-Dashboard.

**Warum nicht früher:**
- Claude Design generiert primär Web-Code (HTML/CSS/React-Web) —
  Neos App ist React Native + Expo. Der Output lässt sich nicht
  direkt als Code übernehmen, dient aber gut als visuelle Referenz.
- Der aktuelle Workflow (Claude-Chat plant, Claude-Code baut,
  iPhone testet via Expo Go) läuft effizient für funktionale
  Feature-Etappen. Zusätzliche visuelle Schleifen würden die
  Durchlaufzeit derzeit eher verlängern.
- Claude Design steckt noch in der Research Preview — Feature-Set
  und Stabilität können sich in den nächsten Monaten ändern.

**Voraussetzung:**
Hannes nutzt bereits einen Claude-Plan mit Zugriff auf Claude
Design (Pro/Max/Team). Keine technische Vorbereitung am Projekt
nötig, bis wir das Tool tatsächlich einsetzen.

---

*Ende der Ideas-Backlog-Datei. Neue Ideen werden chronologisch unten
angefügt, jeweils mit Datum, Status, Entstehungs-Kontext und klarer
Beschreibung.*
