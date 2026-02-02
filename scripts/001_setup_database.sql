-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create workspaces table
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text default '📁',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.workspaces enable row level security;

create policy "workspaces_select_own" on public.workspaces for select using (auth.uid() = user_id);
create policy "workspaces_insert_own" on public.workspaces for insert with check (auth.uid() = user_id);
create policy "workspaces_update_own" on public.workspaces for update using (auth.uid() = user_id);
create policy "workspaces_delete_own" on public.workspaces for delete using (auth.uid() = user_id);

-- Create documents table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled',
  content jsonb default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_favorite boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.documents enable row level security;

create policy "documents_select_own" on public.documents for select using (auth.uid() = user_id);
create policy "documents_insert_own" on public.documents for insert with check (auth.uid() = user_id);
create policy "documents_update_own" on public.documents for update using (auth.uid() = user_id);
create policy "documents_delete_own" on public.documents for delete using (auth.uid() = user_id);

-- Create lingo_translations table (for future Lingo.dev integration)
create table if not exists public.lingo_translations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  locale text not null,
  translated_content jsonb,
  status text default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(document_id, locale)
);

alter table public.lingo_translations enable row level security;

create policy "lingo_translations_select_own" on public.lingo_translations 
  for select using (
    exists (
      select 1 from public.documents 
      where documents.id = lingo_translations.document_id 
      and documents.user_id = auth.uid()
    )
  );

create policy "lingo_translations_insert_own" on public.lingo_translations 
  for insert with check (
    exists (
      select 1 from public.documents 
      where documents.id = lingo_translations.document_id 
      and documents.user_id = auth.uid()
    )
  );

create policy "lingo_translations_update_own" on public.lingo_translations 
  for update using (
    exists (
      select 1 from public.documents 
      where documents.id = lingo_translations.document_id 
      and documents.user_id = auth.uid()
    )
  );

create policy "lingo_translations_delete_own" on public.lingo_translations 
  for delete using (
    exists (
      select 1 from public.documents 
      where documents.id = lingo_translations.document_id 
      and documents.user_id = auth.uid()
    )
  );

-- Create trigger function to update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

drop trigger if exists workspaces_updated_at on public.workspaces;
create trigger workspaces_updated_at
  before update on public.workspaces
  for each row
  execute function public.update_updated_at();

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at
  before update on public.documents
  for each row
  execute function public.update_updated_at();

drop trigger if exists lingo_translations_updated_at on public.lingo_translations;
create trigger lingo_translations_updated_at
  before update on public.lingo_translations
  for each row
  execute function public.update_updated_at();

-- Create function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
