import { createCompanySchema, validateSchema } from "$lib/schemas/api";
import { supabaseAdmin } from "$lib/supabaseAdmin";
import { createRateLimitResponse, rateLimiters } from "$lib/utils/rateLimit";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Check session from cookies (set by hooks.server.ts)
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

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
      throw new Error(error.message);
    }

    return json(companies || []);
  } catch (error) {
    return json(
      {
        error: "Failed to fetch companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Check session from cookies (set by hooks.server.ts)
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

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
      throw error;
    }

    return json(company, { status: 201 });
  } catch (error) {
    return json(
      {
        error: "Failed to create company",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
