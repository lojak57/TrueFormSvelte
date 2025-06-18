import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { createClient } from "@supabase/supabase-js";

// Get PUBLIC_SUPABASE_URL from import.meta.env (more reliable for build)
const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;

if (!PUBLIC_SUPABASE_URL) {
  throw new Error("PUBLIC_SUPABASE_URL is required");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}

// Admin client with service role key - bypasses RLS policies
export const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
