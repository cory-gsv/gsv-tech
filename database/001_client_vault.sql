create extension if not exists pgcrypto;

create table if not exists vault_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null default '',
  role text not null check (role in ('admin', 'client')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vault_clients (
  id uuid primary key default gen_random_uuid(),
  external_client_id text unique,
  name text not null,
  status text not null default 'active' check (status in ('active', 'offboarding', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vault_client_memberships (
  user_id uuid not null references vault_users(id) on delete cascade,
  client_id uuid not null references vault_clients(id) on delete cascade,
  can_view_credentials boolean not null default true,
  can_export boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

create table if not exists vault_secret_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references vault_clients(id) on delete cascade,
  title text not null,
  category text not null default 'General',
  url text not null default '',
  username text not null default '',
  secret_ciphertext text not null,
  secret_iv text not null,
  secret_tag text not null default '',
  client_notes text not null default '',
  internal_notes text not null default '',
  mfa_method text not null default '',
  recovery_method text not null default '',
  recovery_value_ciphertext text not null default '',
  recovery_value_iv text not null default '',
  sensitivity text not null default 'highly_sensitive' check (sensitivity in ('standard', 'confidential', 'highly_sensitive', 'break_glass')),
  client_visible boolean not null default false,
  exportable boolean not null default false,
  last_verified_at timestamptz,
  last_rotated_at timestamptz,
  created_by uuid references vault_users(id) on delete set null,
  updated_by uuid references vault_users(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vault_documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references vault_clients(id) on delete cascade,
  folder text not null default 'General',
  filename text not null,
  title text not null default '',
  description text not null default '',
  blob_path text not null,
  mime_type text not null default '',
  byte_size bigint not null default 0,
  checksum_sha256 text not null default '',
  sensitivity text not null default 'confidential' check (sensitivity in ('standard', 'confidential', 'highly_sensitive', 'break_glass')),
  client_visible boolean not null default false,
  exportable boolean not null default false,
  version integer not null default 1,
  created_by uuid references vault_users(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists vault_access_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references vault_users(id) on delete set null,
  actor_email text not null default '',
  client_id uuid references vault_clients(id) on delete set null,
  target_type text not null,
  target_id uuid,
  event_type text not null,
  reason text not null default '',
  ip_address text not null default '',
  user_agent text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists vault_secret_records_client_id_idx
  on vault_secret_records(client_id)
  where deleted_at is null;

create index if not exists vault_documents_client_id_idx
  on vault_documents(client_id)
  where deleted_at is null;

create index if not exists vault_access_events_client_id_created_at_idx
  on vault_access_events(client_id, created_at desc);
