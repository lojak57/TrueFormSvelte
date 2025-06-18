import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";

// Mock environment variables for testing
process.env.PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123";
process.env.STRIPE_SECRET_KEY = "sk_test_123";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123";
process.env.STRIPE_STARTER_PRICE = "9900";
process.env.STRIPE_STANDARD_PRICE = "19900";
process.env.STRIPE_PRO_PRICE = "39900";

// Mock IntersectionObserver for tests
(global as any).IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver for tests
(global as any).ResizeObserver = class MockResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock scrollTo for tests
(global as any).scrollTo = () => {};

// Suppress console.warn in tests unless explicitly needed
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (args[0]?.includes && args[0].includes("SvelteKit")) {
    return;
  }
  originalWarn(...args);
};

// Set up fake timers for consistent testing
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
