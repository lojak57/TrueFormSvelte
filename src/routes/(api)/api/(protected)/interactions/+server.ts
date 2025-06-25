import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
} from "$lib/server/apiHelpers";
import { ContactInteractionService } from "$lib/services/ContactInteractionService";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url }) => {
  try {
    requireAuth(locals.user);

    const interactionService = new ContactInteractionService();
    const contactId = url.searchParams.get("contact_id");
    const type = url.searchParams.get("type");
    const outcome = url.searchParams.get("outcome");
    const followUps = url.searchParams.get("follow_ups");
    const userId = url.searchParams.get("user_id");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    let interactions;

    if (contactId) {
      interactions = await interactionService.getContactHistory(contactId);
    } else if (type) {
      interactions = await interactionService.getInteractionsByType(
        type as any,
        limit
      );
    } else if (outcome) {
      interactions = await interactionService.getInteractionsByOutcome(
        outcome as any
      );
    } else if (followUps === "today") {
      interactions = await interactionService.getTodayFollowUps();
    } else if (followUps === "overdue") {
      interactions = await interactionService.getOverdueFollowUps();
    } else if (followUps === "required") {
      interactions = await interactionService.getFollowUpRequired();
    } else if (userId) {
      interactions = await interactionService.getMyInteractions(userId, limit);
    } else {
      interactions = await interactionService.getRecentInteractions(limit);
    }

    return createSuccessResponse(interactions);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    requireAuth(locals.user);

    const interactionService = new ContactInteractionService();
    const data = await request.json();

    // Add created_by from session
    data.created_by = locals.user.id;

    const interaction = await interactionService.logInteraction(data);
    return createSuccessResponse(interaction, 201);
  } catch (error) {
    return createErrorResponse(error);
  }
};
