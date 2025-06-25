import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  // Only allow access to dev routes in development mode
  if (!dev) {
    throw error(404, "Page not found");
  }

  return {};
};
