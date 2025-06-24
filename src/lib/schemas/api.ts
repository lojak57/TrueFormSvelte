import { z } from "zod";

// Company schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  website: z.string().url().optional().or(z.literal("")),
  billing_street: z.string().max(255).optional(),
  billing_city: z.string().max(100).optional(),
  billing_state: z.string().max(50).optional(),
  billing_zip: z.string().max(20).optional(),
  billing_country: z.string().max(100).optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  vertical_id: z.string().uuid().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

// Contact schemas
export const createContactSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional(),
  title: z.string().max(100).optional(),
  company_id: z.string().uuid("Invalid company ID"),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const updateContactSchema = createContactSchema.partial();

// Contact interaction schema
export const createInteractionSchema = z.object({
  interaction: z.object({
    type: z.enum(["email", "call", "meeting", "demo", "proposal"]),
    subject: z.string().min(1, "Subject is required").max(255),
    notes: z.string().optional(),
    created_at: z.string().datetime().optional(),
  }),
});

// Proposal schemas
export const createProposalSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  company_id: z.string().uuid("Invalid company ID"),
  contact_id: z.string().uuid("Invalid contact ID"),
  description: z.string().optional(),
  subtotal: z.number().min(0, "Subtotal must be non-negative"),
  tax_rate: z.number().min(0).max(1, "Tax rate must be between 0 and 1"),
  tax_amount: z.number().min(0, "Tax amount must be non-negative"),
  total: z.number().min(0, "Total must be non-negative"),
  status: z.enum(["draft", "sent", "accepted", "rejected"]).default("draft"),
  valid_until: z.string().datetime().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

export const updateProposalSchema = createProposalSchema.partial();

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(255),
  description: z.string().optional(),
  company_id: z.string().uuid("Invalid company ID"),
  project_type: z.string().max(100),
  status: z
    .enum(["planning", "active", "on_hold", "completed", "cancelled"])
    .default("planning"),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  budget: z.number().min(0, "Budget must be non-negative").optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("50"),
});

export const companyFilterSchema = z.object({
  company_id: z.string().uuid().optional(),
  vertical_id: z.string().uuid().optional(),
});

export const catalogFilterSchema = z
  .object({
    category: z.string().optional(),
    search: z.string().optional(),
    is_active: z
      .string()
      .transform((val) => val === "true")
      .optional(),
  })
  .merge(paginationSchema);

// Validation helper
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      };
    }
    return { success: false, error: "Invalid data format" };
  }
}
