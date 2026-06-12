create table if not exists skill_categories
(
    id          uuid not null unique default gen_random_uuid(),
    name        text not null unique,
    description text not null
);

alter table skill_categories
    enable row level security;

grant ALL on public.skill_categories
    to anon, authenticated , service_role;

CREATE POLICY "Allow public read access"
    ON public.skill_categories
    FOR select
    USING (true);

create policy "Authenticated users can do anything on site skill_categories"
    on public.skill_categories
    for all
    to authenticated, service_role
    USING (true)
    WITH CHECK (true);