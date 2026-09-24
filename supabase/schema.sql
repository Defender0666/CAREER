-- CareerOS Ultimate Supabase schema
-- Run this in Supabase SQL Editor. Review before production deployment.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  company_name text not null default 'Maccy Creations',
  avatar_url text,
  bio text,
  location text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_name text not null,
  proficiency smallint not null default 1 check (proficiency between 1 and 5),
  target_proficiency smallint not null default 3 check (target_proficiency between 1 and 5),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, skill_name)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  status text not null default 'Applied' check (status in ('Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
  source text not null default '',
  job_url text,
  location text,
  notes text not null default '',
  applied_on date,
  follow_up_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  goal text not null default '',
  content jsonb not null default '{}'::jsonb,
  provider text,
  source_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Resume',
  content text not null default '',
  ats_analysis jsonb not null default '{}'::jsonb,
  source_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  provider text not null,
  prompt_hash text,
  response jsonb not null default '{}'::jsonb,
  citations jsonb not null default '[]'::jsonb,
  status text not null default 'completed' check (status in ('queued', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists applications_user_updated_idx on public.applications(user_id, updated_at desc);
create index if not exists skills_user_name_idx on public.user_skills(user_id, skill_name);
create index if not exists ai_runs_user_created_idx on public.ai_runs(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists skills_set_updated_at on public.user_skills;
create trigger skills_set_updated_at before update on public.user_skills for each row execute function public.set_updated_at();
drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at before update on public.applications for each row execute function public.set_updated_at();
drop trigger if exists roadmaps_set_updated_at on public.roadmaps;
create trigger roadmaps_set_updated_at before update on public.roadmaps for each row execute function public.set_updated_at();
drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at before update on public.resumes for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_skills enable row level security;
alter table public.applications enable row level security;
alter table public.roadmaps enable row level security;
alter table public.resumes enable row level security;
alter table public.ai_runs enable row level security;

drop policy if exists profiles_owner_select on public.profiles;
create policy profiles_owner_select on public.profiles for select using (auth.uid() = id);
drop policy if exists profiles_owner_insert on public.profiles;
create policy profiles_owner_insert on public.profiles for insert with check (auth.uid() = id);
drop policy if exists profiles_owner_update on public.profiles;
create policy profiles_owner_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array['user_skills','applications','roadmaps','resumes','ai_runs'] loop
    execute format('drop policy if exists %I_owner_select on public.%I', t, t);
    execute format('create policy %I_owner_select on public.%I for select using (auth.uid() = user_id)', t, t);
    execute format('drop policy if exists %I_owner_insert on public.%I', t, t);
    execute format('create policy %I_owner_insert on public.%I for insert with check (auth.uid() = user_id)', t, t);
    execute format('drop policy if exists %I_owner_update on public.%I', t, t);
    execute format('create policy %I_owner_update on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t, t);
    execute format('drop policy if exists %I_owner_delete on public.%I', t, t);
    execute format('create policy %I_owner_delete on public.%I for delete using (auth.uid() = user_id)', t, t);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
