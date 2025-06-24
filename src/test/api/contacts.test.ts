import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../../routes/api/contacts/+server";

// Mock the dependencies
vi.mock("$lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          data: [
            {
              id: "contact-1",
              name: "John Doe",
              email: "john@example.com",
              phone: "555-0123",
              company_id: "company-1",
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
              id: "contact-1",
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "555-0456",
              company_id: "company-1",
              created_at: "2024-01-01T00:00:00Z",
            },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

vi.mock("$lib/schemas/api", () => ({
  createContactSchema: {},
  companyFilterSchema: {},
  validateSchema: vi.fn((schema, data) => ({
    success: true,
    data: data,
  })),
}));

describe("/api/contacts", () => {
  let mockRequest: Request;
  let mockLocals: { user: any };

  beforeEach(() => {
    mockRequest = new Request("http://localhost/api/contacts");
    mockLocals = {
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    };
    vi.clearAllMocks();
  });

  describe("GET /api/contacts", () => {
    it("should return contacts when authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: new URL("http://localhost/api/contacts"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        id: "contact-1",
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should filter by company_id when provided", async () => {
      const urlWithParams = new URL(
        "http://localhost/api/contacts?company_id=company-1"
      );
      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: urlWithParams,
      } as RequestEvent;

      const { supabaseAdmin } = await import("$lib/supabaseAdmin");
      const mockEq = vi.fn().mockReturnValue({
        data: [{ id: "contact-1", company_id: "company-1" }],
        error: null,
      });

      vi.mocked(supabaseAdmin.from).mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            eq: mockEq,
          })),
        })),
      } as any);

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockEq).toHaveBeenCalledWith("company_id", "company-1");
    });

    it("should filter by vertical_id when provided", async () => {
      const urlWithParams = new URL(
        "http://localhost/api/contacts?vertical_id=vertical-1"
      );
      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: urlWithParams,
      } as RequestEvent;

      const { supabaseAdmin } = await import("$lib/supabaseAdmin");
      const mockEq = vi.fn().mockReturnValue({
        data: [{ id: "contact-1", vertical_id: "vertical-1" }],
        error: null,
      });

      vi.mocked(supabaseAdmin.from).mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            eq: mockEq,
          })),
        })),
      } as any);

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockEq).toHaveBeenCalledWith("vertical_id", "vertical-1");
    });

    it("should return 401 when not authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: { user: null },
        url: new URL("http://localhost/api/contacts"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should handle validation errors for query parameters", async () => {
      const { validateSchema } = await import("$lib/schemas/api");

      vi.mocked(validateSchema).mockReturnValue({
        success: false,
        error: "Invalid company_id format",
      });

      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: new URL("http://localhost/api/contacts?company_id=invalid"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid company_id format");
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
        url: new URL("http://localhost/api/contacts"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch contacts");
    });
  });

  describe("POST /api/contacts", () => {
    const validContactData = {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-0456",
      company_id: "company-1",
      position: "Marketing Manager",
      notes: "Key decision maker for marketing initiatives",
    };

    beforeEach(() => {
      mockRequest = new Request("http://localhost/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validContactData),
      });
    });

    it("should create a contact with valid data", async () => {
      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        id: "contact-1",
        name: "Jane Smith",
        email: "jane@example.com",
        company_id: "company-1",
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
        error: "Email is required",
      });

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email is required");
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
      expect(data.error).toBe("Failed to create contact");
    });

    it("should handle malformed JSON", async () => {
      const badRequest = new Request("http://localhost/api/contacts", {
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
      expect(data.error).toBe("Failed to create contact");
    });
  });
});
