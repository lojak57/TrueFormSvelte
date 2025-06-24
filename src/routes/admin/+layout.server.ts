import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // 🔒 SECURE: Block access to admin routes without authentication
  if (!locals.user) {
    // Redirect to login with return URL
    const returnUrl = url.pathname + url.search;
    throw redirect(302, `/login?redirect=${encodeURIComponent(returnUrl)}`);
  }

  // Pass authenticated user from server to client
  return {
    user: locals.user,
  };
};
