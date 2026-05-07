-- Ejecutar en Supabase SQL Editor
-- Agrega el campo display_name a profiles

alter table public.profiles
  add column if not exists display_name text;

-- Policy para que el usuario actualice solo su propio perfil
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
