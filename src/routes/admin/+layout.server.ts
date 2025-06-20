import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  console.log("👀 [ADMIN LAYOUT] locals.user:", locals.user);
  console.log("👀 [ADMIN LAYOUT] locals keys:", Object.keys(locals));
  
  // 🔒 SECURE: Block access to admin routes without authentication
  if (!locals.user) {
    // Redirect to login with return URL
    const returnUrl = url.pathname + url.search;
    console.log("❌ [ADMIN LAYOUT] No user found, redirecting to login with return URL:", returnUrl);
    throw redirect(302, `/login?redirect=${encodeURIComponent(returnUrl)}`);
  }

  console.log("✅ [ADMIN LAYOUT] User authenticated:", locals.user.email);
  
  // Pass authenticated user from server to client
  return {
    user: locals.user,
  };
};
