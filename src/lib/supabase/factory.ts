import { browser } from "$app/environment";
import { invalidate } from "$app/navigation";
import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Environment variable validation
function getSupabaseEnv() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing required Supabase environment variables");
  }

  return { url, anonKey };
}

// Custom storage implementation for browser client
const browserStorage = {
  getItem: (key: string) => {
    if (!browser) return null;
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(key + "="))
        ?.split("=")[1] || null
    );
  },
  setItem: (key: string, value: string) => {
    if (!browser) return;
    document.cookie = `${key}=${value}; path=/; secure; samesite=lax; max-age=${
      60 * 60 * 24 * 7
    }`; // 7 days
  },
  removeItem: (key: string) => {
    if (!browser) return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

// Client factory functions
export function createBrowserClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();

  const client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storage: browserStorage,
    },
  });

  // Set up auth state change listener
  if (browser) {
    client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        invalidate("supabase:auth");
      }
    });
  }

  return client;
}

export function createServerClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createAdminClient(): SupabaseClient {
  const { url } = getSupabaseEnv();

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin client");
  }

  return createClient(url, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Fallback client for build-time safety
export function createSafeClient(): SupabaseClient {
  try {
    return createBrowserClient();
  } catch (error) {
    if (browser) {
      throw error; // Re-throw in browser environment
    }
    // Create placeholder during build
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }
}
