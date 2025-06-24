import { createSupabaseServerClient } from "$lib/server/supabase-ssr";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // 🔒 AUTHENTICATION: Create server-side Supabase client for this request
  const supabase = createSupabaseServerClient(event.cookies);

  // Get session using the server client
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Store user session in locals for use in layouts and pages
  if (session && session.user) {
    event.locals.user = {
      id: session.user.id,
      email: session.user.email || "",
      role: session.user.user_metadata?.role,
      organization_id: session.user.user_metadata?.organization_id,
    };
  } else {
    event.locals.user = null;
  }
  const url = event.url;
  const hostname = url.hostname;

  // Check if this is the CRM subdomain
  const isCRMSubdomain =
    hostname === "crm.true-form-apps.com" ||
    hostname.startsWith("crm.") ||
    (hostname === "localhost" && url.port === "5175") || // For local dev
    url.searchParams.has("crm"); // Allow ?crm for local testing

  // If CRM subdomain, handle admin routing
  if (isCRMSubdomain) {
    // Redirect root of CRM to admin dashboard, but only if authenticated
    // Let the layout handle auth redirects to avoid conflicts
    if (url.pathname === "/") {
      throw redirect(302, "/admin/dashboard");
    }

    // Allow all other paths to continue normally - let SvelteKit handle routing
  }
  // If main domain, redirect admin routes to CRM
  else {
    if (url.pathname.startsWith("/admin")) {
      throw redirect(302, "https://crm.true-form-apps.com" + url.pathname);
    }
  }

  const response = await resolve(event);

  // 🔒 SECURITY HEADERS: Add comprehensive security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Strict Transport Security (HTTPS enforcement)
  if (url.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Content Security Policy - Strict but functional for SvelteKit + Supabase + Stripe
  const nonce = crypto.randomUUID();
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://js.stripe.com https://maps.googleapis.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://maps.googleapis.com wss://*.supabase.co",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  // Store nonce in locals for use in HTML
  event.locals.nonce = nonce;

  return response;
};
