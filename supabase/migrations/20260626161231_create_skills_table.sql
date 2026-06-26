CREATE TABLE IF NOT EXISTS public.skills
(
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    skill_category_id UUID NOT NULL REFERENCES public.skill_categories (id) ON DELETE CASCADE
);

grant select on public.skills
    to anon, authenticated, service_role;

grant ALL on public.skills
    to authenticated, service_role;

alter table public.skills
    enable row level security;

CREATE POLICY "Allow public read access"
    ON public.skills
    FOR select
    USING (true);

create policy "Authenticated users can do anything on skills"
    on public.skills
    for all
    to authenticated, service_role
    USING (true)
    WITH CHECK (true);