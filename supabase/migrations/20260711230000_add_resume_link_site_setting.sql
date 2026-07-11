-- Adds a `resume_link` site setting that stores the public URL of the most
-- recently generated resume PDF. The URL changes on every regeneration
-- (unique object path), which busts Supabase Storage / browser caching so the
-- portfolio always links to the freshest resume.
insert into site_settings (key, value, structure)
values (
    'resume_link',
    to_jsonb(cast('' as text)),
    '{
      "type": "string"
    }'::jsonb
)
on conflict (key) do nothing;
