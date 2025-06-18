import { z } from "zod";

// Authentication schemas
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((email: string) => email.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const SignupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .transform((email: string) => email.trim().toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

// Contact form schema
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .transform((name: string) => name.trim()),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((email: string) => email.trim().toLowerCase()),
  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .transform((company: string | undefined) => company?.trim()),
  phone: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .transform((message: string) => message.trim()),
});

// Project request schema
export const ProjectRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .transform((name: string) => name.trim()),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((email: string) => email.trim().toLowerCase()),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters")
    .transform((company: string) => company.trim()),
  projectType: z.enum(
    [
      "marketing",
      "ecommerce",
      "booking",
      "saas",
      "portfolio",
      "membership",
      "realestate",
      "education",
      "restaurant",
      "other",
    ],
    {
      errorMap: () => ({ message: "Please select a project type" }),
    }
  ),
  budget: z.enum(
    ["under-1k", "1k-5k", "5k-10k", "10k-25k", "25k-plus", "not-sure"],
    {
      errorMap: () => ({ message: "Please select a budget range" }),
    }
  ),
  timeline: z.enum(
    ["asap", "1-month", "2-3-months", "3-6-months", "flexible"],
    {
      errorMap: () => ({ message: "Please select a timeline" }),
    }
  ),
  description: z
    .string()
    .min(1, "Project description is required")
    .min(20, "Please provide at least 20 characters describing your project")
    .max(2000, "Description must be less than 2000 characters")
    .transform((description: string) => description.trim()),
  features: z
    .array(z.string())
    .min(1, "Please select at least one feature")
    .optional(),
  hasExistingWebsite: z.boolean().optional(),
  existingWebsiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  additionalInfo: z
    .string()
    .max(1000, "Additional information must be less than 1000 characters")
    .optional()
    .transform((info: string | undefined) => info?.trim()),
});

// Newsletter subscription schema
export const NewsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((email: string) => email.trim().toLowerCase()),
});

// Password reset schema
export const PasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((email: string) => email.trim().toLowerCase()),
});

// Change password schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(
    (data: { newPassword: string; confirmNewPassword: string }) =>
      data.newPassword === data.confirmNewPassword,
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

// Type exports for use in components
export type LoginData = z.infer<typeof LoginSchema>;
export type SignupData = z.infer<typeof SignupSchema>;
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type ProjectRequestData = z.infer<typeof ProjectRequestSchema>;
export type NewsletterData = z.infer<typeof NewsletterSchema>;
export type PasswordResetData = z.infer<typeof PasswordResetSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

// Validation helper function
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
} {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.errors.forEach((err: z.ZodIssue) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: { general: ["An unexpected validation error occurred"] },
    };
  }
}

// Safe parsing with detailed error messages
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true as const,
      data: result.data,
      errors: null,
    };
  }

  // Transform Zod errors into a more usable format
  const fieldErrors: Record<string, string> = {};
  const globalErrors: string[] = [];

  result.error.errors.forEach((error: z.ZodIssue) => {
    if (error.path.length > 0) {
      const fieldName = error.path.join(".");
      fieldErrors[fieldName] = error.message;
    } else {
      globalErrors.push(error.message);
    }
  });

  return {
    success: false as const,
    data: null,
    errors: {
      fields: fieldErrors,
      global: globalErrors,
    },
  };
}
