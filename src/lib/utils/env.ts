import { browser } from "$app/environment";

// Simple environment getter - no validation on load
export const ENV = {
  SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  APP_URL: import.meta.env.PUBLIC_APP_URL || "https://true-form-apps.com",
} as const;

// Validation function (call when needed)
export function validateEnv() {
  const missing: string[] = [];

  if (!ENV.SUPABASE_URL) missing.push("PUBLIC_SUPABASE_URL");
  if (!ENV.SUPABASE_ANON_KEY) missing.push("PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(
      ", "
    )}`;
    console.error("🚨 Environment Configuration Error:", error);

    if (!browser) {
      throw new Error(error);
    }
  }

  return missing.length === 0;
}
