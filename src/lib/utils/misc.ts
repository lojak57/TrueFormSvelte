/**
 * Miscellaneous utility functions
 */

/**
 * Generate a random ID with optional prefix
 */
export function generateId(prefix = ""): string {
  const id = Math.random().toString(36).substring(2, 11);
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Generate a more secure random ID using crypto if available
 */
export function generateSecureId(prefix = ""): string {
  let id: string;

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // Use crypto for better randomness
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    id = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  } else {
    // Fallback to Math.random
    id = Math.random().toString(36).substring(2, 11);
  }

  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone an object (simple implementation)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Get a nested object property safely
 */
export function getNestedProperty(
  obj: any,
  path: string,
  defaultValue?: any
): any {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }

  return current;
}

/**
 * Create a download from blob data
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
