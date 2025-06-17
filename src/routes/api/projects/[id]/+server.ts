import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProjectService } from '$lib/services/ProjectService';

const projectService = new ProjectService();

export const GET: RequestHandler = async ({ params }) => {
  try {
    const project = await projectService.getProject(params.id);
    return json(project);
  } catch (error) {
    return json({ error: 'Failed to fetch project' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const dto = await request.json();
    const project = await projectService.updateProject(params.id, dto);
    return json(project);
  } catch (error) {
    return json({ error: 'Failed to update project' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await projectService.deleteProject(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: 'Failed to delete project' }, { status: 500 });
  }
}; 