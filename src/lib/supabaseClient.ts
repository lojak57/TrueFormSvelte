import { browser } from "$app/environment";
import { invalidate } from "$app/navigation";
import { createClient } from "@supabase/supabase-js";

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
      flowType: "pkce",
      // Force cookie-based storage for SSR compatibility
      storage: {
        getItem: (key: string) => {
          if (browser) {
            return (
              document.cookie
                .split("; ")
                .find((row) => row.startsWith(key + "="))
                ?.split("=")[1] || null
            );
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          if (browser) {
            // Set cookie without domain restriction for better compatibility
            // Let the browser handle domain scope automatically
            document.cookie = `${key}=${value}; path=/; secure; samesite=lax; max-age=${
              60 * 60 * 24 * 7
            }`; // 7 days
          }
        },
        removeItem: (key: string) => {
          if (browser) {
            // Remove without domain restriction
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          }
        },
      },
    },
  });

  // Set up auth state change listener to sync with server
  if (browser) {
    supabase.auth.onAuthStateChange((event, session) => {
      // Only invalidate on SIGNED_OUT to avoid clearing session after login
      if (event === "SIGNED_OUT") {
        invalidate("supabase:auth");
      }
      // For SIGNED_IN, let the session persist naturally
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
