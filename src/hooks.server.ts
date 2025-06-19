import { verifySession } from "$lib/utils/auth";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // 🔒 AUTHENTICATION: Check user session for all requests
  const session = await verifySession(event.cookies);

  // Store user session in locals for use in layouts and pages
  event.locals.user = session;
  const url = event.url;
  const hostname = url.hostname;

  // Check if this is the CRM subdomain
  const isCRMSubdomain =
    hostname === "crm.true-form-apps.com" ||
    hostname.startsWith("crm.") ||
    (hostname === "localhost" && url.port === "5175") || // For local dev
    url.searchParams.has("crm"); // Allow ?crm for local testing

  console.log(`[HOOKS] ${hostname}${url.pathname} - CRM: ${isCRMSubdomain}`);

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
