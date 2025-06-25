import { z } from "zod";

/**
 * Validation helper functions
 */

/**
 * Generic schema validation with better error handling
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return { success: false, error: errorMessage };
    }
    return { success: false, error: "Validation failed" };
  }
}

/**
 * Safe validation that returns detailed error information
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): z.SafeParseReturnType<unknown, T> {
  return schema.safeParse(data);
}

/**
 * Transform validation errors into field-specific errors
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (path) {
      fieldErrors[path] = err.message;
    }
  });

  return fieldErrors;
}

/**
 * Create a validation result object
 */
export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Validate data and return structured result
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      data: result.data,
    };
  }

  return {
    isValid: false,
    errors: formatZodErrors(result.error),
    message: result.error.errors[0]?.message || "Validation failed",
  };
}

/**
 * Compose multiple validation functions
 */
export function composeValidators<T>(
  ...validators: Array<(data: T) => ValidationResult | null>
) {
  return (data: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator(data);
      if (result && !result.isValid) {
        return result;
      }
    }
    return { isValid: true, data };
  };
}
