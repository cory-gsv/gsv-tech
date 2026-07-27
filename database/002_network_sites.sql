create table if not exists portal_network_sites (
  id text primary key,
  external_client_id text not null,
  name text not null,
  street_address text not null default '',
  address_line_2 text not null default '',
  city text not null default '',
  region text not null default '',
  postal_code text not null default '',
  phone text not null default '',
  contact_name text not null default '',
  host_id text not null default '',
  site_id text not null default '',
  host_env_key text not null default '',
  site_env_key text not null default '',
  env_prefix text not null default '',
  notes text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portal_network_sites_client_idx
  on portal_network_sites(external_client_id, name);

alter table portal_network_sites add column if not exists host_env_key text not null default '';
alter table portal_network_sites add column if not exists site_env_key text not null default '';
alter table portal_network_sites add column if not exists sort_order integer not null default 0;
