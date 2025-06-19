import { createClient } from "@supabase/supabase-js";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const GET: RequestHandler = async ({ request }) => {
  // 🔒 SECURE: Require authentication for CRM data
  await requireAuth(request);
  try {
    const { data: companies, error } = await supabase
      .from("tf_companies")
      .select("*")
      .order("name");

    if (error) {
      console.error("Supabase error fetching companies:", error);
      throw new Error(error.message);
    }

    return json(companies || []);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return json(
      {
        error: "Failed to fetch companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  // 🔒 SECURE: Require authentication for creating companies
  await requireAuth(request);
  try {
    const dto = await request.json();

    // Validate required fields
    if (!dto.name || dto.name.trim() === "") {
      return json({ error: "Company name is required" }, { status: 400 });
    }

    // Prepare company data
    const companyData = {
      name: dto.name,
      website: dto.website || null,
      billing_street: dto.billing_street || null,
      billing_city: dto.billing_city || null,
      billing_state: dto.billing_state || null,
      billing_zip: dto.billing_zip || null,
      billing_country: dto.billing_country || null,
      notes: dto.notes || null,
      status: dto.status || "active",
      vertical_id: dto.vertical_id || null,
    };

    const { data: company, error } = await supabase
      .from("tf_companies")
      .insert(companyData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating company:", error);
      throw error;
    }

    return json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return json(
      {
        error: "Failed to create company",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
