-- 003_rls_withdraw.sql — harden RLS, add trade_logs.user_id, is_admin(), replace permissive policies
create extension if not exists "pgcrypto";

-- 1) trade_logs.user_id (LIVE has no user_id; Dashboard queries by user_id)
alter table public.trade_logs add column if not exists user_id uuid references public.profiles(id) on delete cascade;
create index if not exists idx_trade_logs_user_id on public.trade_logs(user_id);
create index if not exists idx_trade_logs_broker_account_id on public.trade_logs(broker_account_id);
-- backfill from broker_accounts
update public.trade_logs t set user_id = b.user_id from public.broker_accounts b where t.broker_account_id = b.id and t.user_id is null;

-- 2) is_admin() helper — checks profiles.role = 'admin' for current auth.uid()
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin','admin_ops','finance'))
$$;
grant execute on function public.is_admin() to authenticated, anon;

-- 3) ensure RLS enabled
alter table public.profiles enable row level security;
alter table public.broker_accounts enable row level security;
alter table public.rebate_rules enable row level security;
alter table public.trade_logs enable row level security;
alter table public.user_balances enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.audit_logs enable row level security;

-- 4) drop permissive "allow all ..." policies (if present)
drop policy if exists "allow all profiles" on public.profiles;
drop policy if exists "allow all broker_accounts" on public.broker_accounts;
drop policy if exists "allow all rebate_rules" on public.rebate_rules;
drop policy if exists "allow all trade_logs" on public.trade_logs;
drop policy if exists "allow all user_balances" on public.user_balances;
drop policy if exists "allow all withdrawal_requests" on public.withdrawal_requests;
drop policy if exists "allow all audit_logs" on public.audit_logs;

-- also drop previous hardened policies if re-running
drop policy if exists "profiles_owner_admin" on public.profiles;
drop policy if exists "profiles_select_owner_admin" on public.profiles;
drop policy if exists "profiles_insert_owner_admin" on public.profiles;
drop policy if exists "profiles_update_owner_admin" on public.profiles;
drop policy if exists "profiles_delete_owner_admin" on public.profiles;
drop policy if exists "broker_accounts_owner_admin" on public.broker_accounts;
drop policy if exists "trade_logs_owner_admin" on public.trade_logs;
drop policy if exists "user_balances_owner_admin" on public.user_balances;
drop policy if exists "withdrawal_requests_owner_admin" on public.withdrawal_requests;
drop policy if exists "audit_logs_owner_admin_select" on public.audit_logs;
drop policy if exists "audit_logs_owner_admin_insert" on public.audit_logs;
drop policy if exists "rebate_rules_public_read" on public.rebate_rules;
drop policy if exists "rebate_rules_admin_write" on public.rebate_rules;
drop policy if exists "rebate_rules_admin_insert" on public.rebate_rules;
drop policy if exists "rebate_rules_admin_update" on public.rebate_rules;
drop policy if exists "rebate_rules_admin_delete" on public.rebate_rules;

-- 5) profiles: owner-only OR admin (insert/update/select); delete admin only
create policy "profiles_owner_admin" on public.profiles for all
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- 6) broker_accounts: owner-only OR admin
create policy "broker_accounts_owner_admin" on public.broker_accounts for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- 7) trade_logs: owner-only OR admin
create policy "trade_logs_owner_admin" on public.trade_logs for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- 8) user_balances: owner-only OR admin
create policy "user_balances_owner_admin" on public.user_balances for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- 9) withdrawal_requests: owner-only OR admin
create policy "withdrawal_requests_owner_admin" on public.withdrawal_requests for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- 10) rebate_rules: public read, admin write only
create policy "rebate_rules_public_read" on public.rebate_rules for select using (true);
create policy "rebate_rules_admin_insert" on public.rebate_rules for insert with check (public.is_admin());
create policy "rebate_rules_admin_update" on public.rebate_rules for update using (public.is_admin()) with check (public.is_admin());
create policy "rebate_rules_admin_delete" on public.rebate_rules for delete using (public.is_admin());

-- 11) audit_logs: owner (actor_id) + admin; allow insert for own actions or admin
create policy "audit_logs_owner_admin_select" on public.audit_logs for select using (auth.uid() = actor_id or public.is_admin());
create policy "audit_logs_owner_admin_insert" on public.audit_logs for insert with check (auth.uid() = actor_id or public.is_admin());
