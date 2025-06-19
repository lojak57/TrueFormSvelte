import { z } from "zod";
import type { LoginCredentials, UserSession, WizardFormData } from "$lib/types";

// Simple email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Simple password validation
export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return errors;
}

// Zod schemas
export const UserSessionSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.string(),
  organization_id: z.string().uuid().optional(),
});

export const LoginCredentialsSchema = z.object({
  email: z.string().transform(str => str.trim().toLowerCase()).pipe(z.string().email()),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .refine(
      (password) => /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password),
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const WizardFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  contactEmail: z.string().email("Please enter a valid email address").optional(),
  websiteType: z.enum(["business", "ecommerce", "portfolio", "blog"]).optional(),
}).partial();

// Basic form validation schemas
export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url().optional().or(z.literal("")),
  vertical_id: z.string().uuid().optional(),
});

export const ContactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().or(z.literal("")),
  company_id: z.string().uuid().optional(),
});

// Validation functions required by tests
export function validateUserSession(data: unknown): UserSession {
  try {
    return UserSessionSchema.parse(data);
  } catch (error) {
    throw new Error("Validation failed");
  }
}

export function validateLoginCredentials(data: unknown): LoginCredentials {
  try {
    return LoginCredentialsSchema.parse(data);
  } catch (error) {
    throw new Error("Validation failed");
  }
}

export function validateWizardForm(data: Partial<WizardFormData>): { isValid: boolean; errors: Record<string, string> } {
  try {
    WizardFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation failed" } };
  }
}

// Validation service with safe parse functionality
export const validationService = {
  safeParse<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: { code: string; message: string } } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: { 
          code: "VALIDATION_ERROR", 
          message: error instanceof z.ZodError ? error.message : "Validation failed" 
        } 
      };
    }
  }
};
