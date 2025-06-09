import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - TrueForm E2E Testing
 * 
 * Comprehensive E2E testing setup covering:
 * - Multiple browsers (Chrome, Firefox, Safari)
 * - Mobile and desktop viewports
 * - Local development and CI environments
 * - Visual regression testing
 * - Performance monitoring
 */

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Test file patterns
  testMatch: '**/*.e2e.{js,ts}',
  
  // Global test timeout
  timeout: 30000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // Global test setup
  use: {
    // Base URL for tests
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot only when test fails
    screenshot: 'only-on-failure',
    
    // Capture video on failure
    video: 'retain-on-failure',
    
    // Global test timeout
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 15000,
    
    // Accept downloads
    acceptDownloads: true,
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Test output directory
  outputDir: 'test-results/',

  // Projects for different browsers and devices
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    // Mobile Devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },

    // High DPI
    {
      name: 'Desktop Chrome HiDPI',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2,
      },
    },
  ],

  // Development server configuration
  webServer: process.env.CI ? {
    // Production build for CI
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : {
    // Development server for local testing
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
    timeout: 120000,
  },

  // Global setup for tests (disabled during initial setup)
  // globalSetup: './tests/e2e/global-setup.ts',
  
  // Global teardown
  // globalTeardown: './tests/e2e/global-teardown.ts',
}); 