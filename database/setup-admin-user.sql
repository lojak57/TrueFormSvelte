-- =====================================================================================
-- Setup Admin User for mitch.mechelay573@gmail.com
-- =====================================================================================
-- This script will:
-- 1. Update user metadata to include admin role
-- 2. Create user profile in tf_user_profiles
-- 3. Set up team access for any existing companies
-- =====================================================================================

-- Step 1: Update user metadata to include admin role
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'mitch.mechelay573@gmail.com';

-- Step 2: Create user profile (if it doesn't exist)
INSERT INTO tf_user_profiles (
    user_id,
    first_name,
    last_name,
    avatar_url,
    phone,
    timezone,
    notification_preferences,
    is_client,
    is_team_member,
    created_at,
    updated_at
) 
SELECT 
    id as user_id,
    'Mitch' as first_name,
    'Mechelay' as last_name,
    NULL as avatar_url,
    NULL as phone,
    'America/New_York' as timezone,
    '{"email_notifications": true, "push_notifications": true, "message_notifications": true}'::jsonb as notification_preferences,
    false as is_client,
    true as is_team_member,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users 
WHERE email = 'mitch.mechelay573@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    is_team_member = true,
    updated_at = NOW();

-- Step 3: Grant admin access to all existing companies (as team member)
INSERT INTO tf_team_company_access (
    team_member_id,
    company_id,
    role,
    is_primary,
    created_at
)
SELECT 
    u.id as team_member_id,
    c.id as company_id,
    'admin' as role,
    true as is_primary,
    NOW() as created_at
FROM auth.users u
CROSS JOIN tf_companies c
WHERE u.email = 'mitch.mechelay573@gmail.com'
ON CONFLICT (team_member_id, company_id) DO UPDATE SET
    role = 'admin',
    is_primary = true;

-- Step 4: Verify the setup
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'role' as role,
    up.first_name,
    up.last_name,
    up.is_team_member,
    COUNT(tca.company_id) as companies_with_access
FROM auth.users u
LEFT JOIN tf_user_profiles up ON u.id = up.user_id
LEFT JOIN tf_team_company_access tca ON u.id = tca.team_member_id
WHERE u.email = 'mitch.mechelay573@gmail.com'
GROUP BY u.id, u.email, u.raw_user_meta_data, up.first_name, up.last_name, up.is_team_member;

-- You should see:
-- - role: "admin"
-- - is_team_member: true
-- - companies_with_access: [number of companies you have access to]