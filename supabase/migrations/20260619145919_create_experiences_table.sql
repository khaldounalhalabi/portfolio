CREATE TABLE IF NOT EXISTS public.experiences
(
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name        TEXT NOT NULL,
    company_description TEXT             DEFAULT NULL,
    "from"              DATE NOT NULL,
    "to"                DATE,
    job_description     TEXT NOT NULL,
    company_website     TEXT,
    location            text not null,
    position            text not null
);

ALTER TABLE public.experiences
    ENABLE ROW LEVEL SECURITY;

GRANT ALL PRIVILEGES
    ON TABLE public.experiences
    TO anon, authenticated, service_role;

CREATE POLICY "Allow public read access"
    ON public.experiences
    FOR select
    USING (true);

create policy "Authenticated users can do anything on experiences table"
    on public.experiences
    for all
    to authenticated, service_role
    USING (true)
    WITH CHECK (true);