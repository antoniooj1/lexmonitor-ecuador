create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null default 'lawyer',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.judicial_processes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  process_number text not null,
  court text not null,
  province text not null,
  canton text not null,
  matter text not null,
  process_type text not null,
  actors text not null,
  defendants text not null,
  current_status text not null,
  last_action text,
  last_action_date date,
  satje_source_url text,
  monitoring_enabled boolean not null default true,
  last_checked_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.judicial_actions (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.judicial_processes(id) on delete cascade,
  action_date date not null,
  action_type text not null,
  raw_text text not null,
  ai_summary text,
  suggested_action text,
  urgency_level text not null default 'baja',
  has_deadline boolean not null default false,
  detected_deadline_text text,
  tentative_due_date date,
  confirmed_due_date date,
  reviewed boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.judicial_processes(id) on delete cascade,
  action_id uuid references public.judicial_actions(id) on delete set null,
  title text not null,
  description text not null,
  urgency_level text not null default 'baja',
  suggested_action text,
  due_date date,
  status text not null default 'pendiente',
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.deadlines (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.judicial_processes(id) on delete cascade,
  action_id uuid references public.judicial_actions(id) on delete set null,
  deadline_type text not null,
  detected_text text,
  tentative_due_date date,
  confirmed_due_date date,
  manually_adjusted boolean not null default false,
  status text not null default 'pendiente',
  created_at timestamp with time zone not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.judicial_processes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  process_id uuid not null references public.judicial_processes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  uploaded_at timestamp with time zone not null default now()
);

create table if not exists public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  email_enabled boolean not null default true,
  whatsapp_enabled boolean not null default false,
  push_enabled boolean not null default false,
  urgent_alerts_enabled boolean not null default true,
  daily_summary_enabled boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.query_logs (
  id uuid primary key default gen_random_uuid(),
  process_id uuid references public.judicial_processes(id) on delete set null,
  status text not null,
  message text,
  checked_at timestamp with time zone not null default now()
);

create index if not exists judicial_processes_user_id_idx on public.judicial_processes(user_id);
create index if not exists judicial_processes_process_number_idx on public.judicial_processes(process_number);
create index if not exists judicial_actions_process_id_idx on public.judicial_actions(process_id);
create index if not exists alerts_process_id_idx on public.alerts(process_id);
create index if not exists deadlines_process_id_idx on public.deadlines(process_id);
create index if not exists notes_process_id_idx on public.notes(process_id);
create index if not exists documents_process_id_idx on public.documents(process_id);

alter table public.users enable row level security;
alter table public.judicial_processes enable row level security;
alter table public.judicial_actions enable row level security;
alter table public.alerts enable row level security;
alter table public.deadlines enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;
alter table public.notification_settings enable row level security;
alter table public.query_logs enable row level security;

create policy "users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

create policy "users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "users can manage own processes" on public.judicial_processes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can read own actions" on public.judicial_actions
  for select using (
    exists (
      select 1 from public.judicial_processes p
      where p.id = judicial_actions.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can insert own actions" on public.judicial_actions
  for insert with check (
    exists (
      select 1 from public.judicial_processes p
      where p.id = judicial_actions.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can update own actions" on public.judicial_actions
  for update using (
    exists (
      select 1 from public.judicial_processes p
      where p.id = judicial_actions.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can read own alerts" on public.alerts
  for select using (
    exists (
      select 1 from public.judicial_processes p
      where p.id = alerts.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can insert own alerts" on public.alerts
  for insert with check (
    exists (
      select 1 from public.judicial_processes p
      where p.id = alerts.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can update own alerts" on public.alerts
  for update using (
    exists (
      select 1 from public.judicial_processes p
      where p.id = alerts.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can read own deadlines" on public.deadlines
  for select using (
    exists (
      select 1 from public.judicial_processes p
      where p.id = deadlines.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can insert own deadlines" on public.deadlines
  for insert with check (
    exists (
      select 1 from public.judicial_processes p
      where p.id = deadlines.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can update own deadlines" on public.deadlines
  for update using (
    exists (
      select 1 from public.judicial_processes p
      where p.id = deadlines.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can manage own notes" on public.notes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can manage own documents" on public.documents
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can manage own notification settings" on public.notification_settings
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can read own query logs" on public.query_logs
  for select using (
    process_id is null or exists (
      select 1 from public.judicial_processes p
      where p.id = query_logs.process_id and p.user_id = auth.uid()
    )
  );

create policy "users can insert own query logs" on public.query_logs
  for insert with check (
    process_id is null or exists (
      select 1 from public.judicial_processes p
      where p.id = query_logs.process_id and p.user_id = auth.uid()
    )
  );

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
