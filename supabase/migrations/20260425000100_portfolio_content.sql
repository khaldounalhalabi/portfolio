create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  long_description text,
  image_url text not null default '',
  tags text[] not null default '{}',
  category text not null default '',
  role text,
  year text,
  problem text,
  solution text,
  features text[] not null default '{}',
  tech_stack jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skill_groups (
  id text primary key,
  title text not null,
  icon text not null default 'terminal',
  skills text[] not null default '{}',
  description text,
  is_highlight boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_info (
  id text primary key,
  email text not null,
  phone text not null,
  location text not null,
  intro text not null,
  availability text not null,
  resume_label text,
  resume_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_links (
  id text primary key,
  label text not null,
  url text not null,
  icon text not null default 'link',
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_skill_groups_updated_at on public.skill_groups;
create trigger set_skill_groups_updated_at
before update on public.skill_groups
for each row
execute function public.set_updated_at();

drop trigger if exists set_contact_info_updated_at on public.contact_info;
create trigger set_contact_info_updated_at
before update on public.contact_info
for each row
execute function public.set_updated_at();

drop trigger if exists set_contact_links_updated_at on public.contact_links;
create trigger set_contact_links_updated_at
before update on public.contact_links
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.contact_info enable row level security;
alter table public.contact_links enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
on public.projects
for select
using (true);

drop policy if exists "Public can read skill groups" on public.skill_groups;
create policy "Public can read skill groups"
on public.skill_groups
for select
using (true);

drop policy if exists "Public can read contact info" on public.contact_info;
create policy "Public can read contact info"
on public.contact_info
for select
using (true);

drop policy if exists "Public can read contact links" on public.contact_links;
create policy "Public can read contact links"
on public.contact_links
for select
using (true);
