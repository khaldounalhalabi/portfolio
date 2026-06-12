insert into site_settings (key, value, structure)
values ('hero_sentence_under_name', to_jsonb(cast('Full-Stack Architect' as text)), '{
  "type": "string"
}'),
       ('hero_skills', '[
         "PHP & Laravel",
         "React & NEXT.JS",
         "Supabase",
         "System Design"
       ]', '{
         "type": "array"
       }'),
       ('hero_paragraph',
        to_jsonb(cast('Backend-first engineering with a strong frontend eye. I build scalable systems, sharp interfaces, and admin workflows that keep content maintainable after launch.' as text)),
        '{
          "type": "paragraph"
        }');