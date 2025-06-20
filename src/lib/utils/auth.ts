import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { UserSession } from '$lib/types';
import { rateLimiters, createRateLimitResponse } from './rateLimit';

/**
 * Authentication middleware for API routes with rate limiting
 * Verifies the user's session and returns user data
 * Throws 401 error if authentication fails or 429 if rate limited
 */
export async function requireAuth(request: Request, useRateLimit = true): Promise<UserSession> {
  // Apply rate limiting for auth endpoints
  if (useRateLimit) {
    const rateLimitResult = rateLimiters.auth.middleware(request);
    if (!rateLimitResult.allowed) {
      throw createRateLimitResponse(rateLimitResult.resetTime);
    }
  }
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw error(401, 'Authorization header missing or invalid');
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      throw error(401, 'Access token missing');
    }

    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw error(401, 'Invalid or expired token');
    }

    // Return user session data
    const userSession: UserSession = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role,
      organization_id: user.user_metadata?.organization_id,
    };

    return userSession;
  } catch (err) {
    // If it's already an error from @sveltejs/kit, re-throw it
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }
    
    // Otherwise, create a new 401 error
    throw error(401, 'Authentication failed');
  }
}

/**
 * Optional authentication middleware
 * Returns user data if authenticated, null if not
 * Does not throw errors for unauthenticated requests
 */
export async function optionalAuth(request: Request): Promise<UserSession | null> {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}

/**
 * Role-based authorization middleware
 * Verifies user has required role after authentication
 */
export async function requireRole(request: Request, requiredRole: string): Promise<UserSession> {
  const user = await requireAuth(request);
  
  if (!user.role || user.role !== requiredRole) {
    throw error(403, 'Insufficient permissions');
  }
  
  return user;
}

/**
 * Extract user session from SvelteKit locals (for server-side)
 * Used in +layout.server.ts and page server loads
 */
export function getSessionFromLocals(locals: any): UserSession | null {
  return locals.session || null;
}

/**
 * Verify session in server-side code (hooks, layouts)
 * Returns session or null if not authenticated
 */
export async function verifySession(cookies: any): Promise<UserSession | null> {
  try {
    // Import the server-side Supabase client
    const { supabaseServer } = await import('$lib/supabase.server');
    
    // Try various cookie names that Supabase might use
    const possibleTokenNames = [
      'sb-access-token',
      'supabase-auth-token',
      'supabase.auth.token',
      // Check for project-specific cookies (format varies by project)
    ];
    
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    
    // Try to find tokens with any of the possible names
    for (const name of possibleTokenNames) {
      const token = cookies.get(name);
      if (token) {
        accessToken = token;
        break;
      }
    }
    
    // Also look for refresh token
    for (const name of ['sb-refresh-token', 'supabase-refresh-token']) {
      const token = cookies.get(name);
      if (token) {
        refreshToken = token;
        break;
      }
    }
    
    // Scan all cookies for Supabase patterns if still not found
    if (!accessToken) {
      const allCookies = cookies.getAll();
      console.log(`[AUTH] Scanning cookies:`, allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
      
      for (const cookie of allCookies) {
        if (cookie.name.includes('auth-token') || 
            cookie.name.includes('access') || 
            cookie.name.startsWith('sb-') && cookie.name.includes('auth')) {
          accessToken = cookie.value;
          console.log(`[AUTH] Found token in cookie: ${cookie.name}`);
          break;
        }
      }
    }
    
    if (!accessToken) {
      console.log(`[AUTH] No access token found in cookies`);
      return null;
    }

    // Verify the token with Supabase server client
    const { data: { user }, error } = await supabaseServer.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`[AUTH] Token verification failed:`, error?.message);
      return null;
    }

    console.log(`[AUTH] Session verified for user: ${user.email}`);
    return {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role,
      organization_id: user.user_metadata?.organization_id,
    };
  } catch (err) {
    console.log(`[AUTH] Session verification error:`, err);
    return null;
  }
}