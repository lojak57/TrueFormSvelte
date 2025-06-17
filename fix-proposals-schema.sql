-- Make created_by field optional for tf_proposals table
-- This allows proposals to be created without requiring authentication
ALTER TABLE tf_proposals ALTER COLUMN created_by DROP NOT NULL;