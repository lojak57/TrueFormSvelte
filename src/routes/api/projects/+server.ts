import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProjectService } from '$lib/services/ProjectService';

const projectService = new ProjectService();

export const GET: RequestHandler = async ({ url }) => {
  try {
    const companyId = url.searchParams.get('company_id') || undefined;
    const projects = await projectService.getProjects(companyId);
    return json(projects);
  } catch (error) {
    return json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const dto = await request.json();
    const project = await projectService.createProject(dto);
    return json(project, { status: 201 });
  } catch (error) {
    return json({ error: 'Failed to create project' }, { status: 500 });
  }
}; 