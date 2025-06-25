import { createAdminClient } from "./supabase/factory";

// Export the unified admin client
export const supabaseAdmin = createAdminClient();
