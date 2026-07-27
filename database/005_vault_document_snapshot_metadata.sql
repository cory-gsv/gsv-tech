alter table vault_documents
  add column if not exists source text not null default '',
  add column if not exists snapshot_id text not null default '',
  add column if not exists location_id text not null default '',
  add column if not exists location_name text not null default '',
  add column if not exists artifact_kind text not null default '',
  add column if not exists report_kind text not null default '',
  add column if not exists backup_kind text not null default '';

create index if not exists vault_documents_client_snapshot_idx
  on vault_documents(client_id, snapshot_id)
  where deleted_at is null and snapshot_id <> '';
