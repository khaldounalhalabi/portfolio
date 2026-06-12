DO
$$
    DECLARE
        admin_email    CONSTANT TEXT := 'khaldounalhalabi42@gmail.com';
        admin_password CONSTANT TEXT := 'D@rkl0rd';
        admin_user_id           UUID;
    BEGIN
        SELECT id
        INTO admin_user_id
        FROM auth.users
        WHERE LOWER(email) = LOWER(admin_email)
        LIMIT 1;

        IF admin_user_id IS NULL THEN
            admin_user_id := gen_random_uuid();
            INSERT INTO auth.users (instance_id,
                                    id,
                                    aud,
                                    role,
                                    email,
                                    encrypted_password,
                                    email_confirmed_at,
                                    raw_app_meta_data,
                                    raw_user_meta_data,
                                    created_at,
                                    updated_at,
                                    confirmation_token,
                                    email_change,
                                    email_change_token_new,
                                    recovery_token)
            VALUES ('00000000-0000-0000-0000-000000000000',
                    admin_user_id,
                    'authenticated',
                    'authenticated',
                    admin_email,
                    crypt(admin_password, gen_salt('bf')),
                    NOW(),
                    jsonb_build_object(
                            'provider', 'email',
                            'providers', jsonb_build_array('email')
                    ),
                    jsonb_build_object(
                            'assign_customer_role', false,
                            'first_name', 'Khaldoun',
                            'last_name', 'Alhalabi',
                            'organization', 'L-One',
                            'language', 'de',
                            'registration_source', 'seed_admin'
                    ),
                    NOW(),
                    NOW(),
                    '',
                    '',
                    '',
                    '');

            INSERT INTO auth.identities (id,
                                         user_id,
                                         identity_data,
                                         provider,
                                         provider_id,
                                         last_sign_in_at,
                                         created_at,
                                         updated_at)
            VALUES (admin_user_id,
                    admin_user_id,
                    jsonb_build_object(
                            'sub', admin_user_id::TEXT,
                            'email', admin_email,
                            'email_verified', true
                    ),
                    'email',
                    admin_user_id::TEXT,
                    NOW(),
                    NOW(),
                    NOW());
        END IF;
    END
$$;


insert into public.projects (id,
                             slug,
                             title,
                             description,
                             long_description,
                             image_path,
                             tags,
                             category,
                             role,
                             year,
                             problem,
                             solution,
                             features,
                             tech_stack,
                             featured,
                             display_order)
values ('9e41f790-9791-49ee-a79f-6d6cc6c3f44d',
        'cohort-hcm',
        'Cohort HCM',
        'A modern, cloud-based Human Capital Management solution engineered for the next generation of digital-first enterprises.',
        'A modern, cloud-based Human Capital Management solution engineered for the next generation of digital-first enterprises.',
        null,
        '{"Laravel","React","Next.js","PostgreSQL"}',
        'PHP/Laravel',
        'Lead Fullstack Architect',
        '2024',
        'Legacy HCM systems are often characterized by fragmented architectures, sluggish interfaces, and a lack of real-time data synchronization. Enterprises struggle with siloed employee data, manual payroll overhead, and rigid scaling capabilities.',
        'Cohort HCM leverages a unified data layer to eliminate silos. Built with high-frequency performance in mind, it provides an intuitive, consumer-grade experience for employees while offering robust, automated tools for HR teams.',
        '{"Automated onboarding workflows, intelligent leave management, and real-time payroll reconciliation reduce manual intervention by up to 60%.","Built using a micro-services ready approach, ensuring the platform scales effortlessly from startups to global enterprises without performance degradation.","Multi-layer encryption, SOC2 compliance standards, and granular RBAC to keep sensitive human capital data protected."}',
        '[
          {
            "name": "Laravel",
            "icon": "terminal",
            "detail": "Core Logic & API"
          },
          {
            "name": "React",
            "icon": "layers",
            "detail": "Dynamic UI"
          },
          {
            "name": "Next.js",
            "icon": "sparkles",
            "detail": "SSR & Performance"
          },
          {
            "name": "PostgreSQL",
            "icon": "database",
            "detail": "Data Persistence"
          }
        ]'::jsonb,
        true,
        1),
       ('3ab9061e-0e2e-4ef6-bb34-3f4bce90f6a7',
        'smart-inventory',
        'SmartInventory Pro',
        'Enterprise-grade inventory tracking with automated restocking alerts and real-time analytics.',
        null,
        null,
        '{"Laravel","MySQL"}',
        'PHP/Laravel',
        null,
        null,
        null,
        null,
        '{}',
        '[]'::jsonb,
        false,
        2),
       ('b631ceca-2e39-4de2-82ad-516393365bbe',
        'edusphere',
        'EduSphere LMS',
        'Scalable e-learning solution managing courses, student progress, and interactive certifications.',
        null,
        null,
        '{"PHP","JavaScript"}',
        'PHP/Laravel',
        null,
        null,
        null,
        null,
        '{}',
        '[]'::jsonb,
        false,
        3),
       ('d62e16d8-35f3-4546-8448-feca1b7b5fa6',
        'neural-nexus',
        'NeuralNexus',
        'An AI-driven personal assistant for developers that automates documentation and test generation.',
        null,
        null,
        '{"Python","NLP"}',
        'AI/ML',
        null,
        null,
        null,
        null,
        '{}',
        '[]'::jsonb,
        false,
        4),
       ('3ad8e2de-4d7d-41df-89ec-bf72aad5fb69',
        'vault-x',
        'Vault-X',
        'A secure digital wallet featuring instant currency conversion and multi-layer encryption.',
        null,
        null,
        '{"Next.js","Prisma"}',
        'React/Next.js',
        null,
        null,
        null,
        null,
        '{}',
        '[]'::jsonb,
        false,
        5)
