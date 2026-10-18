create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount_egp integer not null default 1000 check (amount_egp = 1000),
  wallet_number text not null default '01023645480' check (wallet_number = '01023645480'),
  sender_phone text not null check (sender_phone ~ '^01[0125][0-9]{8}$' and sender_phone <> '01023645480'),
  transaction_ref text not null check (transaction_ref ~ '^[A-Z0-9]{6,40}$'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create unique index if not exists subscription_payments_transaction_ref_uidx
  on public.subscription_payments (transaction_ref);

create unique index if not exists subscription_payments_one_pending_uidx
  on public.subscription_payments (user_id)
  where status = 'pending';

create index if not exists subscription_payments_user_id_idx
  on public.subscription_payments (user_id);

create index if not exists subscription_payments_created_at_idx
  on public.subscription_payments (created_at desc);

alter table public.subscription_payments enable row level security;

drop policy if exists "payments_select_own" on public.subscription_payments;
create policy "payments_select_own" on public.subscription_payments
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "payments_insert_own" on public.subscription_payments;
create policy "payments_insert_own" on public.subscription_payments
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and amount_egp = 1000
    and wallet_number = '01023645480'
  );

drop policy if exists "admin_all_payments" on public.subscription_payments;
create policy "admin_all_payments" on public.subscription_payments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
