-- Phase 1 CRM Database Schema
-- Contact Relationships, Deal Pipeline, and Lead Scoring

-- ==========================================
-- 1. CONTACT RELATIONSHIPS SYSTEM
-- ==========================================

-- Contact relationship mapping
CREATE TABLE IF NOT EXISTS tf_contact_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    related_contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('reports_to', 'colleague', 'decision_maker', 'influencer', 'assistant')),
    influence_level INTEGER CHECK (influence_level BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_contact_relationship UNIQUE(primary_contact_id, related_contact_id),
    CONSTRAINT no_self_relationship CHECK (primary_contact_id != related_contact_id)
);

-- Contact interaction history
CREATE TABLE IF NOT EXISTS tf_contact_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'demo', 'proposal_sent', 'follow_up', 'linkedin')),
    subject TEXT NOT NULL,
    notes TEXT,
    outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'negative', 'follow_up_needed')),
    next_action TEXT,
    next_action_date DATE,
    duration_minutes INTEGER,
    interaction_data JSONB DEFAULT '{}', -- Store additional metadata
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. DEAL PIPELINE SYSTEM
-- ==========================================

-- Core deals table
CREATE TABLE IF NOT EXISTS tf_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    primary_contact_id UUID NOT NULL REFERENCES tf_contacts(id),
    name TEXT NOT NULL,
    description TEXT,
    value DECIMAL(12,2) NOT NULL DEFAULT 0,
    probability INTEGER CHECK (probability BETWEEN 0 AND 100) DEFAULT 50,
    stage TEXT NOT NULL CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')) DEFAULT 'lead',
    expected_close_date DATE,
    actual_close_date DATE,
    lost_reason TEXT,
    source TEXT CHECK (source IN ('website', 'referral', 'cold_outreach', 'marketing', 'existing_client', 'linkedin', 'conference')),
    deal_data JSONB DEFAULT '{}', -- Store additional deal metadata
    created_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_to UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal activities tracking
CREATE TABLE IF NOT EXISTS tf_deal_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES tf_deals(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'demo', 'proposal_sent', 'contract_sent', 'follow_up', 'stage_change')),
    subject TEXT NOT NULL,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    completed_date DATE,
    activity_data JSONB DEFAULT '{}', -- Store additional activity metadata
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. LEAD SCORING SYSTEM
-- ==========================================

-- Lead scoring table
CREATE TABLE IF NOT EXISTS tf_lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    company_size_score INTEGER DEFAULT 0,
    budget_score INTEGER DEFAULT 0,
    authority_score INTEGER DEFAULT 0,
    need_score INTEGER DEFAULT 0,
    timeline_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    total_score INTEGER GENERATED ALWAYS AS (
        company_size_score + budget_score + authority_score + 
        need_score + timeline_score + engagement_score
    ) STORED,
    qualification_status TEXT CHECK (qualification_status IN ('hot', 'warm', 'cold', 'unqualified')) DEFAULT 'cold',
    score_breakdown JSONB DEFAULT '{}', -- Store detailed scoring logic
    last_calculated TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    CONSTRAINT unique_contact_lead_score UNIQUE(contact_id)
);

-- ==========================================
-- 4. INDEXES FOR PERFORMANCE
-- ==========================================

