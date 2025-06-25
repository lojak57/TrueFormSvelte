import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Public routes - no auth required, but we can still pass user if logged in
  return {
    user: locals.user || null,
  };
};
