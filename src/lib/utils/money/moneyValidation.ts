/**
 * Money Input Validation Utilities
 */

export interface MoneyValidationResult {
  isValid: boolean;
  error?: string;
  amount?: number;
}

export function validateMoneyInput(value: string): MoneyValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "Amount is required" };
  }

  const cleanValue = value.replace(/[^\d.-]/g, "");
  const amount = parseFloat(cleanValue);

  if (isNaN(amount)) {
    return { isValid: false, error: "Invalid amount format" };
  }

  if (amount < 0) {
    return { isValid: false, error: "Amount cannot be negative" };
  }

  if (amount > 999999.99) {
    return { isValid: false, error: "Amount is too large" };
  }

  return { isValid: true, amount };
}

export function isValidCurrencyAmount(value: number): boolean {
  return !isNaN(value) && isFinite(value) && value >= 0;
}

export function normalizeMoneyInput(value: string): string {
  // Remove currency symbols and spaces
  return value.replace(/[^\d.-]/g, "").trim();
}
