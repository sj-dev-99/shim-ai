-- SHIM.AI Phase 1: authentication profile, diary storage, and consent foundation.
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_nickname_length check (nickname is null or char_length(nickname) <= 40)
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion_code text not null,
  emotion_label text not null,
  content text not null default '',
  ai_comment text,
  entry_date date not null default ((now() at time zone 'Asia/Seoul')::date),
  migration_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diary_entries_emotion_code_check check (
    emotion_code in (
      'good',
      'calm',
      'warm',
      'excited',
      'okay',
      'neutral',
      'mixed',
      'anxious',
      'sad',
      'angry',
      'tired',
      'lonely'
    )
  ),
  constraint diary_entries_emotion_label_length check (char_length(emotion_label) between 1 and 40),
  constraint diary_entries_content_length check (char_length(content) <= 2000),
  constraint diary_entries_ai_comment_length check (ai_comment is null or char_length(ai_comment) <= 500)
);

create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  terms_agreed_at timestamptz not null default now(),
  privacy_agreed_at timestamptz not null default now(),
  marketing_agreed boolean not null default false,
  marketing_agreed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_consents_terms_version_length check (char_length(terms_version) between 1 and 20),
  constraint user_consents_privacy_version_length check (char_length(privacy_version) between 1 and 20)
);

create unique index if not exists diary_entries_user_migration_key_idx
  on public.diary_entries(user_id, migration_key)
  where migration_key is not null;

create index if not exists diary_entries_user_created_at_idx
  on public.diary_entries(user_id, created_at desc);

create index if not exists diary_entries_user_entry_date_idx
  on public.diary_entries(user_id, entry_date desc, created_at desc);

create index if not exists diary_entries_user_emotion_idx
  on public.diary_entries(user_id, emotion_code);

create index if not exists user_consents_user_created_at_idx
  on public.user_consents(user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists diary_entries_set_updated_at on public.diary_entries;
create trigger diary_entries_set_updated_at
before update on public.diary_entries
for each row execute function public.set_updated_at();

drop trigger if exists user_consents_set_updated_at on public.user_consents;
create trigger user_consents_set_updated_at
before update on public.user_consents
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'nickname', '')), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.diary_entries enable row level security;
alter table public.user_consents enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can read own diary entries" on public.diary_entries;
create policy "Users can read own diary entries"
on public.diary_entries
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own diary entries" on public.diary_entries;
create policy "Users can create own diary entries"
on public.diary_entries
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own diary entries" on public.diary_entries;
create policy "Users can update own diary entries"
on public.diary_entries
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete own diary entries" on public.diary_entries;
create policy "Users can delete own diary entries"
on public.diary_entries
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read own consents" on public.user_consents;
create policy "Users can read own consents"
on public.user_consents
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own consents" on public.user_consents;
create policy "Users can create own consents"
on public.user_consents
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own consents" on public.user_consents;
create policy "Users can update own consents"
on public.user_consents
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
