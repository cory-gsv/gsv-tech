alter table vault_documents
  add column if not exists title text not null default '',
  add column if not exists description text not null default '';
