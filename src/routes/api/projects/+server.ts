import { ProjectService } from "$lib/services/ProjectService";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const projectService = new ProjectService();

export const GET: RequestHandler = async ({ url, request, locals }) => {
  // 🔒 SECURE: Require authentication for project data
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const companyId = url.searchParams.get("company_id") || undefined;
    const projects = await projectService.getProjects(companyId);
    return json(projects);
  } catch (error) {
    return json({ error: "Failed to fetch projects" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Require authentication for creating projects
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dto = await request.json();
    const project = await projectService.createProject(dto);
    return json(project, { status: 201 });
  } catch (error) {
    return json({ error: "Failed to create project" }, { status: 500 });
  }
};
