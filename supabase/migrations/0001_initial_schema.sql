-- ============================================================
-- Neo – Initial Database Schema
-- Version: 0001
-- Erstellt: 2026-04-16
-- Etappe: 1 – Datenbank-Schema
-- ============================================================
-- Diese Migration legt alle Tabellen, Enums, Indizes, RLS-Policies,
-- Trigger und Seed-Daten für den MVP an. Sie ist idempotent genug,
-- um in einem frischen Supabase-Projekt einmalig ausgeführt zu werden.
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- 2. ENUMS (feste Wertelisten)
-- ============================================================
create type gender_type as enum ('female', 'male', 'diverse', 'prefer_not_to_say', 'unknown');
create type theme_type as enum ('calm', 'playful');
create type family_role as enum ('mother', 'father', 'partner', 'other');
create type visibility_type as enum ('private', 'family', 'trusted');
create type mood_type as enum ('happy', 'proud', 'peaceful', 'tired', 'overwhelmed', 'worried', 'sad');
create type conception_method as enum ('natural', 'ivf', 'other');
create type pregnancy_end_reason as enum ('birth', 'miscarriage', 'termination');
create type story_response as enum ('yes', 'no', 'skipped');
create type story_on_no_behavior as enum ('persist', 'retry_once', 'dismiss');
create type story_repeat_frequency as enum ('once', 'recurring_weekly', 'recurring_monthly');
create type baby_period_type as enum ('week', 'month');
create type contact_type as enum ('midwife', 'doctor', 'pediatrician', 'emergency', 'other');
create type appointment_type as enum ('prenatal_checkup', 'pediatric_checkup', 'vaccination', 'other');

-- ============================================================
-- 3. HAUPTTABELLEN – USER & FAMILIEN
-- ============================================================

