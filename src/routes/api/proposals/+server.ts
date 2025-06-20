import type { CreateProposalDTO } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";
import { supabaseAdmin } from "$lib/supabaseAdmin";

export const GET: RequestHandler = async ({ request }) => {
  // 🔒 SECURE: Require authentication for proposal data
  await requireAuth(request);
  try {
    const { data: proposals, error } = await supabaseAdmin
      .from("tf_proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching proposals:", error);
      return json({ error: "Failed to fetch proposals" }, { status: 500 });
    }

    return json(proposals || []);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  // 🔒 SECURE: Require authentication for creating proposals
  await requireAuth(request);
  try {
    console.log("=== PROPOSAL CREATION START ===");
    const proposalData: CreateProposalDTO = await request.json();
    console.log(
      "Received proposal data:",
      JSON.stringify(proposalData, null, 2)
    );

    // Validate required fields
    if (
      !proposalData.title ||
      !proposalData.company_id ||
      !proposalData.line_items?.length
    ) {
      console.log("Validation failed - missing required fields");
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Validation passed, calculating totals...");

    // Calculate totals
    const subtotal = proposalData.line_items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = subtotal * ((proposalData.tax_rate || 0) / 100);
    const total = subtotal + tax;

    console.log("Calculated totals:", { subtotal, tax, total });

    // Use the actual data from the form
    const dbData = {
      title: proposalData.title,
      company_id: proposalData.company_id,
      contact_id: proposalData.contact_id || null,
      line_items: proposalData.line_items,
      subtotal,
      tax,
      tax_rate: proposalData.tax_rate || 0,
      total,
      notes: proposalData.notes || "",
      status: "draft",
    };

    console.log(
      "Attempting database insert with actual data:",
      JSON.stringify(dbData, null, 2)
    );

    // Insert into database using admin client for secure mutations
    const { data: proposal, error } = await supabaseAdmin
      .from("tf_proposals")
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating proposal:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Created proposal successfully:", proposal);
    return json(proposal, { status: 201 });
  } catch (error) {
    console.error("=== PROPOSAL CREATION ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error constructor:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "No message"
    );
    console.error("Full error object:", error);

    // Check if it's a Supabase error
    if (error && typeof error === "object" && "code" in error) {
      console.error("Supabase error code:", (error as any).code);
      console.error("Supabase error details:", (error as any).details);
      console.error("Supabase error hint:", (error as any).hint);
    }

    return json(
      {
        error: "Failed to create proposal",
        details: error instanceof Error ? error.message : "Unknown error",
        supabaseError:
          error && typeof error === "object" && "code" in error
            ? {
                code: (error as any).code,
                details: (error as any).details,
                hint: (error as any).hint,
              }
            : null,
      },
      { status: 500 }
    );
  }
};
