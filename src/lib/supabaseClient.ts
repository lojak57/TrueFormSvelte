import { browser } from "$app/environment";
import { createClient } from "@supabase/supabase-js";
import { invalidate } from "$app/navigation";

// Use import.meta.env for Vercel compatibility
const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create a safe client that won't break during build
let supabase: ReturnType<typeof createClient>;

if (PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY) {
  // Create Supabase client with auth handling optimized for SvelteKit
  supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });

  // Set up auth state change listener to sync with server
  if (browser) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // Invalidate all data to force re-fetch with new auth state
        invalidate('supabase:auth');
      }
    });
  }
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
