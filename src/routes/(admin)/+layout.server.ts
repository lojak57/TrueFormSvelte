import { error, redirect } from "@sveltejs/kit";
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

  // Check if user has admin role
  if (locals.user.role !== "admin" && locals.user.role !== "super_admin") {
    // User is authenticated but not an admin
    throw error(403, {
      message: "Access Denied",
      hint: "You need administrator privileges to access this area.",
    });
  }

  return {
    user: locals.user,
    isAdmin: true,
  };
};
