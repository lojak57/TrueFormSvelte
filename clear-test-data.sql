-- Clear test proposal data
DELETE FROM tf_proposals WHERE title LIKE '%Website Development%' OR title LIKE '%test%';

-- Optional: Clear all proposals if you want a fresh start
-- DELETE FROM tf_proposals;