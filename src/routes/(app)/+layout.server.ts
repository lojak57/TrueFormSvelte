import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Check if user is authenticated
  if (!locals.user) {
    // Redirect to login with return URL
    throw redirect(
      303,
      `/login?redirectTo=${encodeURIComponent(url.pathname)}`
    );
  }

  return {
    user: locals.user,
  };
};
