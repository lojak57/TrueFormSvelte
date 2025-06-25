-- =====================================================================================
-- Phase 2: iMessage-Style Communication Hub & Client Portal Database Schema
-- =====================================================================================
-- This schema implements:
-- 1. Real-time messaging system (iMessage-style)
-- 2. Expanded authentication & client portal access
-- 3. Advanced document management (shared/private libraries)
-- 4. Notification & activity system
-- =====================================================================================

-- =====================================================================================
-- 1. ENHANCED AUTHENTICATION & USER MANAGEMENT
-- =====================================================================================

-- Extended user profiles for both clients and team members
CREATE TABLE IF NOT EXISTS tf_user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    notification_preferences JSONB DEFAULT '{}',
    is_client BOOLEAN DEFAULT FALSE,
    is_team_member BOOLEAN DEFAULT FALSE,
    company_id UUID REFERENCES tf_companies(id), -- For client users
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Client portal access management (multi-tenant)
CREATE TABLE IF NOT EXISTS tf_client_portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    access_level TEXT NOT NULL CHECK (access_level IN ('view', 'comment', 'edit', 'admin')) DEFAULT 'view',
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, company_id)
);

-- Team member company assignments (who manages which clients)
CREATE TABLE IF NOT EXISTS tf_team_company_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('account_manager', 'developer', 'designer', 'admin')) DEFAULT 'account_manager',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_member_id, company_id)
);

-- =====================================================================================
-- 2. REAL-TIME MESSAGING SYSTEM (iMessage-Style)
-- =====================================================================================

-- Message threads (organize conversations by company/project)
CREATE TABLE IF NOT EXISTS tf_message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES tf_company_projects(id) ON DELETE SET NULL,
    thread_type TEXT NOT NULL CHECK (thread_type IN ('general', 'project', 'support', 'billing')) DEFAULT 'general',
    title TEXT NOT NULL,
    description TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (iMessage style with rich media support)
CREATE TABLE IF NOT EXISTS tf_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES tf_message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'document', 'proposal', 'system')) DEFAULT 'text',
    content TEXT, -- Text content or system message
    metadata JSONB DEFAULT '{}', -- File info, proposal links, etc.
    reply_to UUID REFERENCES tf_messages(id), -- For threaded replies
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message attachments (images, documents, proposals)
CREATE TABLE IF NOT EXISTS tf_message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES tf_messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    thumbnail_path TEXT, -- For images/videos
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message read status (read receipts like iMessage)
CREATE TABLE IF NOT EXISTS tf_message_read_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES tf_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Message reactions (👍❤️😂😮😢👎 like iMessage)
CREATE TABLE IF NOT EXISTS tf_message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES tf_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('👍', '❤️', '😂', '😮', '😢', '👎')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction_type)
);

-- Typing indicators (real-time typing status)
CREATE TABLE IF NOT EXISTS tf_typing_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES tf_message_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_typing_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(thread_id, user_id)
);

-- =====================================================================================
-- 3. ADVANCED DOCUMENT MANAGEMENT (Shared + Private Libraries)
-- =====================================================================================

