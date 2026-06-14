create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Usuario'),
    new.email,
    'lawyer',
    now(),
    now()
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    updated_at = now();

  insert into public.notification_settings (
    user_id,
    email_enabled,
    whatsapp_enabled,
    push_enabled,
    urgent_alerts_enabled,
    daily_summary_enabled,
    created_at,
    updated_at
  )
  values (
    new.id,
    true,
    false,
    false,
    true,
    true,
    now(),
    now()
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.users (id, name, email, role, created_at, updated_at)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1), 'Usuario'),
  email,
  'lawyer',
  now(),
  now()
from auth.users
on conflict (id) do update
set
  name = excluded.name,
  email = excluded.email,
  updated_at = now();

insert into public.notification_settings (
  user_id,
  email_enabled,
  whatsapp_enabled,
  push_enabled,
  urgent_alerts_enabled,
  daily_summary_enabled,
  created_at,
  updated_at
)
select
  id,
  true,
  false,
  false,
  true,
  true,
  now(),
  now()
from auth.users
on conflict (user_id) do nothing;
