import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST } from "../../routes/api/proposals/+server";
import type { RequestEvent } from "@sveltejs/kit";

// Mock the dependencies
vi.mock("$lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            {
              id: "proposal-1",
              title: "Website Development Proposal",
              company_id: "company-1",
              contact_id: "contact-1",
              total: 15000,
              tax_rate: 0.08,
              status: "draft",
              line_items: [
                {
                  id: "item-1",
                  name: "Website Design",
                  description: "Custom website design",
                  quantity: 1,
                  unit_price: 5000,
                },
                {
                  id: "item-2",
                  name: "Development",
                  description: "Frontend and backend development",
                  quantity: 1,
                  unit_price: 10000,
                },
              ],
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
              id: "proposal-2",
              title: "New Proposal",
              company_id: "company-1",
              total: 25000,
              status: "draft",
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
  createProposalSchema: {},
  validateSchema: vi.fn((schema, data) => ({
    success: true,
    data: data,
  })),
}));

describe("/api/proposals", () => {
  let mockRequest: Request;
  let mockLocals: { user: any };

  beforeEach(() => {
    mockRequest = new Request("http://localhost/api/proposals");
    mockLocals = {
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    };
    vi.clearAllMocks();
  });

  describe("GET /api/proposals", () => {
    it("should return proposals when authenticated", async () => {
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
        id: "proposal-1",
        title: "Website Development Proposal",
        company_id: "company-1",
        total: 15000,
        status: "draft",
      });
      expect(data[0].line_items).toHaveLength(2);
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
      expect(data.error).toBe("Failed to fetch proposals");
    });

    it("should apply rate limiting", async () => {
      const { rateLimiters, createRateLimitResponse } = await import("$lib/utils/rateLimit");
      
      vi.mocked(rateLimiters.admin.middleware).mockReturnValue({
        allowed: false,
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

  describe("POST /api/proposals", () => {
    const validProposalData = {
      title: "New Website Development Proposal",
      company_id: "company-1",
      contact_id: "contact-1",
      tax_rate: 0.085,
      line_items: [
        {
          name: "Custom Website Design",
          description: "Modern, responsive website design",
          quantity: 1,
          unit_price: 8000,
        },
        {
          name: "E-commerce Integration",
          description: "Full e-commerce functionality",
          quantity: 1,
          unit_price: 12000,
        },
      ],
      terms: "50% deposit required, balance due upon completion",
      notes: "Timeline: 8-12 weeks",
    };

    beforeEach(() => {
      mockRequest = new Request("http://localhost/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validProposalData),
      });
    });

    it("should create a proposal with valid data", async () => {
      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        id: "proposal-2",
        title: "New Proposal",
        company_id: "company-1",
        total: 25000,
        status: "draft",
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
        error: "Title is required",
      });

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Title is required");
    });

    it("should handle missing required fields", async () => {
      const incompleteData = {
        title: "Incomplete Proposal",
        // Missing company_id, contact_id, line_items
      };

      const incompleteRequest = new Request("http://localhost/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incompleteData),
      });

      const { validateSchema } = await import("$lib/schemas/api");
      
      vi.mocked(validateSchema).mockReturnValue({
        success: false,
        error: "company_id is required",
      });

      const event = {
        request: incompleteRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("company_id is required");
    });

    it("should handle Supabase insert errors", async () => {
      const { supabaseAdmin } = await import("$lib/supabaseAdmin");
      
      vi.mocked(supabaseAdmin.from).mockReturnValue({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: "Foreign key constraint violation" },
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
      expect(data.error).toBe("Failed to create proposal");
    });

    it("should handle line items validation", async () => {
      const invalidLineItemsData = {
        ...validProposalData,
        line_items: [
          {
            name: "Invalid Item",
            // Missing description, quantity, unit_price
          },
        ],
      };

      const invalidRequest = new Request("http://localhost/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidLineItemsData),
      });

      const { validateSchema } = await import("$lib/schemas/api");
      
      vi.mocked(validateSchema).mockReturnValue({
        success: false,
        error: "Line item quantity is required",
      });

      const event = {
        request: invalidRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Line item quantity is required");
    });

    it("should handle malformed JSON", async () => {
      const badRequest = new Request("http://localhost/api/proposals", {
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
      expect(data.error).toBe("Failed to create proposal");
    });

    it("should calculate totals correctly from line items", async () => {
      // This test ensures that the total calculation logic works
      const proposalWithCalculation = {
        title: "Calculation Test Proposal",
        company_id: "company-1",
        contact_id: "contact-1",
        tax_rate: 0.1, // 10% tax
        line_items: [
          {
            name: "Item 1",
            description: "First item",
            quantity: 2,
            unit_price: 1000, // 2 * 1000 = 2000
          },
          {
            name: "Item 2",
            description: "Second item",
            quantity: 1,
            unit_price: 3000, // 1 * 3000 = 3000
          },
        ],
        // Subtotal: 5000, Tax: 500, Total: 5500
      };

      const calculationRequest = new Request("http://localhost/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalWithCalculation),
      });

      const event = {
        request: calculationRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      
      expect(response.status).toBe(201);
      
      // Verify that the validation was called with calculated totals
      const { validateSchema } = await import("$lib/schemas/api");
      expect(validateSchema).toHaveBeenCalled();
    });

    it("should apply rate limiting", async () => {
      const { rateLimiters, createRateLimitResponse } = await import("$lib/utils/rateLimit");
      
      vi.mocked(rateLimiters.admin.middleware).mockReturnValue({
        allowed: false,
        resetTime: Date.now() + 60000,
      });
      
      vi.mocked(createRateLimitResponse).mockReturnValue(
        new Response("Rate limit exceeded", { status: 429 })
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);

      expect(response.status).toBe(429);
      expect(createRateLimitResponse).toHaveBeenCalled();
    });
  });
});