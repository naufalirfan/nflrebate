-- Nfl Rebate Fase 1 schema
create table if not exists public.broker_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  broker_name text not null check (broker_name in ('Exness','XM','Headway')),
  account_number text not null,
  server_name text,
  account_type text not null default 'Standard' check (account_type in ('Standard','Cent','Raw','ECN','Pro')),
  status text not null default 'pending' check (status in ('pending','active','rejected')),
  created_at timestamptz default now(),
  unique (broker_name, account_number)
);

create table if not exists public.rebate_rules (
  id uuid primary key default gen_random_uuid(),
  broker_name text not null,
  account_type text,
  symbol_group text,
  rate_per_lot numeric not null default 0,
  currency text default 'USD',
  created_at timestamptz default now()
);

create table if not exists public.trade_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  broker_account_id uuid references public.broker_accounts(id) on delete set null,
  broker_name text,
  account_number text,
  ticket_id text not null unique,
  symbol text not null,
  volume_lots numeric not null check (volume_lots > 0),
  close_time timestamptz not null,
  client_rebate numeric not null default 0,
  status text not null default 'approved' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

create table if not exists public.user_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  available_balance numeric not null default 0,
  total_earned numeric not null default 0,
  total_withdrawn numeric not null default 0,
  updated_at timestamptz default now()
);

create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','approved','rejected','paid')),
  created_at timestamptz default now()
);

alter table public.broker_accounts enable row level security;
alter table public.rebate_rules enable row level security;
alter table public.trade_logs enable row level security;
alter table public.user_balances enable row level security;
alter table public.withdrawals enable row level security;

drop policy if exists "allow all broker_accounts" on public.broker_accounts;
drop policy if exists "allow all rebate_rules" on public.rebate_rules;
drop policy if exists "allow all trade_logs" on public.trade_logs;
drop policy if exists "allow all user_balances" on public.user_balances;
drop policy if exists "allow all withdrawals" on public.withdrawals;
create policy "allow all broker_accounts" on public.broker_accounts for all using (true) with check (true);
create policy "allow all rebate_rules" on public.rebate_rules for all using (true) with check (true);
create policy "allow all trade_logs" on public.trade_logs for all using (true) with check (true);
create policy "allow all user_balances" on public.user_balances for all using (true) with check (true);
create policy "allow all withdrawals" on public.withdrawals for all using (true) with check (true);

-- extend signup trigger: profiles + balances row
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
    values (new.id, coalesce(new.raw_user_meta_data->>'name',''), new.email, new.raw_user_meta_data->>'avatar_url')
    on conflict (id) do nothing;
  insert into public.user_balances (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- seed default rates: forex $8/lot, metals $12, indices $6 per broker
insert into public.rebate_rules (broker_name, account_type, symbol_group, rate_per_lot) values
  ('Exness','*','forex',8),('Exness','*','metals',12),('Exness','*','indices',6),
  ('XM','*','forex',7),('XM','*','metals',10),('XM','*','indices',5),
  ('Headway','*','forex',9),('Headway','*','metals',13),('Headway','*','indices',7)
on conflict do nothing;
