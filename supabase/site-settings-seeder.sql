insert into site_settings (key, value, structure)
values ('hero_sentence_under_name', 'Full-Stack Architect', '{
  "type": "string"
}'),
       ('hero_skills', '["PHP & Laravel" , "React & NEXT.JS" , "Supabase" , "System Design"]', '{
         "type": "array"
       }'),
       ('hero_paragraph',
        'Backend-first engineering with a strong frontend eye. I build scalable systems, sharp interfaces, and admin workflows that keep content maintainable after launch.',
        '{
          "type": "paragraph"
        }');