-- Document libraries (shared, client-private, team-private)
CREATE TABLE IF NOT EXISTS tf_document_libraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    library_type TEXT NOT NULL CHECK (library_type IN ('shared', 'client_private', 'team_private')),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents with version control and approval workflows
CREATE TABLE IF NOT EXISTS tf_documents_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    library_id UUID NOT NULL REFERENCES tf_document_libraries(id) ON DELETE CASCADE,
    parent_document_id UUID REFERENCES tf_documents_v2(id), -- For versions
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    version_number INTEGER DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    document_status TEXT CHECK (document_status IN ('draft', 'review', 'approved', 'archived')) DEFAULT 'draft',
    tags TEXT[], -- For organization and search
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ, -- For temporary documents
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document access permissions (granular permissions)
CREATE TABLE IF NOT EXISTS tf_document_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES tf_documents_v2(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('account_manager', 'developer', 'designer', 'admin')), -- Role-based access (not FK)
    permission_type TEXT NOT NULL CHECK (permission_type IN ('view', 'download', 'comment', 'edit', 'delete')),
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Document activity log (audit trail)
CREATE TABLE IF NOT EXISTS tf_document_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES tf_documents_v2(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    activity_type TEXT NOT NULL CHECK (activity_type IN ('uploaded', 'downloaded', 'viewed', 'edited', 'commented', 'approved', 'shared')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document comments/annotations (collaborative feedback)
CREATE TABLE IF NOT EXISTS tf_document_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES tf_documents_v2(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    comment_text TEXT NOT NULL,
    page_number INTEGER, -- For PDF annotations
    position_x DECIMAL, -- For precise positioning
    position_y DECIMAL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================================
-- 4. NOTIFICATION & ACTIVITY SYSTEM
-- =====================================================================================

-- Real-time notifications
CREATE TABLE IF NOT EXISTS tf_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('message', 'document_shared', 'document_commented', 'proposal_status', 'task_assigned')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_entity_type TEXT, -- 'message', 'document', 'proposal', etc.
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity feed (timeline of company interactions)
CREATE TABLE IF NOT EXISTS tf_activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES auth.users(id),
    activity_type TEXT NOT NULL,
    activity_data JSONB NOT NULL,
    is_visible_to_client BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================================
-- 5. INDEXES FOR PERFORMANCE (Critical for Real-Time Features)
-- =====================================================================================

-- User profile indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON tf_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON tf_user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_client ON tf_user_profiles(is_client);

-- Client portal access indexes
CREATE INDEX IF NOT EXISTS idx_client_portal_access_user ON tf_client_portal_access(user_id);
CREATE INDEX IF NOT EXISTS idx_client_portal_access_company ON tf_client_portal_access(company_id);
CREATE INDEX IF NOT EXISTS idx_client_portal_access_active ON tf_client_portal_access(is_active);

-- Team company access indexes
CREATE INDEX IF NOT EXISTS idx_team_company_access_member ON tf_team_company_access(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_company_access_company ON tf_team_company_access(company_id);

-- Message thread indexes
CREATE INDEX IF NOT EXISTS idx_message_threads_company ON tf_message_threads(company_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_project ON tf_message_threads(project_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_updated ON tf_message_threads(updated_at DESC);

-- Message indexes (critical for real-time performance)
CREATE INDEX IF NOT EXISTS idx_messages_thread ON tf_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON tf_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON tf_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON tf_messages(reply_to);

-- Message attachment indexes
CREATE INDEX IF NOT EXISTS idx_message_attachments_message ON tf_message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_uploaded_by ON tf_message_attachments(uploaded_by);

-- Message read status indexes
CREATE INDEX IF NOT EXISTS idx_message_read_status_message ON tf_message_read_status(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_status_user ON tf_message_read_status(user_id);

-- Message reaction indexes
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON tf_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user ON tf_message_reactions(user_id);

-- Document library indexes
CREATE INDEX IF NOT EXISTS idx_document_libraries_company ON tf_document_libraries(company_id);
CREATE INDEX IF NOT EXISTS idx_document_libraries_type ON tf_document_libraries(library_type);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_v2_library ON tf_documents_v2(library_id);
CREATE INDEX IF NOT EXISTS idx_documents_v2_parent ON tf_documents_v2(parent_document_id);
CREATE INDEX IF NOT EXISTS idx_documents_v2_status ON tf_documents_v2(document_status);
CREATE INDEX IF NOT EXISTS idx_documents_v2_current_version ON tf_documents_v2(is_current_version);
CREATE INDEX IF NOT EXISTS idx_documents_v2_uploaded_by ON tf_documents_v2(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_v2_tags ON tf_documents_v2 USING GIN(tags);

-- Document permission indexes
CREATE INDEX IF NOT EXISTS idx_document_permissions_document ON tf_document_permissions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_permissions_user ON tf_document_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_document_permissions_role ON tf_document_permissions(role);

-- Document activity indexes
CREATE INDEX IF NOT EXISTS idx_document_activity_document ON tf_document_activity(document_id);
CREATE INDEX IF NOT EXISTS idx_document_activity_user ON tf_document_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_document_activity_created ON tf_document_activity(created_at DESC);

-- Document comment indexes
CREATE INDEX IF NOT EXISTS idx_document_comments_document ON tf_document_comments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_user ON tf_document_comments(user_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON tf_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON tf_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON tf_notifications(created_at DESC);

-- Activity feed indexes
CREATE INDEX IF NOT EXISTS idx_activity_feed_company ON tf_activity_feed(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_actor ON tf_activity_feed(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON tf_activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_visible ON tf_activity_feed(is_visible_to_client);

-- =====================================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================================

-- Enable RLS on all tables
ALTER TABLE tf_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_client_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_team_company_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_message_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_document_libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_documents_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_document_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_document_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_activity_feed ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
    -- User profiles policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'tf_user_profiles') THEN
        DROP POLICY "Users can view their own profile" ON tf_user_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view client profiles' AND tablename = 'tf_user_profiles') THEN
        DROP POLICY "Team members can view client profiles" ON tf_user_profiles;
    END IF;
    
    -- Messages policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view accessible messages' AND tablename = 'tf_messages') THEN
        DROP POLICY "Users can view accessible messages" ON tf_messages;
    END IF;
    
    -- Documents policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view accessible documents' AND tablename = 'tf_documents_v2') THEN
        DROP POLICY "Users can view accessible documents" ON tf_documents_v2;
    END IF;
    
    -- Notifications policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own notifications' AND tablename = 'tf_notifications') THEN
        DROP POLICY "Users can view their own notifications" ON tf_notifications;
    END IF;
END $$;

-- User profiles: Users can view their own profile and team members can see client profiles
CREATE POLICY "Users can view their own profile" ON tf_user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Team members can view client profiles" ON tf_user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tf_team_company_access tca
            WHERE tca.team_member_id = auth.uid()
            AND tca.company_id = tf_user_profiles.company_id
        )
    );

-- Messages: Users can access messages for companies they have access to
CREATE POLICY "Users can view accessible messages" ON tf_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tf_message_threads mt
            JOIN tf_client_portal_access cpa ON mt.company_id = cpa.company_id
            WHERE mt.id = tf_messages.thread_id
            AND cpa.user_id = auth.uid()
            AND cpa.is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM tf_message_threads mt
            JOIN tf_team_company_access tca ON mt.company_id = tca.company_id
            WHERE mt.id = tf_messages.thread_id
            AND tca.team_member_id = auth.uid()
        )
    );

-- Documents: Complex permissions based on library type and user access
CREATE POLICY "Users can view accessible documents" ON tf_documents_v2
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tf_document_libraries dl
            WHERE dl.id = tf_documents_v2.library_id
            AND (
                -- Shared documents for company access
                (dl.library_type = 'shared' AND (
                    EXISTS (
                        SELECT 1 FROM tf_client_portal_access cpa
                        WHERE cpa.company_id = dl.company_id
                        AND cpa.user_id = auth.uid()
                        AND cpa.is_active = true
                    )
                    OR
                    EXISTS (
                        SELECT 1 FROM tf_team_company_access tca
                        WHERE tca.company_id = dl.company_id
                        AND tca.team_member_id = auth.uid()
                    )
                ))
                OR
                -- Client private documents
                (dl.library_type = 'client_private' AND EXISTS (
                    SELECT 1 FROM tf_client_portal_access cpa
                    WHERE cpa.company_id = dl.company_id
                    AND cpa.user_id = auth.uid()
                    AND cpa.is_active = true
                ))
                OR
                -- Team private documents
                (dl.library_type = 'team_private' AND EXISTS (
                    SELECT 1 FROM tf_team_company_access tca
                    WHERE tca.company_id = dl.company_id
                    AND tca.team_member_id = auth.uid()
                ))
            )
        )
    );

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON tf_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- 7. DATABASE FUNCTIONS FOR REAL-TIME FEATURES
-- =====================================================================================

-- Drop existing functions to recreate them
DROP FUNCTION IF EXISTS get_unread_message_count(UUID);
DROP FUNCTION IF EXISTS mark_message_as_read(UUID, UUID);
DROP FUNCTION IF EXISTS cleanup_typing_indicators();
DROP FUNCTION IF EXISTS get_thread_participants(UUID);

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM tf_messages m
        JOIN tf_message_threads mt ON m.thread_id = mt.id
        WHERE NOT EXISTS (
            SELECT 1 FROM tf_message_read_status mrs
            WHERE mrs.message_id = m.id
            AND mrs.user_id = user_uuid
        )
        AND m.sender_id != user_uuid
        AND (
            EXISTS (
                SELECT 1 FROM tf_client_portal_access cpa
                WHERE cpa.company_id = mt.company_id
                AND cpa.user_id = user_uuid
                AND cpa.is_active = true
            )
            OR
            EXISTS (
                SELECT 1 FROM tf_team_company_access tca
                WHERE tca.company_id = mt.company_id
                AND tca.team_member_id = user_uuid
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_as_read(message_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO tf_message_read_status (message_id, user_id, read_at)
    VALUES (message_uuid, user_uuid, NOW())
    ON CONFLICT (message_id, user_id) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old typing indicators (automatic cleanup)
CREATE OR REPLACE FUNCTION cleanup_typing_indicators()
RETURNS VOID AS $$
BEGIN
    DELETE FROM tf_typing_indicators
    WHERE started_typing_at < NOW() - INTERVAL '30 seconds';
END;
$$ LANGUAGE plpgsql;

-- Function to get thread participants
CREATE OR REPLACE FUNCTION get_thread_participants(thread_uuid UUID)
RETURNS TABLE(user_id UUID, first_name TEXT, last_name TEXT, avatar_url TEXT, is_client BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT 
        up.user_id,
        up.first_name,
        up.last_name,
        up.avatar_url,
        up.is_client
    FROM tf_user_profiles up
    WHERE up.user_id IN (
        -- Message senders
        SELECT DISTINCT m.sender_id
        FROM tf_messages m
        WHERE m.thread_id = thread_uuid
        
        UNION
        
        -- Users with company access
        SELECT cpa.user_id
        FROM tf_client_portal_access cpa
        JOIN tf_message_threads mt ON mt.company_id = cpa.company_id
        WHERE mt.id = thread_uuid
        AND cpa.is_active = true
        
        UNION
        
        -- Team members with company access
        SELECT tca.team_member_id
        FROM tf_team_company_access tca
        JOIN tf_message_threads mt ON mt.company_id = tca.company_id
        WHERE mt.id = thread_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================================
-- 8. REALTIME SUBSCRIPTIONS (Supabase Realtime Setup)
-- =====================================================================================

-- Enable realtime for critical tables (only if not already enabled)
DO $$
BEGIN
    -- Check if tables are already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'tf_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE tf_messages;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'tf_message_read_status'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE tf_message_read_status;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'tf_message_reactions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE tf_message_reactions;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'tf_typing_indicators'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE tf_typing_indicators;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'tf_notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE tf_notifications;
    END IF;
END $$;

-- =====================================================================================
-- PHASE 2 COMMUNICATION SCHEMA COMPLETE
-- =====================================================================================
-- This schema provides:
-- ✅ iMessage-style real-time messaging
-- ✅ Multi-tenant client portal authentication  
-- ✅ Advanced document management with permissions
-- ✅ Comprehensive notification system
-- ✅ Performance-optimized with proper indexes
-- ✅ Security-first with RLS policies
-- ✅ Real-time capabilities with Supabase
-- =====================================================================================