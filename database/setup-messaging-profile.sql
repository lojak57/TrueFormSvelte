-- =====================================================================================
-- Setup User Profile for Messaging
-- =====================================================================================
-- Run this after the Phase 2 schema to set up your admin user profile for messaging
-- =====================================================================================

-- Get the user ID for mitch.mechelay573@gmail.com
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Find the user
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'mitch.mechelay573@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found. Please ensure the user exists.';
    END IF;

    -- Create or update user profile
    INSERT INTO tf_user_profiles (
        user_id,
        first_name,
        last_name,
        is_team_member,
        is_client,
        timezone,
        notification_preferences
    ) VALUES (
        v_user_id,
        'Mitch',
        'Mechelay',
        true,  -- Team member
        false, -- Not a client
        'America/Los_Angeles',
        jsonb_build_object(
            'email_on_message', true,
            'push_notifications', true,
            'sound_enabled', true
        )
    )
    ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        is_team_member = EXCLUDED.is_team_member,
        updated_at = NOW();

    -- Grant team access to all existing companies
    INSERT INTO tf_team_company_access (team_member_id, company_id, role, is_primary)
    SELECT 
        v_user_id,
        c.id,
        'admin',
        true
    FROM tf_companies c
    ON CONFLICT (team_member_id, company_id) DO NOTHING;

    RAISE NOTICE 'User profile setup complete for %', v_user_id;
END $$;

-- Create sample message threads for testing
DO $$
DECLARE
    v_user_id UUID;
    v_company_id UUID;
    v_thread_id UUID;
BEGIN
    -- Get user and first company
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'mitch.mechelay573@gmail.com';
    SELECT id INTO v_company_id FROM tf_companies LIMIT 1;

    IF v_company_id IS NOT NULL THEN
        -- Create a general discussion thread
        INSERT INTO tf_message_threads (
            company_id,
            thread_type,
            title,
            description,
            created_by
        ) VALUES (
            v_company_id,
            'general',
            'General Discussion',
            'Main communication thread',
            v_user_id
        ) RETURNING id INTO v_thread_id;

        -- Add a welcome message
        INSERT INTO tf_messages (
            thread_id,
            sender_id,
            message_type,
            content
        ) VALUES (
            v_thread_id,
            v_user_id,
            'text',
            'Welcome to the new messaging system! 🎉 This is a frictionless way to communicate with your clients.'
        );

        RAISE NOTICE 'Sample thread created for testing';
    END IF;
END $$;

-- =====================================================================================
-- SETUP COMPLETE
-- =====================================================================================
-- You now have:
-- ✅ User profile for messaging
-- ✅ Team access to all companies  
-- ✅ Sample message thread for testing
-- =====================================================================================