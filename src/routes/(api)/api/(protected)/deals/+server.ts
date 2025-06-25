import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { DealService } from "$lib/services/DealService";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    const stage = url.searchParams.get("stage");
    const assignedTo = url.searchParams.get("assigned_to");
    const companyId = url.searchParams.get("company_id");
    const withDetails = url.searchParams.get("with_details") === "true";

    let deals;

    if (stage) {
      deals = await dealService.getDealsByStage(stage);
    } else if (assignedTo) {
      deals = await dealService.getMyDeals(assignedTo);
    } else if (companyId) {
      deals = await dealService.getCompanyDeals(companyId);
    } else if (withDetails) {
      deals = await dealService.getDealsWithDetails();
    } else {
      deals = await dealService.getAll();
    }

    return createSuccessResponse(deals);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    requireAuth(locals.user);

    const dealService = new DealService();
    const data = await request.json();

    // Add created_by and assigned_to from session
    data.created_by = locals.user.id;
    if (!data.assigned_to) {
      data.assigned_to = locals.user.id;
    }

    const deal = await dealService.createDealWithActivity(
      data,
      data.initial_note
    );
    return createSuccessResponse(deal, 201);
  } catch (error) {
    return createErrorResponse(error);
  }
};
