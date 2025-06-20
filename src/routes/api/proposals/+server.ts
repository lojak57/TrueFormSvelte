import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { z } from 'zod';
import { supabaseAdmin } from "$lib/supabaseAdmin";
import { rateLimiters, createRateLimitResponse } from "$lib/utils/rateLimit";

// Schema for validating the incoming request body for creating a proposal
const createProposalRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  company_id: z.string().uuid("Invalid company ID"),
  contact_id: z.string().uuid("Invalid contact ID").optional(),
  tax_rate: z.number().min(0).max(1).optional().default(0),
  line_items: z.array(z.object({
    name: z.string().min(1, "Line item name is required"),
    description: z.string().optional(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be non-negative"),
  })).min(1, "At least one line item is required"),
  notes: z.string().optional(),
});

export const GET: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Rate limiting and authentication
  const limit = rateLimiters.admin.middleware(request);
  if (!limit.allowed) return createRateLimitResponse(limit.resetTime);
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

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

export const POST: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Rate limiting and authentication
  const limit = rateLimiters.admin.middleware(request);
  if (!limit.allowed) return createRateLimitResponse(limit.resetTime);
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  try {
    const requestData = await request.json();

    // ✅ VALIDATE: Use Zod to validate the request body
    const validationResult = createProposalRequestSchema.safeParse(requestData);
    if (!validationResult.success) {
      return json({ error: "Invalid input", details: validationResult.error.flatten() }, { status: 400 });
    }

    const { line_items, tax_rate, ...restOfProposal } = validationResult.data;

    // 💰 CALCULATE: Server-side calculation of totals
    const subtotal = line_items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * tax_rate;
    const total = subtotal + tax;

    const dbData = {
      ...restOfProposal,
      line_items, // Storing line items as JSONB
      subtotal,
      tax,
      tax_rate,
      total,
      status: "draft", // Default status
    };

    // 🚀 EXECUTE: Insert into database using admin client
    const { data: proposal, error } = await supabaseAdmin
      .from("tf_proposals")
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating proposal:", error);
      return json({ error: "Failed to create proposal", details: error.message }, { status: 500 });
    }

    return json(proposal, { status: 201 });
  } catch (error) {
    console.error("Unhandled error creating proposal:", error);
    return json({ error: "An unexpected error occurred" }, { status: 500 });
  }
};
