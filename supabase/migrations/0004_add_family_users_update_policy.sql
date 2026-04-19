-- Migration 0004: Ergänzt fehlende UPDATE-Policy auf family_users.
--
-- Kontext: Im ursprünglichen Schema (0001) wurden für family_users
-- nur SELECT, INSERT und DELETE-Policies angelegt. Die UPDATE-Policy
-- fehlte, was dazu führte, dass User ihre eigene Rolle nicht ändern
-- konnten — der Supabase-UPDATE scheiterte still (ohne Fehler).
--
-- Dieser Fix erlaubt jedem User, genau seinen eigenen
-- family_users-Eintrag zu aktualisieren. Wird im Onboarding
-- (Rolle setzen) und später in den Einstellungen gebraucht.

create policy family_users_update on public.family_users
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
