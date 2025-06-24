import {
  companyFilterSchema,
  createContactSchema,
  validateSchema,
} from "$lib/schemas/api";
import { supabaseAdmin } from "$lib/supabaseAdmin";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, request, locals }) => {
  // 🔒 SECURE: Require authentication for contact data
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // 🛡️ SECURE: Validate query parameters
    const rawParams = {
      company_id: url.searchParams.get("company_id") || undefined,
      vertical_id: url.searchParams.get("vertical_id") || undefined,
    };
    const validation = validateSchema(companyFilterSchema, rawParams);
    if (!validation.success) {
      return json({ error: validation.error }, { status: 400 });
    }

    const { company_id: companyId, vertical_id: verticalId } = validation.data;

    let query = supabaseAdmin
      .from("tf_contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (verticalId) {
      query = query.eq("vertical_id", verticalId);
    }

    const { data: contacts, error } = await query;

    if (error) throw error;

    return json(contacts || []);
  } catch (error) {
    return json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Require authentication for creating contacts
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const rawData = await request.json();

    // 🛡️ SECURE: Validate input data with Zod
    const validation = validateSchema(createContactSchema, rawData);
    if (!validation.success) {
      return json({ error: validation.error }, { status: 400 });
    }

    const contactData = validation.data;

    const { data: contact, error } = await supabaseAdmin
      .from("tf_contacts")
      .insert(contactData)
      .select()
      .single();

    if (error) throw error;

    return json(contact, { status: 201 });
  } catch (error) {
    return json({ error: "Failed to create contact" }, { status: 500 });
  }
};
