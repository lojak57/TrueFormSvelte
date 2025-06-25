/**
 * Core validation functions used across the application
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password strength and return errors
 */
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

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
}

/**
 * Check if password is strong (no errors)
 */
export function isStrongPassword(password: string): boolean {
  return validatePassword(password).length === 0;
}

/**
 * Validate phone number format (basic validation)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined || value === "") {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min?: number,
  max?: number,
  fieldName = "Field"
): string | null {
  const length = value?.length || 0;

  if (min !== undefined && length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }

  if (max !== undefined && length > max) {
    return `${fieldName} must be no more than ${max} characters`;
  }

  return null;
}

/**
 * Validate that two values match (e.g., password confirmation)
 */
export function validateMatch(
  value1: any,
  value2: any,
  fieldName = "Values"
): string | null {
  if (value1 !== value2) {
    return `${fieldName} do not match`;
  }
  return null;
}
