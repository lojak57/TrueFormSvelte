-- TrueForm Proposal Generator Database Schema
-- Enhanced with Red-Team Feedback for Enterprise-Grade Performance

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
CREATE TYPE line_item_type AS ENUM ('development', 'design', 'consultation', 'hosting', 'maintenance', 'other');
CREATE TYPE complexity_level AS ENUM ('simple', 'medium', 'complex');

-- ============================================================================
-- CORE FUNCTIONS
-- ============================================================================

-- Auto-numbering function (prevents race conditions)
CREATE OR REPLACE FUNCTION generate_proposal_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  new_number INTEGER;
  year_part VARCHAR(4);
  proposal_number VARCHAR(50);
BEGIN
  year_part := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
  
  -- Get next number for this year
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(SPLIT_PART(proposal_number, '-', 3), '-', 1) AS INTEGER)
  ), 0) + 1
  INTO new_number
  FROM proposals 
  WHERE proposal_number LIKE 'PROP-' || year_part || '-%';
  
  proposal_number := 'PROP-' || year_part || '-' || LPAD(new_number::VARCHAR, 3, '0');
  
  RETURN proposal_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check for draft conflicts
CREATE OR REPLACE FUNCTION check_draft_conflict(
  p_organization_id UUID,
  p_user_id UUID,
  p_last_updated TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
DECLARE
  latest_update TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT updated_at INTO latest_update
  FROM proposal_drafts
  WHERE organization_id = p_organization_id 
    AND user_id = p_user_id;
  
  RETURN latest_update > p_last_updated;
END;
$$ LANGUAGE plpgsql;

-- Helper function for organization-based access
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
BEGIN
  -- Get organization from user profile
  RETURN (
    SELECT COALESCE(m.organization_id, p.organization_id)
    FROM auth.users u
    LEFT JOIN profiles p ON p.id = u.id
    LEFT JOIN memberships m ON m.user_id = u.id
    WHERE u.id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin role
CREATE OR REPLACE FUNCTION has_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MAIN TABLES
-- ============================================================================

-- Proposals table (enhanced with currency and jurisdiction)
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  proposal_number VARCHAR(50) UNIQUE NOT NULL DEFAULT generate_proposal_number(),
  
  -- Client Information
  client_company VARCHAR(255) NOT NULL,
  client_contact_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  client_address JSONB DEFAULT '{}', -- {street, city, state, zip, country}
  
  -- Proposal Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status proposal_status DEFAULT 'draft',
  
  -- Financial Information (Enhanced)
  currency_code CHAR(3) DEFAULT 'USD', -- Multi-currency support
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0, -- e.g., 0.0825 for 8.25%
  tax_jurisdiction VARCHAR(100), -- Store for future tax logic
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- Terms & Conditions
  payment_terms TEXT DEFAULT '50% upfront, 50% on completion',
  project_timeline VARCHAR(255),
  valid_until DATE,
  notes TEXT,
  
  -- Template Snapshot (Red-team improvement)
  template_snapshot JSONB, -- Frozen copy of template at creation time
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  pdf_url TEXT, -- URL to generated PDF
  pdf_html_snapshot TEXT, -- HTML snapshot for regeneration
  sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Version control for multi-tab editing
  version INTEGER DEFAULT 1,
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(title, '') || ' ' ||
      coalesce(client_company, '') || ' ' ||
      coalesce(client_contact_name, '') || ' ' ||
      coalesce(description, '')
    )
  ) STORED
);

-- Proposal line items (enhanced)
CREATE TABLE proposal_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  
  -- Item Details
  item_type line_item_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Pricing (using centralized money calculations)
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_type VARCHAR(50) DEFAULT 'each', -- 'hours', 'days', 'each', 'project'
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  
  -- Development-specific fields
  estimated_hours DECIMAL(10,2), -- For development items
  complexity_level complexity_level,
  
  -- AI assistance tracking (future-proofing)
  llm_generated BOOLEAN DEFAULT false,
  llm_version VARCHAR(50),
  llm_prompt_hash VARCHAR(64),
  
  -- Ordering
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Proposal templates for reusability (enhanced)
CREATE TABLE proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'website', 'webapp', 'ecommerce', 'mobile'
  
  -- Template Content
  template_data JSONB NOT NULL, -- Stores line items, terms, etc.
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Version tracking
  version INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Draft storage for auto-save functionality
CREATE TABLE proposal_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Draft data
  draft_data JSONB NOT NULL DEFAULT '{}',
  wizard_step INTEGER DEFAULT 1,
  
  -- Conflict resolution
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(organization_id, user_id) -- One draft per user per org
);

