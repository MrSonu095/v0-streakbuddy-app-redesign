-- Enable UUID extension if needed
create extension if not exists pgcrypto;

-- Profiles table stores the current streak state for each authenticated user
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  habits jsonb not null default '[]'::jsonb,
  history jsonb not null default '[]'::jsonb,
  last_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional helpful index
create index if not exists profiles_user_id_idx on public.profiles (user_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can read and write only their own profile row
create policy if not exists "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- Keep updated_at fresh on every write
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();
