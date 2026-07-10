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


