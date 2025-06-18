import { writable } from "svelte/store";

export interface ErrorMessage {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  dismissible: boolean;
  autoRemove?: number; // milliseconds
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface SystemError {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

// Global error store
export const errorMessages = writable<ErrorMessage[]>([]);

class ErrorService {
  private messageCounter = 0;

  // Main error handling method
  handleError(error: unknown, context?: string): ErrorMessage {
    const id = this.generateId();
    let errorMessage: ErrorMessage;

    if (this.isApiError(error)) {
      errorMessage = this.handleApiError(error, id);
    } else if (this.isValidationError(error)) {
      errorMessage = this.handleValidationError(error, id);
    } else if (this.isSystemError(error)) {
      errorMessage = this.handleSystemError(error, id, context);
    } else {
      errorMessage = this.handleUnknownError(error, id, context);
    }

    this.addMessage(errorMessage);
    return errorMessage;
  }

  // API Error Handling
  handleApiError(error: ApiError, id?: string): ErrorMessage {
    const errorId = id || this.generateId();
    let title = "Request Failed";
    let message =
      error.message || "An error occurred while processing your request.";

    // Customize based on status code
    switch (error.status) {
      case 400:
        title = "Invalid Request";
        message = "Please check your input and try again.";
        break;
      case 401:
        title = "Authentication Required";
        message = "Please log in to continue.";
        break;
      case 403:
        title = "Access Denied";
        message = "You don't have permission to perform this action.";
        break;
      case 404:
        title = "Not Found";
        message = "The requested resource could not be found.";
        break;
      case 429:
        title = "Too Many Requests";
        message = "Please wait a moment before trying again.";
        break;
      case 500:
        title = "Server Error";
        message = "Something went wrong on our end. Please try again later.";
        break;
      case 503:
        title = "Service Unavailable";
        message =
          "The service is temporarily unavailable. Please try again later.";
        break;
    }

    return {
      id: errorId,
      type: "error",
      title,
      message: error.message || message,
      timestamp: new Date(),
      dismissible: true,
      autoRemove: error.status >= 500 ? undefined : 8000, // Keep server errors visible
    };
  }

  // Validation Error Handling
  handleValidationError(error: ValidationError, id?: string): ErrorMessage {
    const errorId = id || this.generateId();

    return {
      id: errorId,
      type: "warning",
      title: "Validation Error",
      message: `${error.field}: ${error.message}`,
      timestamp: new Date(),
      dismissible: true,
      autoRemove: 6000,
    };
  }

  // System Error Handling
  handleSystemError(
    error: SystemError,
    id?: string,
    context?: string
  ): ErrorMessage {
    const errorId = id || this.generateId();

    // Log to console for debugging
    console.error("System Error:", error, context);

    return {
      id: errorId,
      type: "error",
      title: "System Error",
      message: context
        ? `An error occurred in ${context}. Please try again or contact support if the problem persists.`
        : "An unexpected error occurred. Please try again or contact support if the problem persists.",
      timestamp: new Date(),
      dismissible: true,
    };
  }

  // Unknown Error Handling
  handleUnknownError(
    error: unknown,
    id?: string,
    context?: string
  ): ErrorMessage {
    const errorId = id || this.generateId();

    console.error("Unknown Error:", error, context);

    return {
      id: errorId,
      type: "error",
      title: "Unexpected Error",
      message: "An unexpected error occurred. Please try again.",
      timestamp: new Date(),
      dismissible: true,
      autoRemove: 8000,
    };
  }

  // Success Messages
  showSuccess(message: string, title = "Success"): ErrorMessage {
    const id = this.generateId();
    const successMessage: ErrorMessage = {
      id,
      type: "success",
      title,
      message,
      timestamp: new Date(),
      dismissible: true,
      autoRemove: 5000,
    };

    this.addMessage(successMessage);
    return successMessage;
  }

  // Info Messages
  showInfo(message: string, title = "Information"): ErrorMessage {
    const id = this.generateId();
    const infoMessage: ErrorMessage = {
      id,
      type: "info",
      title,
      message,
      timestamp: new Date(),
      dismissible: true,
      autoRemove: 6000,
    };

    this.addMessage(infoMessage);
    return infoMessage;
  }

  // Warning Messages
  showWarning(message: string, title = "Warning"): ErrorMessage {
    const id = this.generateId();
    const warningMessage: ErrorMessage = {
      id,
      type: "warning",
      title,
      message,
      timestamp: new Date(),
      dismissible: true,
      autoRemove: 7000,
    };

    this.addMessage(warningMessage);
    return warningMessage;
  }

  // Message Management
  private addMessage(message: ErrorMessage): void {
    errorMessages.update((messages) => {
      const updated = [...messages, message];

      // Auto-remove if specified
      if (message.autoRemove) {
        setTimeout(() => {
          this.removeMessage(message.id);
        }, message.autoRemove);
      }

      return updated;
    });
  }

  removeMessage(id: string): void {
    errorMessages.update((messages) =>
      messages.filter((message) => message.id !== id)
    );
  }

  clearAll(): void {
    errorMessages.set([]);
  }

  // Type Guards
  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as any).status === "number"
    );
  }

  private isValidationError(error: unknown): error is ValidationError {
    return (
      typeof error === "object" &&
      error !== null &&
      "field" in error &&
      "message" in error
    );
  }

  private isSystemError(error: unknown): error is SystemError {
    return (
      error instanceof Error ||
      (typeof error === "object" &&
        error !== null &&
        "name" in error &&
        "message" in error)
    );
  }

  // Utility Methods
  private generateId(): string {
    return `error_${Date.now()}_${++this.messageCounter}`;
  }

  // Form Error Handling
  handleFormErrors(errors: FieldError[]): ErrorMessage[] {
    return errors.map((error) =>
      this.handleValidationError({
        field: error.field,
        message: error.message,
      })
    );
  }

  // Network Error Handling
  handleNetworkError(error: unknown): ErrorMessage {
    const id = this.generateId();

    return {
      id,
      type: "error",
      title: "Connection Error",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
      timestamp: new Date(),
      dismissible: true,
      autoRemove: 10000,
    };
  }

  // Retry Logic
  async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts) {
          break;
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }
}

// Export singleton instance
export const errorService = new ErrorService();

// Convenience functions
export const handleError = (error: unknown, context?: string) =>
  errorService.handleError(error, context);

export const showSuccess = (message: string, title?: string) =>
  errorService.showSuccess(message, title);

export const showInfo = (message: string, title?: string) =>
  errorService.showInfo(message, title);

export const showWarning = (message: string, title?: string) =>
  errorService.showWarning(message, title);

export const clearErrors = () => errorService.clearAll();

export const removeError = (id: string) => errorService.removeMessage(id);
