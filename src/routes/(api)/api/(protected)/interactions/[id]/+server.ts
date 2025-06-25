import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { ContactInteractionService } from "$lib/services/ContactInteractionService";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
  try {
    requireAuth(locals.user);

    const interactionService = new ContactInteractionService();
    const interaction = await interactionService.getById(params.id);

    return createSuccessResponse(interaction);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const PUT: RequestHandler = async ({ request, locals, params }) => {
  try {
    requireAuth(locals.user);

    const interactionService = new ContactInteractionService();
    const data = await request.json();

    const interaction = await interactionService.update(params.id, data);
    return createSuccessResponse(interaction);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  try {
    requireAuth(locals.user);

    const interactionService = new ContactInteractionService();
    await interactionService.delete(params.id);

    return createSuccessResponse({
      message: "Interaction deleted successfully",
    });
  } catch (error) {
    return createErrorResponse(error);
  }
};
