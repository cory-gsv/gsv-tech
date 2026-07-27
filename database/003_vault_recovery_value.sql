alter table vault_secret_records
  add column if not exists recovery_value_ciphertext text not null default '',
  add column if not exists recovery_value_iv text not null default '';
