/**
 * Unified text utility functions for consistent text processing
 */

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Alias for truncate for backward compatibility
 */
export const truncateText = truncate;

/**
 * Capitalize first letter of each word (title case)
 */
export function titleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Alias for titleCase for backward compatibility
 */
export const toTitleCase = titleCase;

/**
 * Generate initials from a name string
 * Handles both single names and full names
 */
export function generateInitials(
  name: string | null | undefined,
  maxInitials: number = 2
): string {
  if (!name?.trim()) {
    return "?";
  }

  const words = name.trim().split(/\s+/);

  // For single word, take first two characters
  if (words.length === 1) {
    const word = words[0];
    return word.length >= 2
      ? word.substring(0, 2).toUpperCase()
      : word.charAt(0).toUpperCase();
  }

  // For multiple words, take first letter of each word up to maxInitials
  return words
    .slice(0, maxInitials)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/**
 * Generate initials from separate first and last name
 */
export function generatePersonInitials(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const first = firstName?.trim();
  const last = lastName?.trim();

  if (first && last) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  if (first) {
    return generateInitials(first);
  }

  if (last) {
    return generateInitials(last);
  }

  return "?";
}

/**
 * Convert string to slug format (lowercase, hyphenated)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Extract domain from email address
 */
export function extractEmailDomain(email: string): string {
  const atIndex = email.indexOf("@");
  return atIndex > -1 ? email.substring(atIndex + 1) : "";
}

/**
 * Mask sensitive information (e.g., email, phone)
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  const maskedLocal =
    localPart.length > 2
      ? localPart.charAt(0) +
        "*".repeat(localPart.length - 2) +
        localPart.charAt(localPart.length - 1)
      : localPart;

  return `${maskedLocal}@${domain}`;
}
