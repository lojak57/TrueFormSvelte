/**
 * Unified formatting utilities for currency, dates, and numbers
 */

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";

/**
 * Format currency with comprehensive options support
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "USD",
  options?: Intl.NumberFormatOptions
): string {
  const locale = getLocaleForCurrency(currency);
  const decimalPlaces = getDecimalPlaces(currency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    ...options,
  }).format(amount);
}

/**
 * Format currency in compact notation (e.g., $1.2K)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: CurrencyCode = "USD"
): string {
  const locale = getLocaleForCurrency(currency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Format dates consistently across the application
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

/**
 * Format dates for display in lists (shorter format)
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format currency input by cleaning invalid characters
 */
export function formatCurrencyInput(value: string): string {
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, "");

  // Ensure only one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }

  // Limit decimal places to 2
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2);
  }

  return parts.join(".");
}

/**
 * Get appropriate locale for currency formatting
 */
export function getLocaleForCurrency(currency: CurrencyCode): string {
  switch (currency) {
    case "USD":
      return "en-US";
    case "EUR":
      return "de-DE";
    case "GBP":
      return "en-GB";
    case "CAD":
      return "en-CA";
    case "AUD":
      return "en-AU";
    case "JPY":
      return "ja-JP";
    default:
      return "en-US";
  }
}

/**
 * Get decimal places for currency
 */
export function getDecimalPlaces(currency: CurrencyCode): number {
  // JPY typically has 0 decimal places, others have 2
  switch (currency) {
    case "JPY":
      return 0;
    default:
      return 2;
  }
}
