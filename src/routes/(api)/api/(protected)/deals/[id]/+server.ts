import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { DealService } from "$lib/services/DealService";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    const deal = await dealService.getById(params.id);

    return createSuccessResponse(deal);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const PUT: RequestHandler = async ({ request, locals, params }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    const data = await request.json();

    const deal = await dealService.update(params.id, data);
    return createSuccessResponse(deal);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    await dealService.delete(params.id);

    return createSuccessResponse({ message: "Deal deleted successfully" });
  } catch (error) {
    return createErrorResponse(error);
  }
};
