-- Public storage bucket for the generated ATS resume PDF
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume', 'resume', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the resume PDF
CREATE POLICY "Allow public read access on resume"
    ON storage.objects
    FOR select
    USING (bucket_id = 'resume');

-- Allow authenticated users to upload/update/delete resume PDFs (dashboard regeneration)
CREATE POLICY "Allow authenticated uploads on resume"
    ON storage.objects
    FOR insert
    TO authenticated
    WITH CHECK (bucket_id = 'resume');

CREATE POLICY "Allow authenticated updates on resume"
    ON storage.objects
    FOR update
    TO authenticated
    USING (bucket_id = 'resume');

CREATE POLICY "Allow authenticated deletes on resume"
    ON storage.objects
    FOR delete
    TO authenticated
    USING (bucket_id = 'resume');
