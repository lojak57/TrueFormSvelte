import type {
  Company,
  Contact,
  CreateLeadScoreDTO,
  LeadScore,
  LeadScoreWithDetails,
  UpdateLeadScoreDTO,
} from "$lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "./BaseService";

export class LeadScoringService extends BaseService<
  LeadScore,
  CreateLeadScoreDTO,
  UpdateLeadScoreDTO
> {
  constructor(supabaseClient?: SupabaseClient) {
    super("tf_lead_scores", supabaseClient);
  }

  // Calculate lead score for contact
  async calculateLeadScore(contactId: string): Promise<LeadScore> {
    const contact = await this.getContactWithCompany(contactId);

    const scores = {
      company_size_score: await this.calculateCompanySizeScore(contact.company),
      budget_score: await this.calculateBudgetScore(contact),
      authority_score: this.calculateAuthorityScore(contact),
      need_score: await this.calculateNeedScore(contact),
      timeline_score: await this.calculateTimelineScore(contact),
      engagement_score: await this.calculateEngagementScore(contactId),
    };

    const qualification_status = this.determineQualificationStatus(scores);
    const score_breakdown = this.generateScoreBreakdown(scores, contact);

    // Upsert the score
    const { data, error } = await this.supabase
      .from("tf_lead_scores")
      .upsert({
        contact_id: contactId,
        company_id: contact.company_id!,
        ...scores,
        qualification_status,
        score_breakdown,
        last_calculated: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lead score: ${error.message}`);
    }

    return data as LeadScore;
  }

  // Get hot leads (score > 70)
  async getHotLeads(): Promise<LeadScoreWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*),
        company:tf_companies(*)
      `
      )
      .gte("total_score", 70)
      .order("total_score", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch hot leads: ${error.message}`);
    }

    return data as LeadScoreWithDetails[];
  }

  // Get warm leads (score 40-69)
  async getWarmLeads(): Promise<LeadScoreWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*),
        company:tf_companies(*)
      `
      )
      .gte("total_score", 40)
      .lt("total_score", 70)
      .order("total_score", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch warm leads: ${error.message}`);
    }

    return data as LeadScoreWithDetails[];
  }

  // Get leads by qualification status
  async getLeadsByStatus(
    status: LeadScore["qualification_status"]
  ): Promise<LeadScoreWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*),
        company:tf_companies(*)
      `
      )
      .eq("qualification_status", status)
      .order("total_score", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ${status} leads: ${error.message}`);
    }

    return data as LeadScoreWithDetails[];
  }

  // Bulk recalculate scores for all contacts
  async recalculateAllScores(): Promise<number> {
    const { data: contacts, error } = await this.supabase
      .from("tf_contacts")
      .select("id")
      .not("company_id", "is", null);

    if (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    let updated = 0;
    for (const contact of contacts) {
      try {
        await this.calculateLeadScore(contact.id);
        updated++;
      } catch (error) {
        console.error(
          `Failed to update score for contact ${contact.id}:`,
          error
        );
      }
    }

    return updated;
  }

  // Get lead score for specific contact
  async getContactLeadScore(
    contactId: string
  ): Promise<LeadScoreWithDetails | null> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*),
        company:tf_companies(*)
      `
      )
      .eq("contact_id", contactId)
      .single();

    if (error && error.code !== "PGRST116") {
      // Not found is ok
      throw new Error(`Failed to fetch lead score: ${error.message}`);
    }

    return (data as LeadScoreWithDetails) || null;
  }

  // Get top scoring leads
  async getTopLeads(limit = 10): Promise<LeadScoreWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        contact:tf_contacts(*),
        company:tf_companies(*)
      `
      )
      .order("total_score", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch top leads: ${error.message}`);
    }

    return data as LeadScoreWithDetails[];
  }

  // Get scoring distribution
  async getScoringDistribution(): Promise<any> {
    const { data, error } = await this.query().select(
      "total_score, qualification_status"
    );

    if (error) {
      throw new Error(`Failed to fetch scoring distribution: ${error.message}`);
    }

    const distribution = {
      hot: data.filter((l) => l.qualification_status === "hot").length,
      warm: data.filter((l) => l.qualification_status === "warm").length,
      cold: data.filter((l) => l.qualification_status === "cold").length,
      unqualified: data.filter((l) => l.qualification_status === "unqualified")
        .length,
      score_ranges: {
        "80-100": data.filter((l) => l.total_score >= 80).length,
        "60-79": data.filter((l) => l.total_score >= 60 && l.total_score < 80)
          .length,
        "40-59": data.filter((l) => l.total_score >= 40 && l.total_score < 60)
          .length,
        "20-39": data.filter((l) => l.total_score >= 20 && l.total_score < 40)
          .length,
        "0-19": data.filter((l) => l.total_score < 20).length,
      },
      average_score:
        data.reduce((sum, l) => sum + l.total_score, 0) / data.length || 0,
      total_leads: data.length,
    };

    return distribution;
  }

  // Private scoring algorithms
  private async calculateCompanySizeScore(company: Company): Promise<number> {
    if (!company) return 0;

    let score = 0;

    // Score based on company indicators
    if (company.billing_street) score += 5; // Has office address
    if (company.website) score += 10; // Has website
    if (company.billing_city && company.billing_state) score += 5; // Complete address

    // Additional scoring could be based on:
    // - Employee count (if we had this data)
    // - Revenue (if we had this data)
    // - Industry (from vertical_id)

    return Math.min(score, 25); // Max 25 points for company size
  }

  private async calculateBudgetScore(contact: Contact): Promise<number> {
    // Score based on budget indicators from interactions
    const { data: interactions } = await this.supabase
      .from("tf_contact_interactions")
      .select("notes, interaction_data")
      .eq("contact_id", contact.id);

    if (!interactions) return 0;

    let score = 0;

    // Look for budget-related keywords in notes
    const budgetKeywords = [
      "budget",
      "investment",
      "funding",
      "approved",
      "$",
      "cost",
      "price",
    ];
    const positiveKeywords = [
      "approved",
      "allocated",
      "available",
      "confirmed",
    ];

    interactions.forEach((interaction) => {
      const text = (interaction.notes || "").toLowerCase();
      const hasBudgetMention = budgetKeywords.some((keyword) =>
        text.includes(keyword)
      );
      const hasPositiveBudget = positiveKeywords.some((keyword) =>
        text.includes(keyword)
      );

      if (hasBudgetMention) score += 5;
      if (hasPositiveBudget) score += 10;
    });

    return Math.min(score, 25); // Max 25 points for budget
  }

  private calculateAuthorityScore(contact: Contact): number {
    if (!contact.title) return 5; // Default if no title

    const title = contact.title.toLowerCase();

    // High authority titles
    const highAuthority = [
      "ceo",
      "cto",
      "founder",
      "president",
      "owner",
      "principal",
    ];
    const mediumAuthority = [
      "director",
      "vp",
      "vice president",
      "head of",
      "lead",
      "senior",
    ];
    const lowAuthority = ["manager", "coordinator", "specialist", "analyst"];

    for (const keyword of highAuthority) {
      if (title.includes(keyword)) return 25;
    }

    for (const keyword of mediumAuthority) {
      if (title.includes(keyword)) return 20;
    }

    for (const keyword of lowAuthority) {
      if (title.includes(keyword)) return 15;
    }

    return 10; // Default for other titles
  }

  private async calculateNeedScore(contact: Contact): Promise<number> {
    // Score based on expressed needs in interactions
    const { data: interactions } = await this.supabase
      .from("tf_contact_interactions")
      .select("notes, interaction_data")
      .eq("contact_id", contact.id);

    if (!interactions) return 0;

    let score = 0;

    // Look for need-related keywords
    const needKeywords = [
      "need",
      "require",
      "looking for",
      "want",
      "interested",
      "seeking",
    ];
    const urgentKeywords = [
      "urgent",
      "asap",
      "immediately",
      "soon",
      "deadline",
    ];

    interactions.forEach((interaction) => {
      const text = (interaction.notes || "").toLowerCase();
      const hasNeedMention = needKeywords.some((keyword) =>
        text.includes(keyword)
      );
      const hasUrgency = urgentKeywords.some((keyword) =>
        text.includes(keyword)
      );

      if (hasNeedMention) score += 5;
      if (hasUrgency) score += 10;
    });

    return Math.min(score, 25); // Max 25 points for need
  }

  private async calculateTimelineScore(contact: Contact): Promise<number> {
    // Score based on urgency indicators
    const { data: interactions } = await this.supabase
      .from("tf_contact_interactions")
      .select("notes, next_action_date, created_at")
      .eq("contact_id", contact.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!interactions) return 0;

    let score = 0;

    // Recent interactions indicate active timeline
    const now = new Date();
    interactions.forEach((interaction) => {
      const daysSince = Math.floor(
        (now.getTime() - new Date(interaction.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysSince <= 7) score += 10; // Very recent
      else if (daysSince <= 30) score += 5; // Recent

      // Check for timeline keywords
      const text = (interaction.notes || "").toLowerCase();
      const timelineKeywords = [
        "this quarter",
        "next month",
        "soon",
        "quickly",
        "fast track",
      ];
      const hasTimeline = timelineKeywords.some((keyword) =>
        text.includes(keyword)
      );

      if (hasTimeline) score += 5;
    });

    return Math.min(score, 25); // Max 25 points for timeline
  }

  private async calculateEngagementScore(contactId: string): Promise<number> {
    // Score based on interaction frequency and recency
    const { data: interactions } = await this.supabase
      .from("tf_contact_interactions")
      .select("created_at, outcome, interaction_type")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!interactions || interactions.length === 0) return 0;

    const now = new Date();
    let score = 0;

    interactions.forEach((interaction, index) => {
      const daysSince = Math.floor(
        (now.getTime() - new Date(interaction.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Recency score (higher for more recent)
      const recencyScore = Math.max(0, 10 - daysSince);

      // Outcome multiplier
      const outcomeMultiplier =
        interaction.outcome === "positive"
          ? 1.5
          : interaction.outcome === "neutral"
          ? 1.0
          : 0.5;

      // Interaction type multiplier (meetings worth more than emails)
      const typeMultiplier =
        interaction.interaction_type === "meeting"
          ? 1.5
          : interaction.interaction_type === "call"
          ? 1.3
          : interaction.interaction_type === "demo"
          ? 1.8
          : 1.0;

      score += recencyScore * outcomeMultiplier * typeMultiplier;
    });

    // Frequency bonus for multiple interactions
    if (interactions.length >= 5) score += 5;
    if (interactions.length >= 8) score += 5;

    return Math.min(score, 25); // Max 25 points for engagement
  }

  private determineQualificationStatus(
    scores: any
  ): LeadScore["qualification_status"] {
    const total = Object.values(scores).reduce(
      (a: number, b: unknown) => a + (typeof b === "number" ? b : 0),
      0
    );

    if (total >= 80) return "hot";
    if (total >= 60) return "warm";
    if (total >= 30) return "cold";
    return "unqualified";
  }

  private generateScoreBreakdown(
    scores: any,
    contact: Contact
  ): Record<string, any> {
    return {
      scores,
      contact_info: {
        title: contact.title,
        company_name: contact.company_id, // Would need to join to get name
      },
      scoring_date: new Date().toISOString(),
      next_review_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days
      recommendations: this.generateRecommendations(scores),
    };
  }

  private generateRecommendations(scores: any): string[] {
    const recommendations = [];

    if (scores.engagement_score < 10) {
      recommendations.push("Increase engagement with regular follow-ups");
    }

    if (scores.authority_score < 15) {
      recommendations.push("Identify and connect with decision makers");
    }

    if (scores.budget_score < 10) {
      recommendations.push("Qualify budget and timeline in next interaction");
    }

    if (scores.need_score < 10) {
      recommendations.push("Better understand specific business needs");
    }

    if (scores.timeline_score < 10) {
      recommendations.push("Establish clear project timeline and urgency");
    }

    return recommendations;
  }

  private async getContactWithCompany(
    contactId: string
  ): Promise<Contact & { company: Company }> {
    const { data, error } = await this.supabase
      .from("tf_contacts")
      .select(
        `
        *,
        company:tf_companies(*)
      `
      )
      .eq("id", contactId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch contact: ${error.message}`);
    }

    return data as Contact & { company: Company };
  }
}
