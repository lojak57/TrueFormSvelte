import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST } from "../../routes/api/projects/+server";
import type { RequestEvent } from "@sveltejs/kit";

// Mock the ProjectService
const mockProjectService = {
  getProjects: vi.fn(),
  createProject: vi.fn(),
};

vi.mock("$lib/services/ProjectService", () => ({
  ProjectService: vi.fn(() => mockProjectService),
}));

describe("/api/projects", () => {
  let mockRequest: Request;
  let mockLocals: { user: any };

  beforeEach(() => {
    mockRequest = new Request("http://localhost/api/projects");
    mockLocals = {
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    };
    vi.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("should return projects when authenticated", async () => {
      const mockProjects = [
        {
          id: "project-1",
          name: "Website Redesign",
          company_id: "company-1",
          status: "active",
          start_date: "2024-01-01",
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "project-2",
          name: "Mobile App Development",
          company_id: "company-2",
          status: "planning",
          start_date: "2024-02-01",
          created_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockProjectService.getProjects.mockResolvedValue(mockProjects);

      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: new URL("http://localhost/api/projects"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0]).toMatchObject({
        id: "project-1",
        name: "Website Redesign",
        status: "active",
      });
      expect(mockProjectService.getProjects).toHaveBeenCalledWith(undefined);
    });

    it("should filter by company_id when provided", async () => {
      const mockFilteredProjects = [
        {
          id: "project-1",
          name: "Website Redesign",
          company_id: "company-1",
          status: "active",
        },
      ];

      mockProjectService.getProjects.mockResolvedValue(mockFilteredProjects);

      const urlWithParams = new URL("http://localhost/api/projects?company_id=company-1");
      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: urlWithParams,
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].company_id).toBe("company-1");
      expect(mockProjectService.getProjects).toHaveBeenCalledWith("company-1");
    });

    it("should return 401 when not authenticated", async () => {
      const event = {
        request: mockRequest,
        locals: { user: null },
        url: new URL("http://localhost/api/projects"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
      expect(mockProjectService.getProjects).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      mockProjectService.getProjects.mockRejectedValue(
        new Error("Database connection failed")
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: new URL("http://localhost/api/projects"),
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch projects");
    });

    it("should handle empty company_id parameter", async () => {
      const mockProjects = [{ id: "project-1", name: "Test Project" }];
      mockProjectService.getProjects.mockResolvedValue(mockProjects);

      const urlWithEmptyParam = new URL("http://localhost/api/projects?company_id=");
      const event = {
        request: mockRequest,
        locals: mockLocals,
        url: urlWithEmptyParam,
      } as RequestEvent;

      const response = await GET(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockProjectService.getProjects).toHaveBeenCalledWith(undefined);
    });
  });

  describe("POST /api/projects", () => {
    const validProjectData = {
      name: "New Website Project",
      description: "Complete website overhaul with modern design",
      company_id: "company-1",
      status: "planning",
      start_date: "2024-03-01",
      end_date: "2024-06-01",
      budget: 50000,
    };

    beforeEach(() => {
      mockRequest = new Request("http://localhost/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validProjectData),
      });
    });

    it("should create a project with valid data", async () => {
      const mockCreatedProject = {
        id: "project-3",
        ...validProjectData,
        created_at: "2024-01-01T00:00:00Z",
      };

      mockProjectService.createProject.mockResolvedValue(mockCreatedProject);

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        id: "project-3",
        name: "New Website Project",
        company_id: "company-1",
        status: "planning",
      });
      expect(mockProjectService.createProject).toHaveBeenCalledWith(validProjectData);
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
      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });

    it("should handle service validation errors", async () => {
      mockProjectService.createProject.mockRejectedValue(
        new Error("Missing required field: company_id")
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create project");
    });

    it("should handle malformed JSON", async () => {
      const badRequest = new Request("http://localhost/api/projects", {
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
      expect(data.error).toBe("Failed to create project");
      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });

    it("should handle missing request body", async () => {
      const emptyRequest = new Request("http://localhost/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const event = {
        request: emptyRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create project");
      expect(mockProjectService.createProject).toHaveBeenCalledWith({});
    });

    it("should handle service errors during creation", async () => {
      mockProjectService.createProject.mockRejectedValue(
        new Error("Database constraint violation")
      );

      const event = {
        request: mockRequest,
        locals: mockLocals,
      } as RequestEvent;

      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create project");
    });
  });
});