on conflict (id) do update
    set slug             = excluded.slug,
        title            = excluded.title,
        description      = excluded.description,
        long_description = excluded.long_description,
        image_path       = excluded.image_path,
        tags             = excluded.tags,
        category         = excluded.category,
        role             = excluded.role,
        year             = excluded.year,
        problem          = excluded.problem,
        solution         = excluded.solution,
        features         = excluded.features,
        tech_stack       = excluded.tech_stack,
        featured         = excluded.featured,
        display_order    = excluded.display_order;

insert into public.skill_groups (id, title, icon, skills, description, is_highlight, display_order)
values ('languages',
        'Languages',
        'terminal',
        '{"C","JavaScript","PHP","SQL","TypeScript"}',
        'Production languages I rely on for application and systems work.',
        false,
        1),
       ('frameworks',
        'Frameworks',
        'layers',
        '{"Laravel","Next.js","React.js","NestJS","TailwindCSS"}',
        'Frameworks I use to ship fast without compromising system design.',
        true,
        2),
       ('tools',
        'Tools',
        'wrench',
        '{"Git","GitLab","Supabase","TYPO3","Docker"}',
        'Infrastructure and delivery tooling around day-to-day engineering work.',
        false,
        3),
       ('research',
        'Research',
        'flask-conical',
        '{"RAG Architectures","Vector DBs","LLM Ops"}',
        'Applied AI and retrieval work used in modern developer tooling.',
        false,
        4)
on conflict (id) do update
    set title         = excluded.title,
        icon          = excluded.icon,
        skills        = excluded.skills,
        description   = excluded.description,
        is_highlight  = excluded.is_highlight,
        display_order = excluded.display_order;

insert into public.contact_info (id,
                                 email,
                                 phone,
                                 location,
                                 intro,
                                 availability,
                                 resume_label,
                                 resume_url)
values ('primary',
        'khaldounalhalabi42@gmail.com',
        '+963 936 955 531',
        'Damascus, Syria',
        'Whether you have a technical challenge, a project proposal, or just want to discuss the future of full-stack architecture, my digital door is open.',
        'Available for new opportunities',
        'Resume',
        '')
on conflict (id) do update
    set email        = excluded.email,
        phone        = excluded.phone,
        location     = excluded.location,
        intro        = excluded.intro,
        availability = excluded.availability,
        resume_label = excluded.resume_label,
        resume_url   = excluded.resume_url;

insert into public.contact_links (id, label, url, icon, display_order)
values ('linkedin', 'LinkedIn', '#', 'linkedin', 1),
       ('github', 'GitHub', '#', 'github', 2),
       ('twitter', 'Twitter', '#', 'twitter', 3)
on conflict (id) do update
    set label         = excluded.label,
        url           = excluded.url,
        icon          = excluded.icon,
        display_order = excluded.display_order;


