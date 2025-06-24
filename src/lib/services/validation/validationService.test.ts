import type { LoginCredentials, UserSession, WizardFormData } from "$lib/types";
import { describe, expect, it } from "vitest";
import {
  LoginCredentialsSchema,
  validateLoginCredentials,
  validateUserSession,
  validateWizardForm,
  validationService,
} from "./validationService";

describe("ValidationService", () => {
  describe("User Session Validation", () => {
    it("should validate correct user session data", () => {
      const validData: UserSession = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        role: "admin",
        organization_id: "123e4567-e89b-12d3-a456-426614174001",
      };

      const result = validateUserSession(validData);
      expect(result).toEqual(validData);
    });

    it("should reject invalid user session data", () => {
      const invalidData = {
        id: "invalid-uuid",
        email: "invalid-email",
        role: "admin",
      };

      expect(() => validateUserSession(invalidData)).toThrow();
    });
  });

  describe("Login Credentials Validation", () => {
    it("should validate correct login credentials", () => {
      const validData = {
        email: "  TEST@EXAMPLE.COM  ",
        password: "StrongPassword123",
      };

      const result = validateLoginCredentials(validData);
      expect(result.email).toBe("test@example.com"); // Should be trimmed and lowercased
      expect(result.password).toBe("StrongPassword123");
    });

    it("should reject weak passwords", () => {
      const invalidData = {
        email: "test@example.com",
        password: "weak",
      };

      // The validation service throws a generic "Validation failed" error
      // that wraps the specific Zod validation errors
      expect(() => validateLoginCredentials(invalidData)).toThrow(
        "Validation failed"
      );
    });

    it("should reject invalid email addresses", () => {
      const invalidData = {
        email: "invalid-email",
        password: "StrongPassword123",
      };

      expect(() => validateLoginCredentials(invalidData)).toThrow(
        "Validation failed"
      );
    });
  });

  describe("Wizard Form Validation", () => {
    it("should validate partial wizard form data", () => {
      const partialData: Partial<WizardFormData> = {
        companyName: "Test Company",
        contactEmail: "test@example.com",
        websiteType: "business",
      };

      const result = validateWizardForm(partialData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("should return validation errors for invalid data", () => {
      const invalidData: Partial<WizardFormData> = {
        companyName: "", // Required field empty
        contactEmail: "invalid-email",
        websiteType: "business",
      };

      const result = validateWizardForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("companyName");
      expect(result.errors).toHaveProperty("contactEmail");
    });
  });

  describe("Safe Parse Functionality", () => {
    it("should return success for valid data", () => {
      const validData: LoginCredentials = {
        email: "test@example.com",
        password: "StrongPassword123",
      };

      const result = validationService.safeParse(
        LoginCredentialsSchema,
        validData
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(
          expect.objectContaining({
            email: "test@example.com",
            password: "StrongPassword123",
          })
        );
      }
    });

    it("should return error for invalid data", () => {
      const invalidData = {
        email: "invalid-email",
        password: "weak",
      };

      const result = validationService.safeParse(
        LoginCredentialsSchema,
        invalidData
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe("VALIDATION_ERROR");
      }
    });
  });
});
