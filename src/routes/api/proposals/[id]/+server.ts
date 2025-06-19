import { createClient } from "@supabase/supabase-js";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const GET: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for proposal details
  await requireAuth(request);
  try {
    const { id } = params;

    const { data: proposal, error } = await supabase
      .from("tf_proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching proposal:", error);
      return json({ error: "Proposal not found" }, { status: 404 });
    }

    return json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return json({ error: "Failed to fetch proposal" }, { status: 500 });
  }
};
