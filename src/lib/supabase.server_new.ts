import { createServerClient } from "./supabase/factory";

// Export the unified server client
export const supabaseServer = createServerClient();
