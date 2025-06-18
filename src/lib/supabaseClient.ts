import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

if (!PUBLIC_SUPABASE_URL) {
  throw new Error('PUBLIC_SUPABASE_URL is required');
}

if (!PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('PUBLIC_SUPABASE_ANON_KEY is required');
}

// Create Supabase client with validated environment variables
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// NOTE: All types have been moved to $lib/types for better organization
// Import types like: import type { UserSession } from '$lib/types' 