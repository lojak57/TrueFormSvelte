-- =====================================================================================
-- Activity Tracking Table
-- =====================================================================================
-- This table tracks user activities for audit trails and dashboard display
-- =====================================================================================

-- Create activities table
CREATE TABLE IF NOT EXISTS tf_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'login', 'logout', 'create', 'update', 'delete', 
        'view', 'download', 'send_message', 'create_proposal'
    )),
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'company', 'contact', 'proposal', 'project', 
        'document', 'message', 'auth'
    )),
    entity_id UUID,
    entity_name TEXT,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_tf_activities_user_id ON tf_activities(user_id);
CREATE INDEX idx_tf_activities_entity ON tf_activities(entity_type, entity_id);
CREATE INDEX idx_tf_activities_created_at ON tf_activities(created_at DESC);

-- Enable RLS
ALTER TABLE tf_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see activities in companies they have access to
CREATE POLICY "Users can view activities" ON tf_activities
    FOR SELECT USING (
        -- User can see their own activities
        auth.uid() = user_id
        OR
        -- User is admin
        EXISTS (
            SELECT 1 FROM tf_user_profiles
            WHERE user_id = auth.uid()
            AND is_team_member = true
        )
    );

-- Only authenticated users can create activities
CREATE POLICY "Users can create activities" ON tf_activities
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

-- Grant permissions
GRANT SELECT, INSERT ON tf_activities TO authenticated;
GRANT USAGE ON SEQUENCE tf_activities_id_seq TO authenticated;

-- Create a function to automatically log authentication activities
CREATE OR REPLACE FUNCTION log_auth_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Log login activity
    IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
        INSERT INTO tf_activities (
            user_id,
            activity_type,
            entity_type,
            description
        ) VALUES (
            NEW.id,
            'login',
            'auth',
            'User logged in'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auth activity logging
CREATE TRIGGER on_auth_activity
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION log_auth_activity();

-- Sample data for testing (optional - remove in production)
-- INSERT INTO tf_activities (user_id, activity_type, entity_type, entity_name, description) VALUES
-- (auth.uid(), 'create', 'company', 'Acme Corp', 'Created company: Acme Corp'),
-- (auth.uid(), 'update', 'contact', 'John Doe', 'Updated contact: John Doe'),
-- (auth.uid(), 'create_proposal', 'proposal', 'Website Redesign', 'Created proposal "Website Redesign" for Acme Corp');