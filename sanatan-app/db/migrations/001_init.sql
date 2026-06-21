-- Initial schema for auth, reading features, and resource metadata.

begin;

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  password_hash text,
  auth_provider text not null default 'credentials',
  created_at timestamptz not null default now()
);

create table if not exists user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  scripture_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, scripture_id)
);

create table if not exists reading_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  scripture_id text not null,
  chapter_id int not null,
  progress numeric(5,2) default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, scripture_id, chapter_id)
);

create table if not exists chapter_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  scripture_id text not null,
  chapter_id int not null,
  note_text text not null,
  highlighted_excerpt text,
  created_at timestamptz not null default now()
);

create table if not exists resource_uploads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  language text,
  author text,
  translator text,
  description text,
  category text not null,
  storage_provider text not null,
  object_key text,
  public_url text,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

commit;
