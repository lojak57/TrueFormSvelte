import { z } from "zod";
import { validatePassword } from "./validators";

/**
 * Common field validation schemas
 */

// Email validation with normalization
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .transform((email: string) => email.trim().toLowerCase());

// Strong password validation
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine(
    (password) => validatePassword(password).length === 0,
    (password) => ({
      message: validatePassword(password)[0] || "Password is not strong enough",
    })
  );

// Basic password validation (for login)
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

// Name validation
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .transform((name: string) => name.trim());

// Phone validation
export const phoneSchema = z
  .string()
  .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number")
  .optional();

// URL validation
export const urlSchema = z.string().url("Please enter a valid URL").optional();

/**
 * Authentication schemas
 */

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const SignupSchema = z
  .object({
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: emailSchema,
});

export const ResetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Contact and company schemas
 */

export const ContactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export const CompanySchema = z.object({
  name: nameSchema,
  website: urlSchema,
  vertical_id: z.string().uuid().optional(),
  billing_street: z.string().max(200).optional(),
  billing_city: z.string().max(100).optional(),
  billing_state: z.string().max(50).optional(),
  billing_zip: z.string().max(20).optional(),
  billing_country: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
});

/**
 * User session schemas
 */

export const UserSessionSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  role: z.string(),
  organization_id: z.string().uuid().optional(),
});

/**
 * Export types from schemas
 */

export type LoginData = z.infer<typeof LoginSchema>;
export type SignupData = z.infer<typeof SignupSchema>;
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type CompanyData = z.infer<typeof CompanySchema>;
export type UserSessionData = z.infer<typeof UserSessionSchema>;
