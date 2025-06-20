import { getServerSession } from "$lib/server/supabase";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // 🔒 AUTHENTICATION: Check user session for all requests
  console.log(`[HOOKS] Checking session for ${event.url.pathname}`);
  const session = await getServerSession(event.cookies);
  console.log(`[HOOKS] Session result:`, session ? { email: session.user.email, id: session.user.id } : 'NO SESSION');

  // Store user session in locals for use in layouts and pages
  if (session && session.user) {
    event.locals.user = {
      id: session.user.id,
      email: session.user.email || '',
      role: session.user.user_metadata?.role,
      organization_id: session.user.user_metadata?.organization_id,
    };
    console.log(`[HOOKS] Set locals.user:`, event.locals.user);
  } else {
    event.locals.user = null;
    console.log(`[HOOKS] No session, locals.user is null`);
  }
  const url = event.url;
  const hostname = url.hostname;

  // Check if this is the CRM subdomain
  const isCRMSubdomain =
    hostname === "crm.true-form-apps.com" ||
    hostname.startsWith("crm.") ||
    (hostname === "localhost" && url.port === "5175") || // For local dev
    url.searchParams.has("crm"); // Allow ?crm for local testing

  console.log(`[HOOKS] ${hostname}${url.pathname} - CRM: ${isCRMSubdomain} - Session: ${session ? 'YES' : 'NO'}`);
  
  // Debug: Log all cookies to help identify the auth cookie
  if (url.pathname.includes('/admin') || url.pathname.includes('/login')) {
    const allCookies = event.cookies.getAll();
    console.log(`[COOKIES] Available:`, allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
  }

  // If CRM subdomain, handle admin routing
  if (isCRMSubdomain) {
    // Redirect root of CRM to admin dashboard, but only if authenticated
    // Let the layout handle auth redirects to avoid conflicts
    if (url.pathname === "/") {
      console.log(`[CRM] Redirecting root to /admin/dashboard`);
      throw redirect(302, "/admin/dashboard");
    }

    // Allow all other paths to continue normally - let SvelteKit handle routing
    console.log(`[CRM] Allowing: ${url.pathname}`);
  }
  // If main domain, redirect admin routes to CRM
  else {
    if (url.pathname.startsWith("/admin")) {
      console.log(`[MAIN] Redirecting admin route to CRM`);
      throw redirect(302, "https://crm.true-form-apps.com" + url.pathname);
    }
  }

  const response = await resolve(event);
  return response;
};
