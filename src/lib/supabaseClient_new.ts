import { createSafeClient } from "./supabase/factory";

// Export the unified browser client
export const supabase = createSafeClient();

// NOTE: All types have been moved to $lib/types for better organization
// Import types like: import type { UserSession } from '$lib/types'
