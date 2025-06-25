import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // If user is already logged in, redirect to dashboard
  if (locals.user) {
    // Check if there's a redirectTo parameter
    const redirectTo = url.searchParams.get("redirectTo");
    throw redirect(303, redirectTo || "/admin/dashboard");
  }

  return {
    user: null,
  };
};
