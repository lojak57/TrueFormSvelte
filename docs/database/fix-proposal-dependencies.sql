-- Comprehensive fix for proposal table dependencies
-- This will find and remove any triggers, functions, or views referencing the problematic relation

-- First, let's see what triggers exist on tf_proposals
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'tf_proposals';

-- Drop all triggers on tf_proposals table
DO $$ 
DECLARE 
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'tf_proposals'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON tf_proposals CASCADE';
    END LOOP;
END $$;

-- Drop any functions that might reference the problematic relation
DROP FUNCTION IF EXISTS update_proposal_summary() CASCADE;
DROP FUNCTION IF EXISTS refresh_proposal_line_items_summary() CASCADE;

-- Make sure the materialized view is completely gone
DROP MATERIALIZED VIEW IF EXISTS proposal_line_items_summary CASCADE;
DROP VIEW IF EXISTS proposal_line_items_summary CASCADE;

-- Check for any remaining dependencies
SELECT schemaname, viewname FROM pg_views WHERE viewname LIKE '%proposal%';
SELECT schemaname, matviewname FROM pg_matviews WHERE matviewname LIKE '%proposal%';