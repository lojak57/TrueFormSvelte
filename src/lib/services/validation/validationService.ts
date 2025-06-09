/**
 * Validation Service - TrueForm Application
 * 
 * Centralized validation service using Zod schemas for type-safe validation.
 * This service provides entity validation and parseOrThrow wrappers.
 */

import { z } from 'zod';
import type { 
  UserSession,
  LoginCredentials,
  Organization,
  BaseformLead,
  Invoice,
  WizardFormData,
  WizardValidationResult,
  ApiError
} from '$lib/types';

// ============================================================================
// ZOD SCHEMAS FOR DATABASE ENTITIES
// ============================================================================

export const UserSessionSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.string().optional(),
  organization_id: z.string().uuid().optional(),
});

export const LoginCredentialsSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .transform(email => email.trim().toLowerCase())
    .pipe(z.string().email('Please enter a valid email address')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
});

export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Organization name is required'),
  org_type: z.string().min(1, 'Organization type is required'),
  created_at: z.string().datetime(),
});

export const BaseformLeadSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  company_name: z.string().min(1, 'Company name is required'),
  contact_email: z.string().email('Please enter a valid email address'),
  contact_name: z.string().min(1, 'Contact name is required'),
  project_description: z.string().optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
  created_at: z.string().datetime(),
});

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  stripe_session_id: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['pending', 'paid', 'failed', 'refunded']),
  plan_type: z.enum(['starter', 'standard', 'pro']),
  created_at: z.string().datetime(),
  paid_at: z.string().datetime().optional(),
});

// ============================================================================
// WIZARD FORM VALIDATION SCHEMAS
// ============================================================================

export const WizardFormDataSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().optional(),
  
  // Project Details
  projectDescription: z.string().min(10, 'Please provide at least 10 characters of description'),
  websiteType: z.enum(['business', 'ecommerce', 'portfolio', 'blog', 'custom']),
  industry: z.string().optional(),
  
  // Features Selection
  features: z.array(z.any()), // Will be properly typed in Phase 3
  customFeatures: z.array(z.string()).optional(),
  
  // Design Preferences
  designStyle: z.enum(['modern', 'classic', 'minimal', 'creative', 'corporate']),
  colorPreferences: z.string().optional(),
  brandAssets: z.boolean(),
  logoUrl: z.string().url().optional(),
  
  // Timeline & Budget
  timeline: z.enum(['rush', 'standard', 'flexible']),
  budgetRange: z.enum(['starter', 'standard', 'pro', 'enterprise']),
  
  // Additional Requirements
  additionalNotes: z.string().optional(),
  copywriting: z.boolean(),
  seoOptimization: z.boolean(),
  
  // Metadata
  currentStep: z.enum(['introduction', 'basic-info', 'features', 'design', 'timeline', 'budget', 'summary']),
  completedSteps: z.array(z.enum(['introduction', 'basic-info', 'features', 'design', 'timeline', 'budget', 'summary'])),
  startedAt: z.string().datetime(),
  lastUpdatedAt: z.string().datetime(),
});

// ============================================================================
// VALIDATION SERVICE CLASS
// ============================================================================

export class ValidationService {
  /**
   * Parse and validate data with a Zod schema
   */
  parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw this.createValidationError(error);
      }
      throw error;
    }
  }

  /**
   * Safe parse that returns a result object
   */
  safeParse<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    error?: ApiError;
  } {
    try {
      const result = schema.safeParse(data);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { 
          success: false, 
          error: this.createValidationError(result.error) 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error
        }
      };
    }
  }

  /**
   * Validate wizard form data
   */
  validateWizardForm(data: Partial<WizardFormData>): WizardValidationResult {
    const result = WizardFormDataSchema.partial().safeParse(data);
    
    if (result.success) {
      return {
        isValid: true,
        errors: {},
        warnings: {}
      };
    }

    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    // Group Zod errors by field - take first error message per field
    result.error.errors.forEach(error => {
      const field = error.path.join('.');
      if (!errors[field]) {
        errors[field] = error.message;
      }
    });

    return {
      isValid: false,
      errors,
      warnings
    };
  }

  /**
   * Validate specific entity types
   */
  validateUserSession(data: unknown): UserSession {
    return this.parseOrThrow(UserSessionSchema, data);
  }

  validateLoginCredentials(data: unknown): LoginCredentials {
    return this.parseOrThrow(LoginCredentialsSchema, data);
  }

  validateOrganization(data: unknown): Organization {
    return this.parseOrThrow(OrganizationSchema, data);
  }

  validateBaseformLead(data: unknown): BaseformLead {
    return this.parseOrThrow(BaseformLeadSchema, data);
  }

  validateInvoice(data: unknown): Invoice {
    return this.parseOrThrow(InvoiceSchema, data);
  }

  /**
   * Create standardized validation error
   */
  private createValidationError(zodError: z.ZodError): ApiError {
    const fieldErrors = zodError.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message
    }));

    return {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: { fieldErrors }
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const validationService = new ValidationService();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

// Quick validation functions for common use cases
export const validateUserSession = (data: unknown) => 
  validationService.validateUserSession(data);

export const validateLoginCredentials = (data: unknown) => 
  validationService.validateLoginCredentials(data);

export const validateOrganization = (data: unknown) => 
  validationService.validateOrganization(data);

export const validateBaseformLead = (data: unknown) => 
  validationService.validateBaseformLead(data);

export const validateInvoice = (data: unknown) => 
  validationService.validateInvoice(data);

export const validateWizardForm = (data: Partial<WizardFormData>) => 
  validationService.validateWizardForm(data); 