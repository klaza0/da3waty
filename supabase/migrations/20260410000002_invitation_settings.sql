alter table public.invitations
  add column if not exists settings jsonb not null default '{}'::jsonb;