-- Contact relationships indexes
CREATE INDEX IF NOT EXISTS idx_contact_relationships_primary ON tf_contact_relationships(primary_contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_relationships_related ON tf_contact_relationships(related_contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_relationships_type ON tf_contact_relationships(relationship_type);

-- Contact interactions indexes
CREATE INDEX IF NOT EXISTS idx_contact_interactions_contact ON tf_contact_interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_created_by ON tf_contact_interactions(created_by);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_date ON tf_contact_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_type ON tf_contact_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_outcome ON tf_contact_interactions(outcome);

-- Deals indexes
CREATE INDEX IF NOT EXISTS idx_deals_company ON tf_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_contact ON tf_deals(primary_contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned ON tf_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON tf_deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_close_date ON tf_deals(expected_close_date);
CREATE INDEX IF NOT EXISTS idx_deals_created_by ON tf_deals(created_by);
CREATE INDEX IF NOT EXISTS idx_deals_value ON tf_deals(value DESC);

-- Deal activities indexes
CREATE INDEX IF NOT EXISTS idx_deal_activities_deal ON tf_deal_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_activities_type ON tf_deal_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_deal_activities_created_by ON tf_deal_activities(created_by);
CREATE INDEX IF NOT EXISTS idx_deal_activities_due_date ON tf_deal_activities(due_date);

-- Lead scores indexes
CREATE INDEX IF NOT EXISTS idx_lead_scores_total ON tf_lead_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_lead_scores_status ON tf_lead_scores(qualification_status);
CREATE INDEX IF NOT EXISTS idx_lead_scores_company ON tf_lead_scores(company_id);

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE tf_contact_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_deal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tf_lead_scores ENABLE ROW LEVEL SECURITY;

-- Contact relationships policies
CREATE POLICY "Users can view contact relationships" ON tf_contact_relationships
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert contact relationships" ON tf_contact_relationships
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update contact relationships" ON tf_contact_relationships
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete contact relationships" ON tf_contact_relationships
    FOR DELETE USING (auth.role() = 'authenticated');

-- Contact interactions policies
CREATE POLICY "Users can view contact interactions" ON tf_contact_interactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert contact interactions" ON tf_contact_interactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update contact interactions" ON tf_contact_interactions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete contact interactions" ON tf_contact_interactions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Deals policies
CREATE POLICY "Users can view deals" ON tf_deals
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert deals" ON tf_deals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update deals" ON tf_deals
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete deals" ON tf_deals
    FOR DELETE USING (auth.role() = 'authenticated');

-- Deal activities policies
CREATE POLICY "Users can view deal activities" ON tf_deal_activities
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert deal activities" ON tf_deal_activities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update deal activities" ON tf_deal_activities
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete deal activities" ON tf_deal_activities
    FOR DELETE USING (auth.role() = 'authenticated');

-- Lead scores policies
CREATE POLICY "Users can view lead scores" ON tf_lead_scores
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert lead scores" ON tf_lead_scores
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update lead scores" ON tf_lead_scores
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete lead scores" ON tf_lead_scores
    FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- 6. HELPFUL DATABASE FUNCTIONS
-- ==========================================

-- Function to calculate pipeline metrics
CREATE OR REPLACE FUNCTION calculate_pipeline_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_pipeline_value', COALESCE(SUM(value), 0),
        'weighted_pipeline_value', COALESCE(SUM(value * probability / 100.0), 0),
        'deals_by_stage', (
            SELECT json_object_agg(stage, stage_data)
            FROM (
                SELECT 
                    stage,
                    json_build_object(
                        'count', COUNT(*),
                        'total_value', COALESCE(SUM(value), 0),
                        'avg_probability', COALESCE(AVG(probability), 0)
                    ) as stage_data
                FROM tf_deals 
                WHERE stage NOT IN ('closed_won', 'closed_lost')
                GROUP BY stage
            ) stage_summary
        ),
        'conversion_rates', (
            SELECT json_build_object(
                'lead_to_qualified', 
                CASE 
                    WHEN COUNT(*) FILTER (WHERE stage = 'lead') > 0 
                    THEN (COUNT(*) FILTER (WHERE stage IN ('qualified', 'proposal', 'negotiation', 'closed_won'))::float / COUNT(*) FILTER (WHERE stage = 'lead')) * 100
                    ELSE 0 
                END,
                'qualified_to_won',
                CASE 
                    WHEN COUNT(*) FILTER (WHERE stage = 'qualified') > 0 
                    THEN (COUNT(*) FILTER (WHERE stage = 'closed_won')::float / COUNT(*) FILTER (WHERE stage = 'qualified')) * 100
                    ELSE 0 
                END
            )
            FROM tf_deals
        )
    ) INTO result
    FROM tf_deals 
    WHERE stage NOT IN ('closed_won', 'closed_lost');
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get contact interaction summary
CREATE OR REPLACE FUNCTION get_contact_interaction_summary(contact_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_interactions', COUNT(*),
        'last_interaction', MAX(created_at),
        'interaction_types', json_object_agg(interaction_type, type_count),
        'outcomes', json_object_agg(outcome, outcome_count),
        'follow_ups_needed', COUNT(*) FILTER (WHERE outcome = 'follow_up_needed' AND next_action_date >= CURRENT_DATE)
    ) INTO result
    FROM (
        SELECT 
            interaction_type,
            outcome,
            created_at,
            next_action_date,
            COUNT(*) OVER (PARTITION BY interaction_type) as type_count,
            COUNT(*) OVER (PARTITION BY outcome) as outcome_count
        FROM tf_contact_interactions 
        WHERE contact_id = contact_uuid
    ) interaction_data;
    
    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update lead score
CREATE OR REPLACE FUNCTION update_lead_score_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_calculated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lead score timestamp
CREATE TRIGGER trigger_update_lead_score_timestamp
    BEFORE UPDATE ON tf_lead_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_score_timestamp();

-- ==========================================
-- 7. SAMPLE DATA FOR TESTING
-- ==========================================

-- Sample deal stages data
INSERT INTO tf_deals (company_id, primary_contact_id, name, description, value, probability, stage, expected_close_date, source, created_by, assigned_to)
SELECT 
    c.id as company_id,
    con.id as primary_contact_id,
    'Website Redesign Project' as name,
    'Complete website redesign with modern design and enhanced functionality' as description,
    5000.00 as value,
    75 as probability,
    'proposal' as stage,
    CURRENT_DATE + INTERVAL '30 days' as expected_close_date,
    'website' as source,
    (SELECT id FROM auth.users LIMIT 1) as created_by,
    (SELECT id FROM auth.users LIMIT 1) as assigned_to
FROM tf_companies c
JOIN tf_contacts con ON con.company_id = c.id
WHERE c.name ILIKE '%tech%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample interaction data
INSERT INTO tf_contact_interactions (contact_id, interaction_type, subject, notes, outcome, next_action, next_action_date, created_by)
SELECT 
    con.id as contact_id,
    'meeting' as interaction_type,
    'Initial consultation meeting' as subject,
    'Discussed project requirements and timeline. Client is very interested and has budget approved.' as notes,
    'positive' as outcome,
    'Send detailed proposal' as next_action,
    CURRENT_DATE + INTERVAL '3 days' as next_action_date,
    (SELECT id FROM auth.users LIMIT 1) as created_by
FROM tf_contacts con
JOIN tf_companies c ON c.id = con.company_id
WHERE c.name ILIKE '%tech%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ==========================================
-- SCHEMA CREATION COMPLETE
-- ==========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;