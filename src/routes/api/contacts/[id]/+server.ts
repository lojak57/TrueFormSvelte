import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";
import { supabaseAdmin } from "$lib/supabaseAdmin";

export const GET: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for contact details
  await requireAuth(request);
  try {
    const { id } = params;

    // Get contact details
    const { data: contact, error: contactError } = await supabaseAdmin
      .from("tf_contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (contactError) {
      if (contactError.code === "PGRST116") {
        return json({ error: "Contact not found" }, { status: 404 });
      }
      throw contactError;
    }

    // Get associated company
    let company = null;
    if (contact.company_id) {
      const { data: companyData, error: companyError } = await supabaseAdmin
        .from("tf_companies")
        .select("id, name, industry, size")
        .eq("id", contact.company_id)
        .single();

      if (!companyError) {
        company = companyData;
      }
    }

    // Get interaction history
    const { data: interactions, error: interactionsError } = await supabaseAdmin
      .from("tf_contact_interactions")
      .select("*")
      .eq("contact_id", id)
      .order("created_at", { ascending: false });

    if (interactionsError) throw interactionsError;

    // Return contact with related data
    const contactWithRelations = {
      ...contact,
      company,
      interactions: interactions || [],
      stats: {
        total_interactions: (interactions || []).length,
        last_interaction:
          (interactions || []).length > 0 ? interactions[0].created_at : null,
        interaction_types: {
          email: (interactions || []).filter((i) => i.type === "email").length,
          call: (interactions || []).filter((i) => i.type === "call").length,
          meeting: (interactions || []).filter((i) => i.type === "meeting")
            .length,
          demo: (interactions || []).filter((i) => i.type === "demo").length,
          proposal: (interactions || []).filter((i) => i.type === "proposal")
            .length,
        },
      },
    };

    return json(contactWithRelations);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return json({ error: "Failed to fetch contact" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for updating contacts
  await requireAuth(request);
  try {
    const { id } = params;
    const updateData = await request.json();

    const { data: contact, error } = await supabaseAdmin
      .from("tf_contacts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return json({ error: "Contact not found" }, { status: 404 });
      }
      throw error;
    }

    return json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return json({ error: "Failed to update contact" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for deleting contacts
  await requireAuth(request);
  try {
    const { id } = params;

    const { error } = await supabaseAdmin.from("tf_contacts").delete().eq("id", id);

    if (error) throw error;

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return json({ error: "Failed to delete contact" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ params, request }) => {
  // 🔒 SECURE: Require authentication for creating interactions
  await requireAuth(request);
  try {
    const { id } = params;
    const body = await request.json();

    // Add new interaction
    if (body.interaction) {
      const interactionData = {
        contact_id: id,
        type: body.interaction.type,
        subject: body.interaction.subject,
        notes: body.interaction.notes,
        created_at: body.interaction.created_at || new Date().toISOString(),
      };

      const { data: interaction, error } = await supabaseAdmin
        .from("tf_contact_interactions")
        .insert(interactionData)
        .select()
        .single();

      if (error) throw error;

      return json(interaction, { status: 201 });
    }

    return json({ error: "Invalid request body" }, { status: 400 });
  } catch (error) {
    console.error("Error creating interaction:", error);
    return json({ error: "Failed to create interaction" }, { status: 500 });
  }
};
