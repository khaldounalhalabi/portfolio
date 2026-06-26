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
        }'),
       ('email',
        to_jsonb(cast('khaldounalhalabi42@gmail.com' as text)),
        '{
          "type": "string"
        }'),
       ('phone',
        to_jsonb(cast('+963 956926129' as text)),
        '{
          "type": "string"
        }'),
       ('location',
        to_jsonb(cast('Damascus, Syria' as text)),
        '{
          "type": "string"
        }'),
       ('linked_in',
        to_jsonb(cast('https://linkedin.com' as text)),
        '{
          "type": "string"
        }'),
       ('github',
        to_jsonb(cast('https://github.com' as text)),
        '{
          "type": "string"
        }'),
       ('gitlab',
        to_jsonb(cast('https://gitlab.com' as text)),
        '{
          "type": "string"
        }'),
       ('stackoverflow',
        to_jsonb(cast('https://stackoverflow.com' as text)),
        '{
          "type": "string"
        }'),
       ('telegram',
        to_jsonb(cast('https://t.me/khaldounalhalabi' as text)),
        '{
          "type": "string"
        }'),
       ('whatsapp',
        to_jsonb(cast('https://wa.me/963956926129' as text)),
        '{
          "type": "string"
        }'),
       ('pre_filled_message',
        to_jsonb(cast('Hi Khaldoun! 👋 I''m interested in creating a new project and would like to discuss my requirements with you. When are you available?' as text)),
        '{
          "type": "string"
        }')
on conflict do nothing;