-- Fix für Etappe 1: public.handle_new_user() findet die Tabellen nicht,
-- weil der search_path beim Auth-Trigger leer ist.
-- Lösung: search_path fest auf public setzen und zusätzlich alle
-- Tabellen-Referenzen mit public.-Präfix versehen.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family_id uuid;
begin
  -- Profile anlegen
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));

  -- Leere Start-Familie anlegen
  insert into public.families (created_by)
  values (new.id)
  returning id into new_family_id;

  -- User der Familie hinzufügen (Default-Rolle: other, wird im Onboarding überschrieben)
  insert into public.family_users (family_id, user_id, role)
  values (new_family_id, new.id, 'other');

  -- Default-Settings anlegen
  insert into public.sharing_settings (user_id) values (new.id);
  insert into public.notification_settings (user_id) values (new.id);

  return new;
end;
$$;
