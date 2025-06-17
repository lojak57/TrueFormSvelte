-- Drop the problematic trigger and function that's causing the error
DROP TRIGGER IF EXISTS refresh_proposal_summary_trigger ON tf_proposals;
DROP FUNCTION IF EXISTS refresh_proposal_summary() CASCADE;

-- Keep the update_updated_at trigger since that's useful
-- DROP TRIGGER IF EXISTS update_proposals_updated_at ON tf_proposals;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;