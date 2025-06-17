-- Fix materialized view error by dropping any problematic views/triggers
-- This error suggests there's a materialized view or trigger that shouldn't be there

-- Drop any existing materialized views that might be causing issues
DROP MATERIALIZED VIEW IF EXISTS proposal_line_items_summary CASCADE;

-- Drop any triggers on tf_proposals that might be referencing this view
DROP TRIGGER IF EXISTS update_proposal_line_items_summary ON tf_proposals;

-- Check if there are any other views or triggers causing issues
-- You can run this to see what exists:
-- SELECT schemaname, viewname FROM pg_views WHERE schemaname = 'public';
-- SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname = 'public';