import type {
  ContactInteraction,
  ContactInteractionWithDetails,
  CreateInteractionDTO,
  UpdateInteractionDTO,
} from "$lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "./BaseService";

export class ContactInteractionService extends BaseService<
  ContactInteraction,
  CreateInteractionDTO,
  UpdateInteractionDTO
> {
  constructor(supabaseClient?: SupabaseClient) {
    super("tf_contact_interactions", supabaseClient);
  }

  // Get interaction history for contact
  async getContactHistory(contactId: string): Promise<ContactInteraction[]> {
    return this.findWhere({ contact_id: contactId }, "created_at DESC");
  }

  // Get recent interactions across all contacts
  async getRecentInteractions(
    limit = 20
  ): Promise<ContactInteractionWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent interactions: ${error.message}`);
    }

    return data as ContactInteractionWithDetails[];
  }

  // Get interactions requiring follow-up
  async getFollowUpRequired(): Promise<ContactInteractionWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .eq("outcome", "follow_up_needed")
      .not("next_action_date", "is", null)
      .lte("next_action_date", new Date().toISOString().split("T")[0])
      .order("next_action_date");

    if (error) {
      throw new Error(`Failed to fetch follow-ups: ${error.message}`);
    }

    return data as ContactInteractionWithDetails[];
  }

  // Get today's follow-ups
  async getTodayFollowUps(): Promise<ContactInteractionWithDetails[]> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .eq("outcome", "follow_up_needed")
      .eq("next_action_date", today)
      .order("created_at");

    if (error) {
      throw new Error(`Failed to fetch today's follow-ups: ${error.message}`);
    }

    return data as ContactInteractionWithDetails[];
  }

  // Get overdue follow-ups
  async getOverdueFollowUps(): Promise<ContactInteractionWithDetails[]> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .eq("outcome", "follow_up_needed")
      .lt("next_action_date", today)
      .order("next_action_date");

    if (error) {
      throw new Error(`Failed to fetch overdue follow-ups: ${error.message}`);
    }

    return data as ContactInteractionWithDetails[];
  }

  // Log interaction with automatic next steps
  async logInteraction(dto: CreateInteractionDTO): Promise<ContactInteraction> {
    const interaction = await this.create(dto);

    // If this was a positive meeting, suggest follow-up
    if (dto.interaction_type === "meeting" && dto.outcome === "positive") {
      await this.suggestNextAction(interaction.id, dto.interaction_type);
    }

    return interaction;
  }

  // Get interactions by type
  async getInteractionsByType(
    interactionType: ContactInteraction["interaction_type"],
    limit?: number
  ): Promise<ContactInteractionWithDetails[]> {
    let query = this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .eq("interaction_type", interactionType)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to fetch ${interactionType} interactions: ${error.message}`
      );
    }

    return data as ContactInteractionWithDetails[];
  }

  // Get interaction summary for contact
  async getContactInteractionSummary(contactId: string): Promise<any> {
    const { data, error } = await this.supabase.rpc(
      "get_contact_interaction_summary",
      { contact_uuid: contactId }
    );

    if (error) {
      throw new Error(`Failed to get interaction summary: ${error.message}`);
    }

    return data;
  }

  // Get interactions by outcome
  async getInteractionsByOutcome(
    outcome: ContactInteraction["outcome"],
    timeframeDays = 30
  ): Promise<ContactInteractionWithDetails[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .eq("outcome", outcome)
      .gte("created_at", cutoffDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Failed to fetch ${outcome} interactions: ${error.message}`
      );
    }

    return data as ContactInteractionWithDetails[];
  }

  // Get interactions for a user (created by)
  async getMyInteractions(
    userId: string,
    limit = 50
  ): Promise<ContactInteractionWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch user interactions: ${error.message}`);
    }

    return data as ContactInteractionWithDetails[];
  }

  // Search interactions by subject or notes
  async searchInteractions(
    searchTerm: string
  ): Promise<ContactInteractionWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*)
      `
      )
      .or(`subject.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to search interactions: ${error.message}`);
    }

    return data as ContactInteractionWithDetails[];
  }

  // Mark follow-up as completed
  async completeFollowUp(
    interactionId: string,
    completionNotes?: string
  ): Promise<ContactInteraction> {
    const updateData: UpdateInteractionDTO = {
      outcome: "positive", // or could be dynamic
      notes: completionNotes
        ? `${completionNotes}\n\n[Follow-up completed on ${new Date().toLocaleDateString()}]`
        : `Follow-up completed on ${new Date().toLocaleDateString()}`,
    };

    return this.update(interactionId, updateData);
  }

  // Get interaction statistics
  async getInteractionStats(timeframeDays = 30): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

    const { data, error } = await this.query()
      .select("interaction_type, outcome, duration_minutes, created_at")
      .gte("created_at", cutoffDate.toISOString())
      .order("created_at");

    if (error) {
      throw new Error(`Failed to fetch interaction stats: ${error.message}`);
    }

    // Calculate statistics
    const totalInteractions = data.length;
    const interactionsByType = data.reduce((acc: any, interaction) => {
      acc[interaction.interaction_type] =
        (acc[interaction.interaction_type] || 0) + 1;
      return acc;
    }, {});

    const outcomeStats = data.reduce((acc: any, interaction) => {
      if (interaction.outcome) {
        acc[interaction.outcome] = (acc[interaction.outcome] || 0) + 1;
      }
      return acc;
    }, {});

    const avgDuration =
      data
        .filter((i) => i.duration_minutes)
        .reduce((sum, i) => sum + (i.duration_minutes || 0), 0) /
        data.filter((i) => i.duration_minutes).length || 0;

    return {
      total_interactions: totalInteractions,
      interactions_by_type: interactionsByType,
      outcome_stats: outcomeStats,
      average_duration_minutes: Math.round(avgDuration),
      timeframe_days: timeframeDays,
      positive_rate: outcomeStats.positive
        ? (outcomeStats.positive / totalInteractions) * 100
        : 0,
    };
  }

  // Private helper methods
  private async suggestNextAction(
    interactionId: string,
    interactionType: string
  ): Promise<void> {
    // AI-powered next action suggestion logic
    // For now, simple rule-based suggestions
    const suggestions = {
      meeting: "Send follow-up email with proposal",
      call: "Schedule demo meeting",
      demo: "Send formal proposal",
      email: "Follow up with phone call",
      proposal_sent: "Schedule follow-up call",
      follow_up: "Continue regular communication",
    };

    const suggestion = suggestions[interactionType as keyof typeof suggestions];

    if (suggestion) {
      // Update interaction with suggested next action
      await this.update(interactionId, {
        next_action: suggestion,
        next_action_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 7 days from now
      });
    }
  }

  // Bulk mark interactions as completed
  async bulkComplete(interactionIds: string[], notes?: string): Promise<void> {
    const promises = interactionIds.map((id) =>
      this.completeFollowUp(id, notes)
    );

    await Promise.all(promises);
  }

  // Get interaction timeline for company
  async getCompanyInteractionTimeline(
    companyId: string
  ): Promise<ContactInteractionWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts!inner(*)
      `
      )
      .eq("contact.company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Failed to fetch company interaction timeline: ${error.message}`
      );
    }

    return data as ContactInteractionWithDetails[];
  }
}
