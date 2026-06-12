create table if not exists site_settings
(
    id        uuid  not null unique default gen_random_uuid(),
    key       text  not null unique,
    value     text  not null,
    structure jsonb not null
);

alter table site_settings
    enable row level security;

grant ALL on public.site_settings
    to anon, authenticated , service_role;

CREATE POLICY "Allow public read access"
    ON public.site_settings
    FOR select
    USING (true);

create policy "Authenticated users can do anything on site settings table"
    on public.site_settings
    for all
    to authenticated, service_role
    USING (true)
    WITH CHECK (true);
