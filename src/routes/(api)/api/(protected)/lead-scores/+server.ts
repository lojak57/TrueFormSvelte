import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { LeadScoringService } from "$lib/services/LeadScoringService";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url }) => {
  try {
    requireAuth(locals.user);

    const leadScoringService = new LeadScoringService();
    const status = url.searchParams.get("status");
    const contactId = url.searchParams.get("contact_id");
    const action = url.searchParams.get("action");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let result;

    if (contactId) {
      result = await leadScoringService.getContactLeadScore(contactId);
    } else if (action === "top") {
      result = await leadScoringService.getTopLeads(limit);
    } else if (action === "hot") {
      result = await leadScoringService.getHotLeads();
    } else if (action === "warm") {
      result = await leadScoringService.getWarmLeads();
    } else if (action === "distribution") {
      result = await leadScoringService.getScoringDistribution();
    } else if (status) {
      result = await leadScoringService.getLeadsByStatus(status as any);
    } else {
      result = await leadScoringService.getAll();
    }

    return createSuccessResponse(result);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    requireAuth(locals.user);

    const leadScoringService = new LeadScoringService();
    const { contact_id, action } = await request.json();

    if (action === "calculate" && contact_id) {
      const score = await leadScoringService.calculateLeadScore(contact_id);
      return createSuccessResponse(score);
    } else if (action === "recalculate_all") {
      const updated = await leadScoringService.recalculateAllScores();
      return createSuccessResponse({ updated_count: updated });
    } else {
      return createErrorResponse(
        new Error("Invalid action or missing contact_id"),
        "Invalid request",
        400
      );
    }
  } catch (error) {
    return createErrorResponse(error);
  }
};
