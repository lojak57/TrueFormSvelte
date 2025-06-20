import { supabase } from "$lib/supabaseClient";
import type { AuthResponse, LoginCredentials, UserSession } from "$lib/types";
import { AuthError, handleError, logError } from "$lib/utils/errors";

export interface SignupCredentials extends LoginCredentials {
  confirmPassword?: string;
}

// Validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): string[] {
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

  return errors;
}

// Auth service functions
export async function loginUser({
  email,
  password,
}: LoginCredentials): Promise<AuthResponse> {
  try {
    // Validation
    if (!email || !password) {
      throw new AuthError("Email and password are required");
    }

    if (!validateEmail(email)) {
      throw new AuthError("Please enter a valid email address");
    }

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      logError(error, "login");
      throw error;
    }

    if (!data.user) {
      throw new AuthError("Login failed. Please try again.");
    }

    // Transform to our UserSession format
    const userSession: UserSession = {
      id: data.user.id,
      email: data.user.email || "",
      role: data.user.user_metadata?.role,
      organization_id: data.user.user_metadata?.organization_id,
    };

    return {
      success: true,
      user: userSession,
      error: undefined,
    };
  } catch (error) {
    const appError = handleError(error);
    return {
      success: false,
      user: undefined,
      error: appError.message,
    };
  }
}

export async function signupUser({
  email,
  password,
  confirmPassword,
}: SignupCredentials): Promise<AuthResponse> {
  try {
    // Validation
    if (!email || !password) {
      throw new AuthError("Email and password are required");
    }

    if (!validateEmail(email)) {
      throw new AuthError("Please enter a valid email address");
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      throw new AuthError(passwordErrors.join(". "));
    }

    if (confirmPassword && password !== confirmPassword) {
      throw new AuthError("Passwords do not match");
    }

    // Attempt signup
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          // Add any default user metadata here
        },
      },
    });

    if (error) {
      logError(error, "signup");
      throw error;
    }

    // Note: User might need email confirmation
    return {
      success: true,
      user: undefined,
      error: undefined,
    };
  } catch (error) {
    const appError = handleError(error);
    return {
      success: false,
      user: undefined,
      error: appError.message,
    };
  }
}

export async function logoutUser(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logError(error, "logout");
      throw error;
    }

    return { error: null };
  } catch (error) {
    const appError = handleError(error);
    return { error: appError.message };
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      role: data.user.user_metadata?.role,
      organization_id: data.user.user_metadata?.organization_id,
    };
  } catch (error) {
    logError(error, "getCurrentUser");
    return null;
  }
}

export async function resetPassword(
  email: string
): Promise<{ error: string | null }> {
  try {
    if (!email || !validateEmail(email)) {
      throw new AuthError("Please enter a valid email address");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      logError(error, "resetPassword");
      throw error;
    }

    return { error: null };
  } catch (error) {
    const appError = handleError(error);
    return { error: appError.message };
  }
}
