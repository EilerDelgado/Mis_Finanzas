-- ============================================================
-- FinanceTrack — Schema limpio
-- Ejecutar completo en Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'user' check (role in ('superadmin', 'user')),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in ('income', 'expense')),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  amount      numeric(12, 2) not null check (amount > 0),
  description text,
  date        date not null,
  type        text not null check (type in ('income', 'expense')),
  created_by  uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TRIGGER: crea perfil automáticamente al registrar usuario
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- FUNCIÓN HELPER: evita recursión en policies de superadmin
-- ============================================================

create or replace function public.is_superadmin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  );
$$;

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.categories   enable row level security;
alter table public.transactions enable row level security;

-- PROFILES
-- Cada usuario lee su propio perfil
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Superadmin lee todos los perfiles
create policy "profiles_select_superadmin"
  on public.profiles for select
  using (public.is_superadmin());

-- Solo superadmin puede actualizar perfiles
create policy "profiles_update_superadmin"
  on public.profiles for update
  using (public.is_superadmin());

-- CATEGORIES
-- CRUD solo sobre las propias categorías
create policy "categories_all_own"
  on public.categories for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- TRANSACTIONS
-- CRUD solo sobre las propias transacciones
create policy "transactions_all_own"
  on public.transactions for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Superadmin puede leer todas las transacciones (métricas globales)
create policy "transactions_select_superadmin"
  on public.transactions for select
  using (public.is_superadmin());
