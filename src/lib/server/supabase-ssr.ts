import { createClient } from "@supabase/supabase-js";
import type { Cookies } from "@sveltejs/kit";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseServerClient(cookies: Cookies) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key) => {
          // Try multiple cookie formats that Supabase might use
          const cookiesList = cookies.getAll();

          // Direct key lookup
          let value = cookies.get(key);

          // If not found, try to find any Supabase auth cookie
          if (!value) {
            const authCookie = cookiesList.find(
              (c) => c.name.includes("auth-token") && c.name.includes("sb-")
            );
            if (authCookie) {
              value = authCookie.value;
            }
          }

          return value || null;
        },
        setItem: async (key, value) => {
          cookies.set(key, value, {
            path: "/",
            secure: true,
            httpOnly: false, // Allow client-side access
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        },
        removeItem: async (key) => {
          cookies.delete(key, { path: "/" });
        },
      },
    },
  });
}
