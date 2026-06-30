insert into site_settings (key, value, structure)
values ('hero_sentence_under_name', to_jsonb(cast('Full-Stack Architect' as text)), '{
  "type": "string"
}'),
       ('resume_title',
        to_jsonb(cast('Fullstack Developer | PHP & Laravel Developer | Experienced in React, Next.js, and Modern Frontend Frameworks | Building Scalable Web Solutions' as text)),
        '{
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
        to_jsonb(cast('963936955531' as text)),
        '{
          "type": "string"
        }'),
       ('location',
        to_jsonb(cast('Damascus' as text)),
        '{
          "type": "string"
        }'),
       ('linked_in',
        to_jsonb(cast('linkedin.com/in/khaldoun-alhalabi-38525432b' as text)),
        '{
          "type": "string"
        }'),
       ('github',
        to_jsonb(cast('https://github.com/khaldounalhalabi' as text)),
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
        }'),
       ('languages',
        to_jsonb(cast('Arabic, English' as text)),
        '{
          "type": "string"
        }'),
       ('education',
        to_jsonb(cast('Bachelor, Information Technology
Damascus University
01/2018 - 07/2025' as text)),
        '{
          "type": "paragraph"
        }')
on conflict do nothing;