/**
 * Text utility functions for consistent text processing across the application
 */

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
 * Generate company initials (optimized for business names)
 */
export function generateCompanyInitials(
  companyName: string | null | undefined,
  maxInitials: number = 2
): string {
  if (!companyName?.trim()) {
    return "?";
  }

  // Remove common business suffixes and articles
  const cleanName = companyName
    .replace(
      /\b(Inc|LLC|Corp|Ltd|Company|Co|Solutions|Services|Group|Associates|Partners)\b\.?/gi,
      ""
    )
    .replace(/\b(The|A|An|Of|And|&)\b\s*/gi, "")
    .trim();

  return generateInitials(cleanName, maxInitials);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate text at word boundary
 */
export function truncateAtWord(
  text: string | null | undefined,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength - suffix.length);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + suffix;
  }

  return truncated + suffix;
}

/**
 * Convert text to title case
 */
export function toTitleCase(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert text to sentence case
 */
export function toSentenceCase(text: string | null | undefined): string {
  if (!text) return "";

  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/**
 * Convert camelCase or PascalCase to readable text
 */
export function camelToReadable(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Convert snake_case or kebab-case to readable text
 */
export function snakeToReadable(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Clean and normalize text for search/comparison
 */
export function normalizeForSearch(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Extract domain from email address
 */
export function extractEmailDomain(email: string | null | undefined): string {
  if (!email) return "";

  const match = email.match(/@([^@]+)$/);
  return match ? match[1].toLowerCase() : "";
}

/**
 * Generate a slug from text (URL-friendly)
 */
export function generateSlug(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Count words in text
 */
export function countWords(text: string | null | undefined): number {
  if (!text) return 0;

  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(
  text: string | null | undefined,
  wordsPerMinute: number = 200
): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(
  text: string,
  searchTerm: string,
  highlightClass: string = "bg-yellow-200"
): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}
