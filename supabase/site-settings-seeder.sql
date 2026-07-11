INSERT INTO "public"."site_settings" ("id", "key", "value", "structure")
VALUES ('e6c1be5e-1ffc-4736-8929-6076753743fc', 'education',
        to_jsonb(cast('<div class="tiptap-content-viewer"><style>.tiptap-content-viewer {
          \nblockquote {
          \n        border-left: 3px solid var(--primary);\n        margin: 1.5rem 0;\n        padding-left: 1rem;\n}\n\n\n    /* Code and preformatted text styles */\n\n    code {\n        background-color: var(--secondary);\n        border-radius: 0.4rem;\n        color: var(--primary);\n        font-size: 0.85rem;\n        padding: 0.25em 0.3em;\n}\n\n    /* Link styles */\n\n    a {\n        color: var(--color-blue-300);\n        cursor: pointer;\n        text-underline: var(--color-blue-300);\n        text-underline-mode: auto;\n\n        &:hover {\n            color: var(--color-blue-500);\n}\n}\n\n    /* Image styles */\n\n    img {\n        display: block;\n        height: auto;\n        margin: 1.5rem 0;\n        max-width: 100%;\n\n        &.ProseMirror-selectednode {\n            outline: 3px solid var(--primary);\n}\n}\n\n    /* List styles */\n\n    ul,\n    ol {\n        padding: 0 1rem;\n        margin: 1.25rem 1rem 1.25rem 0.4rem;\n\n        li p {\n            margin-top: 0.25em;\n            margin-bottom: 0.25em;\n}\n}\n\n    ul {\n        list-style-type: circle;\n}\n\n    ol {\n        list-style-type: decimal;\n}\n\n\n    /* Heading styles */\n\n    h1, \n    h2, \n    h3,\n    h4, \n    h5, \n    h6 {\n        line-height: 1.1;\n        margin-top: 2.5rem;\n        text-wrap: pretty;\n}\n\n    h1, \n    h2 {\n        margin-top: 3.5rem;\n        margin-bottom: 1.5rem;\n}\n\n    h1 {\n        font-size: 1.4rem;\n}\n\n    h2 {\n        font-size: 1.2rem;\n}\n\n    h3 {\n        font-size: 1.1rem;\n}\n\n    h4, \n    h5,\n    h6 {\n        font-size: 1rem;\n}\n\n    /** Horizontal rule */\n\n    hr {\n        border: none;\n        border-top: 1px solid var(--secondary);\n        cursor: pointer;\n        margin: 2rem 0;\n\n        &.ProseMirror-selectednode {\n            border-top: 1px solid var(--primary);\n}\n}\n\n    /* Table-specific styling */\n\n    table {
        \n        border-collapse: collapse;\n        margin: 0;\n        overflow: hidden;\n        table-layout: fixed;\n        width: 100%;\n\n        td, \n        th {\n            border: 1px solid var(--foreground);\n            box-sizing: border-box;\n            min-width: 1em;\n            padding: 6px 8px;\n            position: relative;\n            vertical-align: top;\n\n            > * {\n                margin-bottom: 0;\n}\n}\n\n        th {\n            background-color: var(--secondary);\n            font-weight: bold;\n            text-align: left;\n}\n\n        .selectedCell: after {\n            background: var(--secondary);\n            content: "";\n            left: 0;\n            right: 0;\n            top: 0;\n            bottom: 0;\n            pointer-events: none;\n            position: absolute;\n            z-index: 2;\n}\n\n        .column-resize-handle {\n            background-color: var(--secondary);\n            bottom: -2px;\n            pointer-events: none;\n            position: absolute;\n            right: -2px;\n            top: 0;\n            width: 4px;\n}\n
        }\n\n    .tableWrapper {\n        margin: 1.5rem 0;\n        overflow-x: auto;\n}\n\n    &.resize-cursor {\n        cursor: ew-resize;\n        cursor: col-resize;\n}\n\n    /* Youtube embed */\n    div[data-youtube-video] {\n        cursor: move;\n        padding-right: 1.5rem;\n\n        iframe {\n            border: 0.5rem solid var(--secondary);\n            display: block;\n            min-height: 200px;\n            min-width: 200px;\n            outline: 0px solid transparent;\n}\n\n        &.ProseMirror-selectednode iframe {\n            outline: 3px solid var(--secondary);\n            transition: outline 0.15s;\n}\n}\n}</style><p>Bachelor, Information Technology</p><p>Software Engineering Department</p><p>Damascus University</p><p>01/2018 - 07/2025</p></div>' as text)),
        '{
          "type": "paragraph"
        }'),
       ('5b781c63-82b6-41ea-a71d-d1246f2b4ade', 'email', to_jsonb(cast('khaldounalhalabi42@gmail.com' as text)), '{
         "type": "string"
       }'),
       ('ee6430d7-faa7-40c2-b836-2fb06a983a57', 'github', to_jsonb(cast('https://github.com/khaldounalhalabi' as text)),
        '{
          "type": "string"
        }'),
       ('1051ab5f-ff9f-4a70-a60f-d06aadddd740', 'gitlab',
        to_jsonb(cast('https://gitlab.com/khaldounalhalabi963' as text)), '{
         "type": "string"
       }'),
       ('6d2321aa-b249-42ee-b848-ff3a87fd885f', 'hero_paragraph',
        to_jsonb(cast('Backend-first engineering with a strong frontend eye. I build scalable systems, sharp interfaces, and admin workflows that keep content maintainable after launch.' as text)),
        '{
          "type": "paragraph"
        }'),
       ('5f9cc4fe-eb5c-4cfa-a720-fb54b0bdee80', 'hero_sentence_under_name',
        to_jsonb(cast('Full-Stack Engineer' as text)), '{
         "type": "string"
       }'),
       ('3d4adc64-610f-4b3c-9be4-d4f129b289ac', 'hero_skills', '[
         "PHP & Laravel",
         "React & NEXT.JS",
         "Supabase",
         "Node.JS",
         "System Design"
       ]', '{
         "type": "array"
       }'),
       ('242b5d76-454c-4b66-a1a8-0371fab82ce0', 'languages', to_jsonb(cast('Arabic, English' as text)), '{
         "type": "string"
       }'),
       ('44989902-9c66-48d0-b09d-e396f165ea5b', 'linked_in',
        to_jsonb(cast('https://www.linkedin.com/in/khaldoun-alhalabi-38525432b' as text)),
        '{
          "type": "string"
        }'),
       ('45e4a198-bdd6-4c81-b758-155150fd68b2', 'location', to_jsonb(cast('Syria, Damascus' as text)), '{
         "type": "string"
       }'),
       ('9e300351-64a8-462e-b882-4da5bdf231cc', 'phone', to_jsonb(cast('+963956926129' as text)), '{
         "type": "string"
       }'),
       ('47edb4da-dcf7-4964-876d-2a9a2b744962', 'pre_filled_message',
        to_jsonb(cast($$markdown
            Hi Khaldoun! 👋 I' m interested in creating a new project and would like to discuss my
                      requirements with you.When are you available ? $$ as text)),
        '{
          "type": "string"
        }'),
       ('7192cd9e-b0eb-451a-8726-cabcca60b6c8', 'resume_title',
        to_jsonb(cast('Fullstack Developer | PHP & Laravel Developer | Node.Js & Nest.Js | Experienced in React, Next.js, and Modern Frontend Frameworks | Building Scalable Web Solutions' as text)),
        '{
          "type": "string"
        }'),
       ('9c7fdaca-15ba-4c22-af93-df763c46b2c9', 'stackoverflow',
        to_jsonb(cast('https://stackoverflow.com/users/16893481/khaldoun-al-halabi' as text)), '{
         "type": "string"
       }'),
       ('52f47bb8-5b78-4f47-8d95-c9da0d149146', 'telegram', to_jsonb(cast('https://t.me/khaldounalhalabi' as text)), '{
         "type": "string"
       }'),
       ('6f0337ac-1469-4c3d-92e3-7a7f33767574', 'whatsapp', to_jsonb(cast('https://wa.me/963956926129' as text)), '{
         "type": "string"
       }'),
       ('b7c0f2a1-3d4e-4a5b-9c6d-7e8f9a0b1c2d', 'resume_link', to_jsonb(cast('' as text)), '{
         "type": "string"
       }');