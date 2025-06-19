import { ProjectService } from "$lib/services/ProjectService";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireAuth } from "$lib/utils/auth";

const projectService = new ProjectService();

export const GET: RequestHandler = async ({ url, request }) => {
  // 🔒 SECURE: Require authentication for project data
  await requireAuth(request);
  try {
    const companyId = url.searchParams.get("company_id") || undefined;
    const projects = await projectService.getProjects(companyId);
    return json(projects);
  } catch (error) {
    return json({ error: "Failed to fetch projects" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  // 🔒 SECURE: Require authentication for creating projects
  await requireAuth(request);
  try {
    const dto = await request.json();
    const project = await projectService.createProject(dto);
    return json(project, { status: 201 });
  } catch (error) {
    return json({ error: "Failed to create project" }, { status: 500 });
  }
};
