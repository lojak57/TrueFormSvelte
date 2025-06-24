import { createClient } from "@supabase/supabase-js";
import type { Cookies } from "@sveltejs/kit";

/**
 * Create a Supabase client for server-side usage with cookie handling
 * This properly handles cookie-based authentication for SSR
 */
export function createServerSupabaseClient(cookies: Cookies) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const allCookies = cookies.getAll();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          const cookie = cookies.get(key);

          // If exact key not found, try to find Supabase auth token
          if (!cookie && key.includes("auth-token")) {
            for (const c of allCookies) {
              if (c.name.includes("auth-token") && c.name.startsWith("sb-")) {
                return c.value;
              }
            }
          }

          return cookie || null;
        },
        setItem: (key: string, value: string) => {
          cookies.set(key, value, {
            path: "/",
            secure: true,
            sameSite: "lax",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        },
        removeItem: (key: string) => {
          cookies.delete(key, { path: "/" });
        },
      },
    },
  });
}

/**
 * Get the current session from cookies using the server-side Supabase client
 */
export async function getServerSession(cookies: Cookies) {
  const supabase = createServerSupabaseClient(cookies);

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return null;
    }

    if (!session) {
      return null;
    }

    return session;
  } catch (err) {
    return null;
  }
}
