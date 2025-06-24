// Custom error classes for better error handling
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";

    // Maintain proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: any) {
    super(message, "AUTH_ERROR", 401, details);
    this.name = "AuthError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: any) {
    super(message, "NETWORK_ERROR", 500, details);
    this.name = "NetworkError";
  }
}

// Error handler utility
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle Supabase auth errors
    if (error.message.includes("Invalid login credentials")) {
      return new AuthError(
        "Invalid email or password. Please check your credentials and try again."
      );
    }

    if (error.message.includes("Email not confirmed")) {
      return new AuthError(
        "Please check your email and click the confirmation link before signing in."
      );
    }

    if (error.message.includes("network") || error.message.includes("fetch")) {
      return new NetworkError(
        "Network error. Please check your connection and try again."
      );
    }

    return new AppError(error.message, "UNKNOWN_ERROR", 500);
  }

  // Fallback for unknown error types
  return new AppError(
    "An unexpected error occurred. Please try again later.",
    "UNKNOWN_ERROR",
    500
  );
}

// User-friendly error messages
export function getErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
}

// Error logging utility (can be extended to send to monitoring service)
export function logError(error: unknown, context?: string) {
  const appError = handleError(error);

  // TODO: Send to monitoring service like Sentry
  // Sentry.captureException(appError);

  // In production, avoid logging sensitive error details to console
  // Instead, send to a proper error monitoring service
}
