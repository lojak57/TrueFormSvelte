import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { DealService } from "$lib/services/DealService";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    const metrics = await dealService.getPipelineMetrics();

    return createSuccessResponse(metrics);
  } catch (error) {
    return createErrorResponse(error);
  }
};
