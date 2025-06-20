import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";
import { supabaseAdmin } from "$lib/supabaseAdmin";

export const GET: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for proposal details
  await requireAuth(request);
  try {
    const { id } = params;

    const { data: proposal, error } = await supabaseAdmin
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

export const PUT: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for updating proposals
  await requireAuth(request);
  try {
    const { id } = params;
    const updateData = await request.json();

    const { data: proposal, error } = await supabaseAdmin
      .from("tf_proposals")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return json({ error: "Proposal not found" }, { status: 404 });
      }
      throw error;
    }

    return json(proposal);
  } catch (error) {
    console.error("Error updating proposal:", error);
    return json({ error: "Failed to update proposal" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for deleting proposals
  await requireAuth(request);
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from("tf_proposals")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return json({ error: "Failed to delete proposal" }, { status: 500 });
  }
};
