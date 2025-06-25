import { createCompanySchema, validateSchema } from "$lib/schemas/api";
import {
  checkRateLimit,
  createErrorResponse,
  createSuccessResponse,
  handleDatabaseError,
  parseJSONBody,
  requireAuth,
} from "$lib/server/apiHelpers";
import { supabaseAdmin } from "$lib/supabaseAdmin";
import { rateLimiters } from "$lib/utils/rateLimit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, locals }) => {
  try {
    requireAuth(locals.user);
    checkRateLimit(request, rateLimiters.admin);

    const { data: companies, error } = await supabaseAdmin
      .from("tf_companies")
      .select("*")
      .order("name");

    if (error) {
      handleDatabaseError(error, "fetch", "companies");
    }

    return createSuccessResponse(companies || []);
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch companies");
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    requireAuth(locals.user);
    checkRateLimit(request, rateLimiters.admin);

    const rawData = await parseJSONBody(request);

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
      handleDatabaseError(error, "create", "company");
    }

    return createSuccessResponse(company, 201);
  } catch (error) {
    return createErrorResponse(error, "Failed to create company");
  }
};
