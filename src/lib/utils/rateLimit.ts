/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimitStore {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key);
    if (entry && entry.resetTime < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

const rateLimitStore = new RateLimitStore();

/**
 * Rate limiting middleware for API endpoints
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    maxRequests,
    windowMs,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  const rateLimiter = {
    check: (
      identifier: string
    ): { allowed: boolean; remaining: number; resetTime: number } => {
      const now = Date.now();
      const resetTime = now + windowMs;

      const existing = rateLimitStore.get(identifier);

      if (!existing) {
        // First request in window
        rateLimitStore.set(identifier, { count: 1, resetTime });
        return { allowed: true, remaining: maxRequests - 1, resetTime };
      }

      if (existing.count >= maxRequests) {
        // Rate limit exceeded
        return { allowed: false, remaining: 0, resetTime: existing.resetTime };
      }

      // Increment count
      existing.count++;
      rateLimitStore.set(identifier, existing);

      return {
        allowed: true,
        remaining: maxRequests - existing.count,
        resetTime: existing.resetTime,
      };
    },

    // For use in server-side handlers
    middleware: (request: Request, response?: Response) => {
      const identifier = getClientIdentifier(request);
      const result = rateLimiter.check(identifier);

      if (response) {
        // Set rate limit headers
        response.headers.set("X-RateLimit-Limit", maxRequests.toString());
        response.headers.set(
          "X-RateLimit-Remaining",
          result.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          new Date(result.resetTime).toISOString()
        );
      }

      return result;
    },
  };

  return rateLimiter;
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (proxy-aware)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  // Use the first IP from forwarded header, or fallback to other headers
  const ip =
    forwarded?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown";

  // For authenticated requests, you might want to use user ID instead
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    // Simple hash of auth header to create consistent identifier
    const userId = btoa(authHeader).slice(0, 16);
    return `user:${userId}`;
  }

  return `ip:${ip}`;
}

/**
 * Pre-configured rate limiters for different endpoint types
 */
export const rateLimiters = {
  // Public API endpoints - more restrictive
  public: rateLimit({
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),

  // Authentication endpoints - very restrictive
  auth: rateLimit({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),

  // Admin endpoints - moderate restrictions
  admin: rateLimit({
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),

  // Form submissions - restrictive
  forms: rateLimit({
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  }),

  // File uploads - very restrictive
  uploads: rateLimit({
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  }),
};

/**
 * Helper function to create rate limit response
 */
export function createRateLimitResponse(resetTime: number): Response {
  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
      resetTime: new Date(resetTime).toISOString(),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
        "X-RateLimit-Reset": new Date(resetTime).toISOString(),
      },
    }
  );
}

// Cleanup on process exit
if (typeof process !== "undefined") {
  process.on("exit", () => {
    rateLimitStore.destroy();
  });
}
