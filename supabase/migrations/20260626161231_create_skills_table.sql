CREATE TABLE IF NOT EXISTS public.skills
(
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    skill_category_id UUID NOT NULL REFERENCES public.skill_categories (id) ON DELETE CASCADE
);