-- Profile (erweitert auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  gender gender_type,
  height_cm integer,
  pre_pregnancy_weight_kg numeric(5,2),
  theme theme_type default 'calm',
  language text default 'de',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Familien
create table families (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User-Familien-Verknüpfung
create table family_users (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role family_role not null,
  joined_at timestamptz default now(),
  unique (family_id, user_id)
);
create index idx_family_users_user on family_users(user_id);
create index idx_family_users_family on family_users(family_id);

-- Einladungen
create table invitations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  invited_by uuid not null references profiles(id) on delete cascade,
  code text not null unique,
  invited_role family_role not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references profiles(id),
  created_at timestamptz default now()
);
create index idx_invitations_code on invitations(code);

-- Kinder
create table children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text,
  due_date date,
  birth_date date,
  gender gender_type,
  profile_photo_path text,
  storage_provider text default 'supabase',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_children_family on children(family_id);

-- ============================================================
-- 4. SCHWANGERSCHAFT
-- ============================================================
create table pregnancies (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  last_period_date date,
  due_date date not null,
  conception_method conception_method default 'natural',
  is_active boolean default true,
  ended_at timestamptz,
  end_reason pregnancy_end_reason,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_pregnancies_child on pregnancies(child_id);
create index idx_pregnancies_active on pregnancies(is_active) where is_active = true;

-- Mutter-Messungen (Gewicht, Bauchumfang)
create table mother_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  pregnancy_id uuid references pregnancies(id) on delete set null,
  measured_at date not null,
  weight_kg numeric(5,2),
  belly_circumference_cm numeric(5,2),
  note text,
  created_at timestamptz default now()
);
create index idx_mother_measurements_user on mother_measurements(user_id);

-- ============================================================
-- 5. REDAKTIONELLER CONTENT
-- ============================================================

-- Schwangerschaftswochen-Content
create table content_weeks (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null unique check (week_number between 1 and 42),
  title text not null,
  baby_size_comparison text,
  baby_size_cm numeric(5,2),
  baby_weight_g numeric(8,2),
  summary text,
  content_mother text,
  content_partner text,
  tips_mother text[],
  tips_partner text[],
  illustration_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Baby-Perioden-Content
create table content_baby_periods (
  id uuid primary key default gen_random_uuid(),
  period_type baby_period_type not null,
  period_number integer not null,
  title text not null,
  summary text,
  content text,
  tips text[],
  illustration_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (period_type, period_number)
);

-- Story-Karten (adaptive Ja/Nein-Karten)
create table story_cards (
  id uuid primary key default gen_random_uuid(),
  trigger_context text not null,
  question text not null,
  audience_role text default 'any',
  yes_follow_up text,
  no_follow_up text,
  yes_action text,
  no_action text,
  on_no_behavior story_on_no_behavior default 'persist',
  persist_until_context text,
  repeat_frequency story_repeat_frequency default 'once',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_story_cards_trigger on story_cards(trigger_context);

-- User-Antworten auf Story-Karten
create table user_story_responses (
  id uuid primary key default gen_random_uuid(),
  story_card_id uuid not null references story_cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  response story_response not null,
  responded_at timestamptz default now()
);
create index idx_responses_user on user_story_responses(user_id);
create index idx_responses_card on user_story_responses(story_card_id);

-- ============================================================
-- 6. FOTOS, MOMENTE, TAGEBUCH
-- ============================================================

create table photos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  uploaded_by uuid not null references profiles(id) on delete cascade,
  storage_provider text default 'supabase',
  storage_path text not null,
  taken_at timestamptz,
  title text,
  visibility visibility_type default 'family',
  width integer,
  height integer,
  file_size_bytes integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_photos_family on photos(family_id);
create index idx_photos_uploader on photos(uploaded_by);
create index idx_photos_taken_at on photos(taken_at desc);

create table photo_children (
  photo_id uuid not null references photos(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  primary key (photo_id, child_id)
);

create table moments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  label text not null,
  is_system boolean default false,
  category text,
  created_at timestamptz default now()
);
create index idx_moments_family on moments(family_id);
create index idx_moments_system on moments(is_system) where is_system = true;

create table photo_moments (
  photo_id uuid not null references photos(id) on delete cascade,
  moment_id uuid not null references moments(id) on delete cascade,
  primary key (photo_id, moment_id)
);

create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  title text,
  content text not null,
  entry_date date not null default current_date,
  visibility visibility_type default 'family',
  mood mood_type,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_journal_family on journal_entries(family_id);
create index idx_journal_author on journal_entries(author_id);
create index idx_journal_date on journal_entries(entry_date desc);

create table journal_entry_children (
  journal_entry_id uuid not null references journal_entries(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  primary key (journal_entry_id, child_id)
);

create table journal_entry_photos (
  journal_entry_id uuid not null references journal_entries(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  primary key (journal_entry_id, photo_id)
);

-- ============================================================
-- 7. GESUNDHEIT
-- ============================================================

create table health_records (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  recorded_by uuid references profiles(id) on delete set null,
  measured_at date not null,
  height_cm numeric(5,2),
  weight_g integer,
  head_circumference_cm numeric(5,2),
  note text,
  created_at timestamptz default now()
);
create index idx_health_child on health_records(child_id);
create index idx_health_date on health_records(measured_at desc);

create table vaccination_catalog (
  id uuid primary key default gen_random_uuid(),
  vaccine_name text not null,
  vaccine_code text,
  recommended_age_months_min integer,
  recommended_age_months_max integer,
  description text,
  is_stiko_standard boolean default true,
  created_at timestamptz default now()
);

create table vaccinations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  recorded_by uuid references profiles(id) on delete set null,
  catalog_id uuid references vaccination_catalog(id) on delete set null,
  vaccine_name text not null,
  vaccine_code text,
  date_given date not null,
  dose_number integer,
  note text,
  created_at timestamptz default now()
);
create index idx_vaccinations_child on vaccinations(child_id);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  type contact_type not null,
  name text not null,
  phone text,
  email text,
  address text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_contacts_family on contacts(family_id);

-- ============================================================
-- 8. ORGANISATION
-- ============================================================

create table wishlists (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  url text not null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_wishlists_family on wishlists(family_id);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid references children(id) on delete cascade,
  created_by uuid references profiles(id) on delete set null,
  type appointment_type not null default 'other',
  title text not null,
  scheduled_at timestamptz not null,
  location text,
  note text,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_appointments_family on appointments(family_id);
create index idx_appointments_scheduled on appointments(scheduled_at);

-- ============================================================
-- 9. SETTINGS
-- ============================================================

create table sharing_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  default_photo_visibility visibility_type default 'family',
  default_journal_visibility visibility_type default 'family',
  default_health_visibility visibility_type default 'family',
  updated_at timestamptz default now()
);

create table notification_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  weekly_update_enabled boolean default true,
  story_card_enabled boolean default true,
  preferred_time time default '19:00:00',
  push_token text,
  updated_at timestamptz default now()
);

-- ============================================================
-- 10. HELPER-FUNKTIONEN
-- ============================================================

-- Prüft, ob ein User Mitglied einer bestimmten Familie ist
create or replace function is_family_member(fam_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from family_users
    where family_id = fam_id and user_id = auth.uid()
  );
$$;

-- Automatisches Anlegen von Profile + Start-Familie bei Registrierung
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_family_id uuid;
begin
  -- Profile anlegen
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));

  -- Leere Start-Familie anlegen
  insert into families (created_by)
  values (new.id)
  returning id into new_family_id;

  -- User der Familie hinzufügen (Default-Rolle: other, wird im Onboarding überschrieben)
  insert into family_users (family_id, user_id, role)
  values (new_family_id, new.id, 'other');

  -- Default-Settings anlegen
  insert into sharing_settings (user_id) values (new.id);
  insert into notification_settings (user_id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-Update von updated_at-Feldern
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on profiles for each row execute function set_updated_at();
create trigger trg_families_updated before update on families for each row execute function set_updated_at();
create trigger trg_children_updated before update on children for each row execute function set_updated_at();
create trigger trg_pregnancies_updated before update on pregnancies for each row execute function set_updated_at();
create trigger trg_content_weeks_updated before update on content_weeks for each row execute function set_updated_at();
create trigger trg_content_baby_periods_updated before update on content_baby_periods for each row execute function set_updated_at();
create trigger trg_story_cards_updated before update on story_cards for each row execute function set_updated_at();
create trigger trg_photos_updated before update on photos for each row execute function set_updated_at();
create trigger trg_journal_entries_updated before update on journal_entries for each row execute function set_updated_at();
create trigger trg_contacts_updated before update on contacts for each row execute function set_updated_at();
create trigger trg_wishlists_updated before update on wishlists for each row execute function set_updated_at();
create trigger trg_appointments_updated before update on appointments for each row execute function set_updated_at();
create trigger trg_sharing_settings_updated before update on sharing_settings for each row execute function set_updated_at();
create trigger trg_notification_settings_updated before update on notification_settings for each row execute function set_updated_at();

-- ============================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Grundprinzip: Jede Tabelle hat RLS aktiv. User sieht nur Daten
-- von Familien, in denen er Mitglied ist. Content-Tabellen sind
-- öffentlich lesbar für angemeldete User.
-- ============================================================

alter table profiles enable row level security;
alter table families enable row level security;
alter table family_users enable row level security;
alter table invitations enable row level security;
alter table children enable row level security;
alter table pregnancies enable row level security;
alter table mother_measurements enable row level security;
alter table content_weeks enable row level security;
alter table content_baby_periods enable row level security;
alter table story_cards enable row level security;
alter table user_story_responses enable row level security;
alter table photos enable row level security;
alter table photo_children enable row level security;
alter table moments enable row level security;
alter table photo_moments enable row level security;
alter table journal_entries enable row level security;
alter table journal_entry_children enable row level security;
alter table journal_entry_photos enable row level security;
alter table health_records enable row level security;
alter table vaccination_catalog enable row level security;
alter table vaccinations enable row level security;
alter table contacts enable row level security;
alter table wishlists enable row level security;
alter table appointments enable row level security;
alter table sharing_settings enable row level security;
alter table notification_settings enable row level security;

-- Profiles: jeder sieht eigenes Profil + Profile von Familien-Mitgliedern
create policy profiles_select on profiles for select using (
  id = auth.uid()
  or exists (
    select 1 from family_users fu1
    join family_users fu2 on fu1.family_id = fu2.family_id
    where fu1.user_id = auth.uid() and fu2.user_id = profiles.id
  )
);
create policy profiles_update on profiles for update using (id = auth.uid());

-- Families: Mitglieder sehen ihre Familien
create policy families_select on families for select using (is_family_member(id));
create policy families_insert on families for insert with check (created_by = auth.uid());
create policy families_update on families for update using (is_family_member(id));

-- Family_users: Mitglieder sehen Mit-Mitglieder
create policy family_users_select on family_users for select using (is_family_member(family_id));
create policy family_users_insert on family_users for insert with check (user_id = auth.uid() or is_family_member(family_id));
create policy family_users_delete on family_users for delete using (user_id = auth.uid());

-- Invitations: Ersteller sieht eigene + jeder kann per Code einlösen (in App-Logik)
create policy invitations_select on invitations for select using (invited_by = auth.uid() or is_family_member(family_id));
create policy invitations_insert on invitations for insert with check (invited_by = auth.uid() and is_family_member(family_id));
create policy invitations_update on invitations for update using (true);

-- Children: Familien-Mitglieder sehen alle Kinder der Familie
create policy children_all on children for all using (is_family_member(family_id)) with check (is_family_member(family_id));

-- Pregnancies: an Kind gekoppelt
create policy pregnancies_all on pregnancies for all using (
  exists (select 1 from children c where c.id = pregnancies.child_id and is_family_member(c.family_id))
) with check (
  exists (select 1 from children c where c.id = pregnancies.child_id and is_family_member(c.family_id))
);

-- Mother_measurements: nur die Mutter selbst sieht sie
create policy mother_measurements_all on mother_measurements for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Content-Tabellen: alle angemeldeten User dürfen lesen
create policy content_weeks_select on content_weeks for select using (auth.uid() is not null);
create policy content_baby_periods_select on content_baby_periods for select using (auth.uid() is not null);
create policy story_cards_select on story_cards for select using (auth.uid() is not null);
create policy vaccination_catalog_select on vaccination_catalog for select using (auth.uid() is not null);

-- User_story_responses: eigener Verlauf
create policy user_story_responses_all on user_story_responses for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Photos: Familien-Mitglieder sehen Fotos mit visibility=family/trusted; private nur Uploader
create policy photos_select on photos for select using (
  is_family_member(family_id) and (visibility in ('family','trusted') or uploaded_by = auth.uid())
);
create policy photos_insert on photos for insert with check (uploaded_by = auth.uid() and is_family_member(family_id));
create policy photos_update on photos for update using (uploaded_by = auth.uid());
create policy photos_delete on photos for delete using (uploaded_by = auth.uid());

create policy photo_children_all on photo_children for all using (
  exists (select 1 from photos p where p.id = photo_id and is_family_member(p.family_id))
) with check (
  exists (select 1 from photos p where p.id = photo_id and is_family_member(p.family_id))
);

-- Moments: System-Tags öffentlich, User-Tags familien-scoped
create policy moments_select on moments for select using (is_system = true or is_family_member(family_id));
create policy moments_insert on moments for insert with check (is_family_member(family_id) and is_system = false);
create policy moments_delete on moments for delete using (is_family_member(family_id) and is_system = false);

create policy photo_moments_all on photo_moments for all using (
  exists (select 1 from photos p where p.id = photo_id and is_family_member(p.family_id))
) with check (
  exists (select 1 from photos p where p.id = photo_id and is_family_member(p.family_id))
);

-- Journal-Einträge: wie Fotos
create policy journal_select on journal_entries for select using (
  is_family_member(family_id) and (visibility in ('family','trusted') or author_id = auth.uid())
);
create policy journal_insert on journal_entries for insert with check (author_id = auth.uid() and is_family_member(family_id));
create policy journal_update on journal_entries for update using (author_id = auth.uid());
create policy journal_delete on journal_entries for delete using (author_id = auth.uid());

create policy journal_children_all on journal_entry_children for all using (
  exists (select 1 from journal_entries j where j.id = journal_entry_id and is_family_member(j.family_id))
) with check (
  exists (select 1 from journal_entries j where j.id = journal_entry_id and is_family_member(j.family_id))
);

create policy journal_photos_all on journal_entry_photos for all using (
  exists (select 1 from journal_entries j where j.id = journal_entry_id and is_family_member(j.family_id))
) with check (
  exists (select 1 from journal_entries j where j.id = journal_entry_id and is_family_member(j.family_id))
);

-- Health-Records: an Kind gekoppelt
create policy health_records_all on health_records for all using (
  exists (select 1 from children c where c.id = health_records.child_id and is_family_member(c.family_id))
) with check (
  exists (select 1 from children c where c.id = health_records.child_id and is_family_member(c.family_id))
);

create policy vaccinations_all on vaccinations for all using (
  exists (select 1 from children c where c.id = vaccinations.child_id and is_family_member(c.family_id))
) with check (
  exists (select 1 from children c where c.id = vaccinations.child_id and is_family_member(c.family_id))
);

-- Contacts, Wishlists, Appointments: familien-scoped
create policy contacts_all on contacts for all using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy wishlists_all on wishlists for all using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy appointments_all on appointments for all using (is_family_member(family_id)) with check (is_family_member(family_id));

-- Settings: pro User
create policy sharing_settings_all on sharing_settings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notification_settings_all on notification_settings for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- 12. STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photos', 'photos', false, 10485760, array['image/jpeg','image/png','image/heic','image/webp']),
  ('profile-photos', 'profile-photos', false, 5242880, array['image/jpeg','image/png','image/heic','image/webp'])
on conflict (id) do nothing;

create policy "Photos: Familien-Mitglieder lesen"
on storage.objects for select
using (
  bucket_id = 'photos'
  and exists (
    select 1 from photos p
    where p.storage_path = storage.objects.name
    and is_family_member(p.family_id)
    and (p.visibility in ('family','trusted') or p.uploaded_by = auth.uid())
  )
);

create policy "Photos: Upload durch angemeldete User"
on storage.objects for insert
with check (bucket_id = 'photos' and auth.uid() is not null);

create policy "Photos: Uploader darf ändern"
on storage.objects for update
using (
  bucket_id = 'photos'
  and exists (
    select 1 from photos p
    where p.storage_path = storage.objects.name and p.uploaded_by = auth.uid()
  )
);

create policy "Photos: Uploader darf löschen"
on storage.objects for delete
using (
  bucket_id = 'photos'
  and exists (
    select 1 from photos p
    where p.storage_path = storage.objects.name and p.uploaded_by = auth.uid()
  )
);

create policy "Profile-Photos: Alle angemeldeten lesen"
on storage.objects for select using (bucket_id = 'profile-photos' and auth.uid() is not null);

create policy "Profile-Photos: Upload durch angemeldete User"
on storage.objects for insert with check (bucket_id = 'profile-photos' and auth.uid() is not null);

create policy "Profile-Photos: Änderung durch angemeldete User"
on storage.objects for update using (bucket_id = 'profile-photos' and auth.uid() is not null);

create policy "Profile-Photos: Löschen durch angemeldete User"
on storage.objects for delete using (bucket_id = 'profile-photos' and auth.uid() is not null);

-- ============================================================
-- 13. SEED-DATEN: SYSTEM-MOMENT-TAGS
-- ============================================================

insert into moments (label, is_system, category) values
  ('Erstes Lächeln', true, 'firsttime'),
  ('Erster Zahn', true, 'firsttime'),
  ('Erste Schritte', true, 'firsttime'),
  ('Erste Worte', true, 'firsttime'),
  ('Erstes feste Mahlzeit', true, 'firsttime'),
  ('Erstes Mal sitzen', true, 'firsttime'),
  ('Erstes Mal krabbeln', true, 'firsttime'),
  ('Erstes Mal stehen', true, 'firsttime'),
  ('Erstes Mal winken', true, 'firsttime'),
  ('Erstes Mal lachen', true, 'firsttime'),
  ('Erstes Mal im Wasser', true, 'firsttime'),
  ('Erstes Mal am Meer', true, 'firsttime'),
  ('Erster Urlaub', true, 'firsttime'),
  ('Erster Geburtstag', true, 'milestone'),
  ('Zweiter Geburtstag', true, 'milestone'),
  ('Dritter Geburtstag', true, 'milestone'),
  ('Erster Kita-Tag', true, 'milestone'),
  ('Erste eigene Mahlzeit', true, 'milestone'),
  ('Im Bauch spüren', true, 'pregnancy'),
  ('Erstes Ultraschallbild', true, 'pregnancy'),
  ('Babybauch sichtbar', true, 'pregnancy'),
  ('Geburt', true, 'milestone'),
  ('Erstes Familienfoto', true, 'milestone'),
  ('Oma und Opa kennengelernt', true, 'family'),
  ('Geschwistertreffen', true, 'family'),
  ('Taufe / Willkommensfest', true, 'milestone'),
  ('Erster Ausflug', true, 'everyday'),
  ('Spielplatz-Premiere', true, 'everyday'),
  ('Lieblings-Kuscheltier gefunden', true, 'everyday'),
  ('Haare schneiden zum ersten Mal', true, 'firsttime');

-- ============================================================
-- 14. SEED-DATEN: STIKO-IMPFKATALOG (Stand 2024/2025)
-- ============================================================

insert into vaccination_catalog (vaccine_name, vaccine_code, recommended_age_months_min, recommended_age_months_max, description, is_stiko_standard) values
  ('Rotavirus (1. Dosis)', 'ROT-1', 2, 3, 'Schluckimpfung gegen Rotaviren, schützt vor schweren Durchfallerkrankungen.', true),
  ('Rotavirus (2. Dosis)', 'ROT-2', 3, 4, 'Zweite Schluckimpfung gegen Rotaviren.', true),
  ('Rotavirus (3. Dosis)', 'ROT-3', 4, 5, 'Dritte Schluckimpfung (abhängig vom Impfstoff).', true),
  ('6-fach (1. Dosis)', '6FACH-1', 2, 3, 'Tetanus, Diphtherie, Keuchhusten, Polio, Hib, Hepatitis B.', true),
  ('6-fach (2. Dosis)', '6FACH-2', 4, 5, 'Zweite Dosis der 6-fach-Impfung.', true),
  ('6-fach (3. Dosis)', '6FACH-3', 11, 14, 'Dritte Dosis der 6-fach-Impfung.', true),
  ('Pneumokokken (1. Dosis)', 'PNE-1', 2, 3, 'Schutz gegen Pneumokokken-Erkrankungen.', true),
  ('Pneumokokken (2. Dosis)', 'PNE-2', 4, 5, 'Zweite Dosis Pneumokokken.', true),
  ('Pneumokokken (3. Dosis)', 'PNE-3', 11, 14, 'Dritte Dosis Pneumokokken.', true),
  ('Meningokokken C', 'MEN-C', 12, 23, 'Schutz gegen Meningokokken Serogruppe C.', true),
  ('Meningokokken B (1. Dosis)', 'MEN-B-1', 2, 3, 'Schutz gegen Meningokokken Serogruppe B.', true),
  ('Meningokokken B (2. Dosis)', 'MEN-B-2', 4, 5, 'Zweite Dosis Meningokokken B.', true),
  ('Meningokokken B (3. Dosis)', 'MEN-B-3', 12, 15, 'Auffrischung Meningokokken B.', true),
  ('MMR (1. Dosis)', 'MMR-1', 11, 14, 'Masern, Mumps, Röteln.', true),
  ('MMR (2. Dosis)', 'MMR-2', 15, 23, 'Zweite Dosis Masern, Mumps, Röteln.', true),
  ('Varizellen (1. Dosis)', 'VAR-1', 11, 14, 'Impfung gegen Windpocken.', true),
  ('Varizellen (2. Dosis)', 'VAR-2', 15, 23, 'Zweite Dosis Windpocken.', true),
  ('Auffrischung 6-fach', '6FACH-AUFF', 60, 83, 'Auffrischungsimpfung im Vorschulalter (5–6 Jahre).', true);

-- ============================================================
-- ENDE DER INITIAL-MIGRATION
-- ============================================================
