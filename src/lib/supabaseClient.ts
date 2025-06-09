import { createClient } from '@supabase/supabase-js';
import { ENV } from '$lib/utils/env';

// Create Supabase client with validated environment variables
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

// NOTE: All types have been moved to $lib/types for better organization
// Import types like: import type { UserSession } from '$lib/types' 