create table if not exists public.projects
(
    id               uuid primary key     default gen_random_uuid(),
    slug             text        not null unique,
    title            text        not null,
    description      text        not null default '',
    long_description text,
    image_url        text        not null default '',
    tags             text[]      not null default '{}',
    category         text        not null default '',
    role             text,
    year             text,
    problem          text,
    solution         text,
    features         text[]      not null default '{}',
    tech_stack       jsonb       not null default '[]'::jsonb,
    featured         boolean     not null default false,
    display_order    integer     not null default 0,
    created_at       timestamptz not null default timezone('utc', now()),
    updated_at       timestamptz not null default timezone('utc', now())
);

grant select on public.projects
    to anon, authenticated, service_role;

grant ALL on public.projects
    to authenticated, service_role;

alter table public.projects
    enable row level security;

CREATE POLICY "Allow public read access"
    ON public.projects
    FOR select
    USING (true);

create policy "Authenticated users can do anything on projects"
    on public.skills
    for all
    to authenticated, service_role
    USING (true)
    WITH CHECK (true);