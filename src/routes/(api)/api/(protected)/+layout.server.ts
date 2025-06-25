import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Check if user is authenticated for all protected API routes
  if (!locals.user) {
    throw error(401, {
      message: "Unauthorized",
      code: "AUTH_REQUIRED",
    });
  }

  // Return user for child routes to access
  return {
    user: locals.user,
  };
};
