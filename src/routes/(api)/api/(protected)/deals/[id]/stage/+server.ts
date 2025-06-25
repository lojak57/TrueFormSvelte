import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { DealService } from "$lib/services/DealService";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ request, locals, params }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    const { stage, notes, lost_reason } = await request.json();

    if (!stage) {
      return createErrorResponse(
        new Error("Stage is required"),
        "Stage is required",
        400
      );
    }

    const deal = await dealService.updateDealStage(
      params.id,
      stage,
      notes,
      lost_reason
    );
    return createSuccessResponse(deal);
  } catch (error) {
    return createErrorResponse(error);
  }
};
