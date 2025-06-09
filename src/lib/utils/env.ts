import { browser } from '$app/environment';

// Environment validation with proper error handling
export function validateEnv() {
  const requiredEnvVars = {
    PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
  };

  const missing: string[] = [];
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    
    if (!browser) {
      // Server-side: log and throw
      console.error('🚨 Environment Configuration Error:', error);
      console.error('💡 Create a .env.local file with the required variables');
      throw new Error(error);
    } else {
      // Client-side: warn but don't crash
      console.warn('⚠️ Environment Configuration Warning:', error);
    }
  }

  return true;
}

// Safe getter for environment variables
export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];
  
  if (!value) {
    if (fallback !== undefined) {
      console.warn(`⚠️ Using fallback for missing env var: ${name}`);
      return fallback;
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value;
}

// Typed environment variables
export const ENV = {
  SUPABASE_URL: getEnvVar('PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('PUBLIC_SUPABASE_ANON_KEY'),
  APP_URL: getEnvVar('PUBLIC_APP_URL', 'http://localhost:5173'),
} as const;

// Validate on module load
validateEnv(); 