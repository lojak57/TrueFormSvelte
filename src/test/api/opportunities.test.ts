import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, PATCH, POST } from "../../routes/api/opportunities/+server";

// Mock the TrueForm API functions
const mockCreateTrueFormOpportunity = vi.fn();
const mockGetTrueFormOpportunities = vi.fn();
const mockUpdateOpportunityStatus = vi.fn();

vi.mock("$lib/api/trueform-server", () => ({
  createTrueFormOpportunity: mockCreateTrueFormOpportunity,
  getTrueFormOpportunities: mockGetTrueFormOpportunities,
  updateOpportunityStatus: mockUpdateOpportunityStatus,
}));

describe("/api/opportunities", () => {
  let mockRequest: Request;
  let mockLocals: { user: any };

  beforeEach(() => {
    mockRequest = new Request("http://localhost/api/opportunities");
    mockLocals = {
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    };
    vi.clearAllMocks();
  });

  describe("GET /api/opportunities", () => {
    it("should return opportunities when authenticated", async () => {
      const mockOpportunities = [
        {
          id: "opp-1",
          company_name: "Tech Corp",
          contact_name: "John Smith",
          contact_email: "john@techcorp.com",
          project_description: "New website development",
          lead_score: 85,
          lead_priority: "HIGH",
          status: "new",
        },
        {
          id: "opp-2",
          company_name: "Design Studio",
          contact_name: "Jane Doe",
          contact_email: "jane@designstudio.com",
          project_description: "E-commerce platform",
          lead_score: 92,
          lead_priority: "CRITICAL",
          status: "qualified",
        },
      ];

      mockGetTrueFormOpportunities.mockResolvedValue(mockOpportunities);

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0]).toMatchObject({
        id: "opp-1",
        company_name: "Tech Corp",
        lead_score: 85,
        lead_priority: "HIGH",
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
      expect(mockGetTrueFormOpportunities).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      mockGetTrueFormOpportunities.mockRejectedValue(
        new Error("Failed to fetch from external API")
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch opportunities");
      expect(data.details).toBe("Failed to fetch from external API");
    });
  });

  describe("POST /api/opportunities", () => {
    const validOpportunityData = {
      companyName: "Innovation Labs",
      contactName: "Alex Johnson",
      contactEmail: "alex@innovationlabs.com",
      contactPhone: "555-0123",
      contactRole: "CTO",
      projectDescription: "Complete digital transformation",
      websiteType: "E-commerce",
      coreFeatures: [
        "contact",
        "gallery",
        "seo",
        "analytics",
        "payment",
        "booking",
      ],
      colorPalette: "modern",
      designMood: ["clean", "professional"],
      brandingAssets: { hasBrandAssets: "yes" },
      timeline: "3-4 months",
      industry: "Technology",
      targetAudience: "B2B clients",
      primaryGoals: ["increase-sales", "improve-branding"],

      // Lead qualification data
      decisionAuthority: "decision_maker",
      budgetContext: "budget_approved",
      projectUrgency: "high_priority",
      currentSituation: "outdated_website",
      competitorContext: "first_choice",
      additionalInfo: "Looking for modern, scalable solution",
    };

    beforeEach(() => {
      mockRequest = new Request("http://localhost/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validOpportunityData),
      });
    });

    it("should create opportunity with high lead score", async () => {
      const mockResult = {
        opportunity: {
          id: "opp-3",
          company_name: "Innovation Labs",
          contact_name: "Alex Johnson",
          lead_score: 90,
          lead_priority: "CRITICAL",
        },
        contact: {
          id: "contact-3",
          name: "Alex Johnson",
          email: "alex@innovationlabs.com",
        },
      };

      mockCreateTrueFormOpportunity.mockResolvedValue(mockResult);

      const event = {
        request: mockRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.opportunity).toMatchObject({
        id: "opp-3",
        company_name: "Innovation Labs",
        lead_score: 90,
        lead_priority: "CRITICAL",
      });

      // Verify the lead scoring calculation
      const callArgs = mockCreateTrueFormOpportunity.mock.calls[0][0];
      expect(callArgs.leadScore).toBeGreaterThan(80); // High score expected
      expect(callArgs.leadPriority).toBe("CRITICAL");
      expect(callArgs.scoringFactors).toContain("Decision maker identified");
      expect(callArgs.scoringFactors).toContain("Budget already approved");
    });

    it("should calculate lead score correctly for low-priority lead", async () => {
      const lowPriorityData = {
        ...validOpportunityData,
        decisionAuthority: "researcher",
        budgetContext: "budget_exploring",
        projectUrgency: "exploring",
        currentSituation: "modernize",
        competitorContext: "researching",
        coreFeatures: ["contact", "gallery"], // Fewer features
      };

      const lowPriorityRequest = new Request(
        "http://localhost/api/opportunities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lowPriorityData),
        }
      );

      const mockResult = {
        opportunity: { id: "opp-4", lead_score: 45, lead_priority: "LOW" },
        contact: { id: "contact-4" },
      };

      mockCreateTrueFormOpportunity.mockResolvedValue(mockResult);

      const event = {
        request: lowPriorityRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);

      const callArgs = mockCreateTrueFormOpportunity.mock.calls[0][0];
      expect(callArgs.leadScore).toBeLessThan(60); // Low score expected
      expect(callArgs.leadPriority).toBe("LOW");
    });

    it("should handle enterprise features correctly", async () => {
      const enterpriseData = {
        ...validOpportunityData,
        coreFeatures: ["contact", "gallery", "seo", "mobile"], // mobile = enterprise
      };

      const enterpriseRequest = new Request(
        "http://localhost/api/opportunities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enterpriseData),
        }
      );

      const mockResult = {
        opportunity: { id: "opp-5", lead_score: 88 },
        contact: { id: "contact-5" },
      };

      mockCreateTrueFormOpportunity.mockResolvedValue(mockResult);

      const event = {
        request: enterpriseRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("enterprise project");

      const callArgs = mockCreateTrueFormOpportunity.mock.calls[0][0];
      expect(callArgs.budgetRange).toBe("Custom Quote");
      expect(callArgs.planType).toBe("enterprise");
    });

    it("should calculate pricing correctly for standard features", async () => {
      const standardData = {
        ...validOpportunityData,
        coreFeatures: [
          "contact",
          "gallery",
          "seo",
          "analytics",
          "blog",
          "payment",
        ],
        timeline: "ASAP", // Should add rush delivery cost
      };

      const standardRequest = new Request(
        "http://localhost/api/opportunities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(standardData),
        }
      );

      const mockResult = {
        opportunity: { id: "opp-6" },
        contact: { id: "contact-6" },
      };

      mockCreateTrueFormOpportunity.mockResolvedValue(mockResult);

      const event = {
        request: standardRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);

      // Verify pricing calculation in summary
      expect(data.summary.pricing.isEnterprise).toBe(false);
      expect(data.summary.pricing.totalPrice).toBeGreaterThan(999); // Base price + add-ons
      expect(data.summary.pricing.addOns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "blog" }),
          expect.objectContaining({ name: "payment" }),
          expect.objectContaining({ name: "rushDelivery" }),
        ])
      );
    });

    it("should handle missing required fields", async () => {
      const incompleteData = {
        companyName: "Incomplete Corp",
        // Missing many required fields
      };

      const incompleteRequest = new Request(
        "http://localhost/api/opportunities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(incompleteData),
        }
      );

      const event = {
        request: incompleteRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      // Should still succeed but with default scoring
      expect(response.status).toBe(200);

      const callArgs = mockCreateTrueFormOpportunity.mock.calls[0][0];
      expect(callArgs.leadScore).toBe(50); // Base score when no qualification data
    });

    it("should handle service errors", async () => {
      mockCreateTrueFormOpportunity.mockRejectedValue(
        new Error("External API unavailable")
      );

      const event = {
        request: mockRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
      expect(data.details).toBe("External API unavailable");
    });

    it("should handle malformed JSON", async () => {
      const badRequest = new Request("http://localhost/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      const event = {
        request: badRequest,
        locals: {},
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("PATCH /api/opportunities", () => {
    const validUpdateData = {
      opportunityId: "opp-1",
      status: "qualified",
      notes: "Follow-up scheduled for next week",
    };

    beforeEach(() => {
      mockRequest = new Request("http://localhost/api/opportunities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validUpdateData),
      });
    });

    it("should update opportunity status when authenticated", async () => {
      const mockResult = {
        opportunity: {
          id: "opp-1",
          status: "qualified",
          notes: "Follow-up scheduled for next week",
          updated_at: "2024-01-02T00:00:00Z",
        },
      };

      mockUpdateOpportunityStatus.mockResolvedValue(mockResult);

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await PATCH(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject(mockResult);
      expect(mockUpdateOpportunityStatus).toHaveBeenCalledWith(
        "opp-1",
        "qualified",
        "Follow-up scheduled for next week"
      );
    });

    it("should return 401 when not authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: { user: null },
      } as RequestEvent;

      const response = await PATCH(event);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
      expect(mockUpdateOpportunityStatus).not.toHaveBeenCalled();
    });

    it("should validate required fields", async () => {
      const invalidData = {
        opportunityId: "opp-1",
        // Missing status
      };

      const invalidRequest = new Request("http://localhost/api/opportunities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      const event = {
        request: invalidRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await PATCH(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
      expect(data.details).toBe("opportunityId and status are required");
    });

    it("should handle service errors", async () => {
      mockUpdateOpportunityStatus.mockRejectedValue(
        new Error("Opportunity not found")
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await PATCH(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to update opportunity");
      expect(data.details).toBe("Opportunity not found");
    });

    it("should handle update without notes", async () => {
      const dataWithoutNotes = {
        opportunityId: "opp-1",
        status: "contacted",
      };

      const requestWithoutNotes = new Request(
        "http://localhost/api/opportunities",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataWithoutNotes),
        }
      );

      const mockResult = {
        opportunity: {
          id: "opp-1",
          status: "contacted",
          updated_at: "2024-01-02T00:00:00Z",
        },
      };

      mockUpdateOpportunityStatus.mockResolvedValue(mockResult);

      const event = {
        request: requestWithoutNotes,
        locals: mockLocals,
      } as RequestEvent;

      const response = await PATCH(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockUpdateOpportunityStatus).toHaveBeenCalledWith(
        "opp-1",
        "contacted",
        undefined
      );
    });
  });
});
