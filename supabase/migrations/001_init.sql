-- SplitBudget MVP schema
create extension if not exists "pgcrypto";

-- users handled by auth.users, profile in public.profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  qris_image_url text,
  bank_details text,
  created_at timestamptz default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text default 'IDR',
  invite_code text unique not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.group_members (
  group_id uuid references public.groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade not null,
  paid_by uuid references auth.users(id) not null,
  amount int not null check (amount > 0),
  description text not null,
  category text default 'lainnya',
  created_at timestamptz default now()
);

create table if not exists public.expense_splits (
  expense_id uuid references public.expenses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  amount_owed int not null check (amount_owed >= 0),
  primary key (expense_id, user_id)
);

create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade not null,
  payer_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id) not null,
  amount int not null check (amount > 0),
  status text default 'pending' check (status in ('pending','completed')),
  proof_image_url text,
  created_at timestamptz default now()
);

-- RLS enable
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_splits enable row level security;
alter table public.settlements enable row level security;

-- permissive policies for MVP (lock down later)
create policy "allow all profiles" on public.profiles for all using (true) with check (true);
create policy "allow all groups" on public.groups for all using (true) with check (true);
create policy "allow all group_members" on public.group_members for all using (true) with check (true);
create policy "allow all expenses" on public.expenses for all using (true) with check (true);
create policy "allow all splits" on public.expense_splits for all using (true) with check (true);
create policy "allow all settlements" on public.settlements for all using (true) with check (true);

-- storage bucket for proofs/qris
insert into storage.buckets (id, name, public) values ('proofs','proofs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('qris','qris', true) on conflict (id) do nothing;
create policy "public proofs" on storage.objects for all using (bucket_id in ('proofs','qris')) with check (bucket_id in ('proofs','qris'));

-- handle new user -> profiles
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url) values (new.id, coalesce(new.raw_user_meta_data->>'name',''), new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
