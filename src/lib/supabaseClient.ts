import { browser } from "$app/environment";
import { createClient } from "@supabase/supabase-js";

// Use import.meta.env for Vercel compatibility
const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create a safe client that won't break during build
let supabase: ReturnType<typeof createClient>;

if (PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY) {
  // Create Supabase client with validated environment variables
  supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
} else if (browser) {
  // Only throw error in browser if env vars are missing
  throw new Error("Supabase environment variables are required");
} else {
  // During build, create a mock client to prevent errors
  supabase = createClient("https://placeholder.supabase.co", "placeholder-key");
}

export { supabase };

// NOTE: All types have been moved to $lib/types for better organization
// Import types like: import type { UserSession } from '$lib/types'
