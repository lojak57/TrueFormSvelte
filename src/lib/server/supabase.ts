import { createClient } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

/**
 * Create a Supabase client for server-side usage with cookie handling
 * This properly handles cookie-based authentication for SSR
 */
export function createServerSupabaseClient(cookies: Cookies) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          const cookie = cookies.get(key);
          console.log(`[SERVER SUPABASE] Getting cookie ${key}:`, cookie ? 'found' : 'not found');
          return cookie || null;
        },
        setItem: (key: string, value: string) => {
          console.log(`[SERVER SUPABASE] Setting cookie ${key}`);
          cookies.set(key, value, {
            path: '/',
            secure: true,
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // 7 days
          });
        },
        removeItem: (key: string) => {
          console.log(`[SERVER SUPABASE] Removing cookie ${key}`);
          cookies.delete(key, { path: '/' });
        }
      }
    }
  });
}

/**
 * Get the current session from cookies using the server-side Supabase client
 */
export async function getServerSession(cookies: Cookies) {
  const supabase = createServerSupabaseClient(cookies);
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('[SERVER SESSION] Error getting session:', error.message);
      return null;
    }
    
    if (!session) {
      console.log('[SERVER SESSION] No session found');
      return null;
    }
    
    console.log('[SERVER SESSION] Session found for user:', session.user.email);
    return session;
  } catch (err) {
    console.log('[SERVER SESSION] Exception getting session:', err);
    return null;
  }
}