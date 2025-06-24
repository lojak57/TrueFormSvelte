import { supabase } from "$lib/supabaseClient";
import type { UserSession } from "$lib/types";
import { error } from "@sveltejs/kit";
import { createRateLimitResponse, rateLimiters } from "./rateLimit";

/**
 * Authentication middleware for API routes with rate limiting
 * Verifies the user's session and returns user data
 * Throws 401 error if authentication fails or 429 if rate limited
 */
export async function requireAuth(
  request: Request,
  useRateLimit = true
): Promise<UserSession> {
  // Apply rate limiting for auth endpoints
  if (useRateLimit) {
    const rateLimitResult = rateLimiters.auth.middleware(request);
    if (!rateLimitResult.allowed) {
      throw createRateLimitResponse(rateLimitResult.resetTime);
    }
  }
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw error(401, "Authorization header missing or invalid");
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw error(401, "Access token missing");
    }

    // Verify token with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw error(401, "Invalid or expired token");
    }

    // Return user session data
    const userSession: UserSession = {
      id: user.id,
      email: user.email || "",
      role: user.user_metadata?.role,
      organization_id: user.user_metadata?.organization_id,
    };

    return userSession;
  } catch (err) {
    // If it's already an error from @sveltejs/kit, re-throw it
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }

    // Otherwise, create a new 401 error
    throw error(401, "Authentication failed");
  }
}

/**
 * Optional authentication middleware
 * Returns user data if authenticated, null if not
 * Does not throw errors for unauthenticated requests
 */
export async function optionalAuth(
  request: Request
): Promise<UserSession | null> {
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
export async function requireRole(
  request: Request,
  requiredRole: string
): Promise<UserSession> {
  const user = await requireAuth(request);

  if (!user.role || user.role !== requiredRole) {
    throw error(403, "Insufficient permissions");
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
    // Get all cookies
    const allCookies = cookies.getAll();

    // Look for Supabase auth cookies (they follow the pattern sb-<project-ref>-auth-token)
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    // Find auth tokens in cookies - look for the specific Supabase pattern
    for (const cookie of allCookies) {
      if (cookie.name.includes("auth-token") && cookie.name.startsWith("sb-")) {
        // Parse the JSON value to get the access_token
        try {
          const sessionData = JSON.parse(cookie.value);
          if (sessionData.access_token) {
            accessToken = sessionData.access_token;
          }
        } catch (err) {
          // Silently ignore parse errors for non-JSON cookies
        }
      }
      if (
        cookie.name.includes("refresh-token") &&
        cookie.name.startsWith("sb-")
      ) {
        refreshToken = cookie.value;
      }
    }

    if (!accessToken) {
      return null;
    }

    // Import the server-side Supabase client and verify the token
    const { supabaseServer } = await import("$lib/supabase.server");

    // Manually verify the token
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(accessToken);

    if (error) {
      return null;
    }

    if (!user) {
      return null;
    }

    // Return user session data
    const userSession: UserSession = {
      id: user.id,
      email: user.email || "",
      role: user.user_metadata?.role,
      organization_id: user.user_metadata?.organization_id,
    };

    return userSession;
  } catch (err) {
    return null;
  }
}
