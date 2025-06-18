import type { CurrencyCode } from "./money";

/**
 * Currency Formatting and Localization Utilities
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

export function getDecimalPlaces(currency: CurrencyCode): number {
  // JPY typically has 0 decimal places, others have 2
  switch (currency) {
    case "JPY":
      return 0;
    default:
      return 2;
  }
}
