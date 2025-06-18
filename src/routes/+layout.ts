import { isAuthenticated, userSession } from "$lib/stores/user";
import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Update stores
  if (session?.user) {
    userSession.set({
      id: session.user.id,
      email: session.user.email || "",
      role: session.user.user_metadata?.role,
      organization_id: session.user.user_metadata?.organization_id,
    });
    isAuthenticated.set(true);
  } else {
    userSession.set(null);
    isAuthenticated.set(false);
  }

  // Route guard: redirect to login if accessing admin routes without session
  // But don't redirect if we're already on the login page to prevent loops
  if (url.pathname.startsWith("/admin") && !session && url.pathname !== "/login") {
    throw redirect(303, "/login");
  }

  return {
    session: session?.user || null,
  };
};
