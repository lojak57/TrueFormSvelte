import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../../routes/api/companies/+server";

// Mock the dependencies
vi.mock("$lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            {
              id: "company-1",
              name: "Test Company",
              email: "test@company.com",
              phone: "555-0123",
              created_at: "2024-01-01T00:00:00Z",
            },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: "company-1",
              name: "New Test Company",
              email: "new@company.com",
              phone: "555-0456",
              created_at: "2024-01-01T00:00:00Z",
            },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

vi.mock("$lib/utils/rateLimit", () => ({
  rateLimiters: {
    admin: {
      middleware: vi.fn(() => ({ allowed: true })),
    },
  },
  createRateLimitResponse: vi.fn(),
}));

vi.mock("$lib/schemas/api", () => ({
  createCompanySchema: {},
  validateSchema: vi.fn((schema, data) => ({
    success: true,
    data: data,
  })),
}));

describe("/api/companies", () => {
  let mockRequest: Request;
  let mockLocals: { user: any };

  beforeEach(() => {
    mockRequest = new Request("http://localhost/api/companies");
    mockLocals = {
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    };
    vi.clearAllMocks();
  });

  describe("GET /api/companies", () => {
    it("should return companies when authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        id: "company-1",
        name: "Test Company",
        email: "test@company.com",
      });
    });

    it("should return 401 when not authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: { user: null },
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should handle database errors", async () => {
      // Mock Supabase error
      const { supabaseAdmin } = await import("$lib/supabaseAdmin");
      vi.mocked(supabaseAdmin.from).mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: null,
            error: { message: "Database connection error" },
          })),
        })),
      } as any);

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch companies");
    });

    it("should apply rate limiting", async () => {
      const { rateLimiters, createRateLimitResponse } = await import(
        "$lib/utils/rateLimit"
      );

      vi.mocked(rateLimiters.admin.middleware).mockReturnValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
      });

      vi.mocked(createRateLimitResponse).mockReturnValue(
        new Response("Rate limit exceeded", { status: 429 })
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await GET(event);

      expect(response.status).toBe(429);
      expect(createRateLimitResponse).toHaveBeenCalled();
    });
  });

  describe("POST /api/companies", () => {
    const validCompanyData = {
      name: "New Test Company",
      email: "new@company.com",
      phone: "555-0456",
      website: "https://company.com",
      address: "123 Test St",
      vertical_id: "vertical-1",
    };

    beforeEach(() => {
      mockRequest = new Request("http://localhost/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validCompanyData),
      });
    });

    it("should create a company with valid data", async () => {
      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        id: "company-1",
        name: "New Test Company",
        email: "new@company.com",
      });
    });

    it("should return 401 when not authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: { user: null },
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should validate input data with Zod schema", async () => {
      const { validateSchema } = await import("$lib/schemas/api");

      vi.mocked(validateSchema).mockReturnValue({
        success: false,
        error: "Invalid email format",
      });

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid email format");
    });

    it("should handle Supabase insert errors", async () => {
      const { supabaseAdmin } = await import("$lib/supabaseAdmin");

      vi.mocked(supabaseAdmin.from).mockReturnValue({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: "Unique constraint violation" },
            })),
          })),
        })),
      } as any);

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create company");
      expect(data.details).toBe("Unique constraint violation");
    });

    it("should handle malformed JSON", async () => {
      const badRequest = new Request("http://localhost/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      const event = {
        request: badRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create company");
    });
  });
});
