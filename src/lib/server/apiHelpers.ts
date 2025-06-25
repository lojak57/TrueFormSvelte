import type { User } from "@supabase/supabase-js";
import { json } from "@sveltejs/kit";

// Standard API error responses
export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Common error response creator
export function createErrorResponse(error: unknown, defaultMessage?: string) {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(
    {
      error: defaultMessage || "An unexpected error occurred",
    },
    { status: 500 }
  );
}

// Authentication middleware
export function requireAuth(user: User | null): asserts user is User {
  if (!user) {
    throw new APIError("Unauthorized", 401, "AUTH_REQUIRED");
  }
}

// Rate limiting helper
export function checkRateLimit(
  request: Request,
  rateLimiter: any,
  identifier?: string
) {
  const rateLimitResult = rateLimiter.middleware(request, identifier);
  if (!rateLimitResult.allowed) {
    throw new APIError(
      "Too many requests. Please try again later.",
      429,
      "RATE_LIMIT_EXCEEDED"
    );
  }
  return rateLimitResult;
}

// Request validation helper
export async function parseJSONBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new APIError("Invalid JSON in request body", 400, "INVALID_JSON");
  }
}

// Success response creator
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return json(data, { status });
}

// Validation helper
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
) {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new APIError(
      `Missing required fields: ${missing.join(", ")}`,
      400,
      "MISSING_FIELDS"
    );
  }
}

// Database error helper
export function handleDatabaseError(
  error: any,
  operation: string,
  resource: string
) {
  console.error(`Database error during ${operation} ${resource}:`, error);

  // Handle specific Supabase/PostgreSQL errors
  if (error.code === "23505") {
    // Unique constraint violation
    throw new APIError(`${resource} already exists`, 409, "DUPLICATE_RESOURCE");
  }

  if (error.code === "23503") {
    // Foreign key constraint violation
    throw new APIError(
      `Referenced ${resource} does not exist`,
      400,
      "INVALID_REFERENCE"
    );
  }

  if (error.code === "PGRST116") {
    // Row not found
    throw new APIError(`${resource} not found`, 404, "RESOURCE_NOT_FOUND");
  }

  throw new APIError(
    `Failed to ${operation} ${resource}`,
    500,
    "DATABASE_ERROR"
  );
}

// Standard CRUD error responses
export const CRUDErrors = {
  notFound: (resource: string) =>
    new APIError(`${resource} not found`, 404, "RESOURCE_NOT_FOUND"),

  createFailed: (resource: string) =>
    new APIError(`Failed to create ${resource}`, 500, "CREATE_FAILED"),

  updateFailed: (resource: string) =>
    new APIError(`Failed to update ${resource}`, 500, "UPDATE_FAILED"),

  deleteFailed: (resource: string) =>
    new APIError(`Failed to delete ${resource}`, 500, "DELETE_FAILED"),

  listFailed: (resource: string) =>
    new APIError(`Failed to list ${resource}`, 500, "LIST_FAILED"),
};
