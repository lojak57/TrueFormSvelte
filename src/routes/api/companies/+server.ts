import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";
import { rateLimiters, createRateLimitResponse } from "$lib/utils/rateLimit";
import { supabaseAdmin } from "$lib/supabaseAdmin";
import { createCompanySchema, validateSchema } from "$lib/schemas/api";

export const GET: RequestHandler = async ({ request }) => {
  // 🔒 SECURE: Require authentication for CRM data
  await requireAuth(request);
  
  // Apply rate limiting for admin endpoints
  const rateLimitResult = rateLimiters.admin.middleware(request);
  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult.resetTime);
  }
  try {
    const { data: companies, error } = await supabaseAdmin
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
  
  // Apply rate limiting for admin endpoints
  const rateLimitResult = rateLimiters.admin.middleware(request);
  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult.resetTime);
  }
  try {
    const rawData = await request.json();

    // 🛡️ SECURE: Validate input data with Zod
    const validation = validateSchema(createCompanySchema, rawData);
    if (!validation.success) {
      return json({ error: validation.error }, { status: 400 });
    }

    const companyData = validation.data;

    const { data: company, error } = await supabaseAdmin
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
