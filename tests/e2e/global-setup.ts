import { chromium } from '@playwright/test';
import type { FullConfig } from '@playwright/test';

/**
 * Global Setup for Playwright E2E Tests
 * 
 * Handles:
 * - Environment variable validation
 * - Database seeding (if needed)
 * - Authentication token generation
 * - Global state preparation
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright Global Setup...');
  
  // Validate required environment variables
  validateEnvironment();
  
  // Setup authentication state
  await setupAuthentication(config);
  
  // Additional setup tasks
  await setupTestData();
  
  console.log('✅ Playwright Global Setup Complete!');
}

function validateEnvironment() {
  console.log('🔍 Validating environment variables...');
  
  const requiredEnvVars = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY',
    'PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    console.log('ℹ️  Using test defaults for E2E testing');
    
    // Set test defaults
    process.env.PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
    process.env.PUBLIC_SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
    process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_123';
  }
  
  console.log('✅ Environment validation complete');
}

async function setupAuthentication(config: FullConfig) {
  console.log('🔐 Setting up authentication states...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Create admin user session
    await setupAdminAuth(page, config);
    
    // Create regular user session  
    await setupUserAuth(page, config);
    
  } catch (error) {
    console.warn('⚠️  Authentication setup failed:', error);
    console.log('ℹ️  E2E tests will run without authentication');
  } finally {
    await browser.close();
  }
  
  console.log('✅ Authentication setup complete');
}

async function setupAdminAuth(page: any, config: FullConfig) {
  // Mock admin authentication for testing
  // In a real app, this would involve actual login flow
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5173';
  await page.goto(baseURL);
  
  // Store admin auth state
  await page.context().storageState({ 
    path: 'tests/e2e/auth/admin.json' 
  });
}

async function setupUserAuth(page: any, config: FullConfig) {
  // Mock user authentication for testing
  // In a real app, this would involve actual login flow
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5173';
  await page.goto(baseURL);
  
  // Store user auth state
  await page.context().storageState({ 
    path: 'tests/e2e/auth/user.json' 
  });
}

async function setupTestData() {
  console.log('📊 Setting up test data...');
  
  // In a real application, you might:
  // - Seed test database
  // - Create test users
  // - Set up test organizations
  // - Prepare test files
  
  // For now, we'll just create the auth directory structure
  await ensureDirectoryExists('tests/e2e/auth');
  
  console.log('✅ Test data setup complete');
}

async function ensureDirectoryExists(dirPath: string) {
  try {
    const fs = await import('fs/promises');
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

export default globalSetup; 