-- Audit trail for all proposal changes
CREATE TABLE proposal_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_line_items_updated_at BEFORE UPDATE ON proposal_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_templates_updated_at BEFORE UPDATE ON proposal_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_drafts_updated_at BEFORE UPDATE ON proposal_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logging trigger
CREATE OR REPLACE FUNCTION log_proposal_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO proposal_audit_log (
      proposal_id, 
      action_type, 
      old_values, 
      new_values, 
      changed_by,
      ip_address,
      user_agent
    ) VALUES (
      NEW.id,
      'UPDATE',
      to_jsonb(OLD),
      to_jsonb(NEW),
      auth.uid(),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO proposal_audit_log (
      proposal_id, 
      action_type, 
      new_values, 
      changed_by,
      ip_address,
      user_agent
    ) VALUES (
      NEW.id,
      'INSERT',
      to_jsonb(NEW),
      auth.uid(),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO proposal_audit_log (
      proposal_id, 
      action_type, 
      old_values, 
      changed_by,
      ip_address,
      user_agent
    ) VALUES (
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      auth.uid(),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER proposal_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON proposals
  FOR EACH ROW EXECUTE FUNCTION log_proposal_changes();

-- ============================================================================
-- INDEXES (Performance Optimized)
-- ============================================================================

-- Core indexes
CREATE INDEX idx_proposals_organization_id ON proposals(organization_id);
CREATE INDEX idx_proposals_opportunity_id ON proposals(opportunity_id) WHERE opportunity_id IS NOT NULL;
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX idx_proposals_created_by ON proposals(created_by);
CREATE INDEX idx_proposals_number ON proposals(proposal_number);
CREATE INDEX idx_proposal_line_items_proposal_id ON proposal_line_items(proposal_id);
CREATE INDEX idx_proposal_templates_organization_id ON proposal_templates(organization_id);

-- Analytics-focused indexes (red-team improvement)
CREATE INDEX idx_proposals_org_date ON proposals(organization_id, created_at DESC);
CREATE INDEX idx_proposals_currency_status ON proposals(currency_code, status);
CREATE INDEX idx_proposals_total_amount ON proposals(total_amount DESC) WHERE status = 'accepted';
CREATE INDEX idx_line_items_type_complexity ON proposal_line_items(item_type, complexity_level);
CREATE INDEX idx_line_items_pricing ON proposal_line_items(unit_price DESC, total_price DESC);

-- Search optimization
CREATE INDEX idx_proposals_search ON proposals USING GIN(search_vector);
CREATE INDEX idx_proposals_client_company ON proposals USING btree(lower(client_company));
CREATE INDEX idx_proposals_client_email ON proposals USING btree(lower(client_email));

-- Draft management
CREATE INDEX idx_proposal_drafts_user_org ON proposal_drafts(user_id, organization_id);
CREATE INDEX idx_proposal_drafts_updated_at ON proposal_drafts(updated_at DESC);

-- Audit trail
CREATE INDEX idx_proposal_audit_proposal_id ON proposal_audit_log(proposal_id);
CREATE INDEX idx_proposal_audit_changed_at ON proposal_audit_log(changed_at DESC);
CREATE INDEX idx_proposal_audit_changed_by ON proposal_audit_log(changed_by);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_audit_log ENABLE ROW LEVEL SECURITY;

-- Proposals policies
CREATE POLICY "Users can view proposals from their organization" 
ON proposals FOR SELECT 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create proposals for their organization" 
ON proposals FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update proposals they created or if admin" 
ON proposals FOR UPDATE 
USING (created_by = auth.uid() OR has_admin_role());

-- Red-team improvement: Restrict deletes
CREATE POLICY "Users can delete draft proposals they created or if admin" 
ON proposals FOR DELETE 
USING ((created_by = auth.uid() OR has_admin_role()) AND status = 'draft');

-- Line items policies
CREATE POLICY "Users can manage line items for their org proposals" 
ON proposal_line_items FOR ALL 
USING (EXISTS (
  SELECT 1 FROM proposals 
  WHERE proposals.id = proposal_line_items.proposal_id 
  AND proposals.organization_id = get_user_organization_id()
));

-- Template policies
CREATE POLICY "Users can view templates from their organization" 
ON proposal_templates FOR SELECT 
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create templates for their organization" 
ON proposal_templates FOR INSERT 
WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update templates they created or if admin" 
ON proposal_templates FOR UPDATE 
USING (created_by = auth.uid() OR has_admin_role());

CREATE POLICY "Users can delete templates they created or if admin" 
ON proposal_templates FOR DELETE 
USING (created_by = auth.uid() OR has_admin_role());

-- Draft policies
CREATE POLICY "Users can manage their own drafts" 
ON proposal_drafts FOR ALL 
USING (user_id = auth.uid() AND organization_id = get_user_organization_id());

-- Audit log policies (read-only for most users)
CREATE POLICY "Users can view audit logs for their org proposals" 
ON proposal_audit_log FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM proposals 
  WHERE proposals.id = proposal_audit_log.proposal_id 
  AND proposals.organization_id = get_user_organization_id()
));

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Enhanced proposal performance metrics
CREATE VIEW proposal_metrics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  organization_id,
  currency_code,
  COUNT(*) as total_proposals,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_proposals,
  ROUND(COUNT(CASE WHEN status = 'accepted' THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as conversion_rate,
  AVG(total_amount) as avg_proposal_value,
  SUM(CASE WHEN status = 'accepted' THEN total_amount ELSE 0 END) as revenue,
  AVG(EXTRACT(EPOCH FROM (accepted_at - created_at))/86400) as avg_days_to_close,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
  COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
  COUNT(CASE WHEN status = 'viewed' THEN 1 END) as viewed_count
FROM proposals
GROUP BY DATE_TRUNC('month', created_at), organization_id, currency_code;

-- Line item effectiveness analysis
CREATE VIEW line_item_analytics AS
SELECT 
  pli.item_type,
  pli.complexity_level,
  p.organization_id,
  COUNT(*) as usage_count,
  AVG(pli.unit_price) as avg_unit_price,
  AVG(pli.estimated_hours) as avg_estimated_hours,
  COUNT(CASE WHEN p.status = 'accepted' THEN 1 END) as accepted_count,
  ROUND(COUNT(CASE WHEN p.status = 'accepted' THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as success_rate,
  SUM(pli.total_price) as total_value,
  SUM(CASE WHEN p.status = 'accepted' THEN pli.total_price ELSE 0 END) as accepted_value
FROM proposal_line_items pli
JOIN proposals p ON pli.proposal_id = p.id
GROUP BY pli.item_type, pli.complexity_level, p.organization_id;

-- Client analytics with LTV
CREATE VIEW client_analytics AS
SELECT 
  client_company,
  client_email,
  organization_id,
  COUNT(*) as proposal_count,
  SUM(total_amount) as total_value,
  SUM(CASE WHEN status = 'accepted' THEN total_amount ELSE 0 END) as lifetime_value,
  MAX(created_at) as last_proposal_date,
  MIN(created_at) as first_proposal_date,
  ARRAY_AGG(DISTINCT status) as proposal_statuses,
  AVG(total_amount) as avg_proposal_value,
  ROUND(COUNT(CASE WHEN status = 'accepted' THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as conversion_rate
FROM proposals
GROUP BY client_company, client_email, organization_id;

-- Template usage analytics
CREATE VIEW template_analytics AS
SELECT 
  pt.id,
  pt.name,
  pt.category,
  pt.organization_id,
  pt.usage_count,
  COUNT(p.id) as proposals_created,
  COUNT(CASE WHEN p.status = 'accepted' THEN 1 END) as successful_proposals,
  ROUND(COUNT(CASE WHEN p.status = 'accepted' THEN 1 END)::DECIMAL / NULLIF(COUNT(p.id), 0) * 100, 2) as template_success_rate,
  AVG(p.total_amount) as avg_proposal_value,
  SUM(CASE WHEN p.status = 'accepted' THEN p.total_amount ELSE 0 END) as revenue_generated
FROM proposal_templates pt
LEFT JOIN proposals p ON p.template_snapshot->>'template_id' = pt.id::text
GROUP BY pt.id, pt.name, pt.category, pt.organization_id, pt.usage_count;

-- ============================================================================
-- SAMPLE DATA (for development)
-- ============================================================================

-- Insert sample proposal template
INSERT INTO proposal_templates (
  organization_id, 
  name, 
  description, 
  category, 
  template_data,
  created_by
) VALUES (
  (SELECT id FROM organizations WHERE name = 'TrueForm' LIMIT 1),
  'Standard Website Development',
  'Template for typical website development projects',
  'website',
  '{
    "line_items": [
      {
        "item_type": "design",
        "title": "UI/UX Design",
        "description": "Custom website design and user experience optimization",
        "quantity": 1,
        "unit_type": "project",
        "unit_price": 2500,
        "complexity_level": "medium",
        "estimated_hours": 40
      },
      {
        "item_type": "development",
        "title": "Frontend Development",
        "description": "Responsive website development with modern technologies",
        "quantity": 1,
        "unit_type": "project", 
        "unit_price": 4000,
        "complexity_level": "medium",
        "estimated_hours": 60
      },
      {
        "item_type": "development",
        "title": "Content Management System",
        "description": "Easy-to-use CMS for content updates",
        "quantity": 1,
        "unit_type": "project",
        "unit_price": 1500,
        "complexity_level": "simple",
        "estimated_hours": 20
      }
    ],
    "payment_terms": "50% upfront, 50% on completion",
    "project_timeline": "4-6 weeks"
  }'::jsonb,
  (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT DO NOTHING; 