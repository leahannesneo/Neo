-- Neo – Migration 0003
-- Fügt der profiles-Tabelle das Feld onboarding_completed_at hinzu.
--
-- Bedeutung: NULL = Onboarding noch nicht abgeschlossen.
-- Die App setzt dieses Feld nach dem letzten Schritt des Onboarding-Flows
-- auf now(). Bestehende User erhalten NULL und werden beim nächsten Login
-- durch den Onboarding-Flow geleitet.
--
-- IF NOT EXISTS macht die Migration idempotent: doppeltes Ausführen
-- scheitert nicht, sondern wird stillschweigend übersprungen.

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;
