CREATE TABLE IF NOT EXISTS public.projects
(
    id               uuid primary key     default gen_random_uuid(),
    slug             text not null generated always as (
        lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
        ) stored unique,
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
    employer         text,
    featured         boolean     not null default false,
    display_order    integer     not null default 0,
    project_url      text,
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
    on public.projects
    for all
    to authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- Initialize the public storage bucket used for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access on portfolio-images"
    ON storage.objects
    FOR select
    USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow authenticated uploads on portfolio-images"
    ON storage.objects
    FOR insert
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Allow authenticated updates on portfolio-images"
    ON storage.objects
    FOR update
    TO authenticated
    USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow authenticated deletes on portfolio-images"
    ON storage.objects
    FOR delete
    TO authenticated
    USING (bucket_id = 'portfolio-images');
