import type {
  CreateDealDTO,
  Deal,
  DealWithDetails,
  PipelineMetrics,
  UpdateDealDTO,
} from "$lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "./BaseService";

export class DealService extends BaseService<
  Deal,
  CreateDealDTO,
  UpdateDealDTO
> {
  constructor(supabaseClient?: SupabaseClient) {
    super("tf_deals", supabaseClient);
  }

  // Get deals by pipeline stage
  async getDealsByStage(stage: string): Promise<Deal[]> {
    return this.findWhere({ stage }, "expected_close_date");
  }

  // Get deals assigned to user
  async getMyDeals(userId: string): Promise<Deal[]> {
    return this.findWhere({ assigned_to: userId }, "expected_close_date");
  }

  // Get deals with company and contact info
  async getDealsWithDetails(): Promise<DealWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .order("expected_close_date");

    if (error) {
      throw new Error(`Failed to fetch deals with details: ${error.message}`);
    }

    return data as DealWithDetails[];
  }

  // Get deals for a specific company
  async getCompanyDeals(companyId: string): Promise<DealWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch company deals: ${error.message}`);
    }

    return data as DealWithDetails[];
  }

  // Update deal stage with activity log
  async updateDealStage(
    dealId: string,
    newStage: string,
    notes?: string,
    lostReason?: string
  ): Promise<Deal> {
    // Prepare update data
    const updateData: Partial<UpdateDealDTO> = {
      stage: newStage as Deal["stage"],
    };

    // If closing deal, set actual close date
    if (newStage === "closed_won" || newStage === "closed_lost") {
      updateData.actual_close_date = new Date().toISOString().split("T")[0];
      if (newStage === "closed_lost" && lostReason) {
        updateData.lost_reason = lostReason;
      }
    }

    // Update the deal
    const deal = await this.update(dealId, updateData);

    // Log stage change activity
    await this.supabase.from("tf_deal_activities").insert({
      deal_id: dealId,
      activity_type: "stage_change",
      subject: `Deal moved to ${newStage.replace("_", " ")}`,
      notes: notes || `Stage changed from previous to ${newStage}`,
      completed: true,
      completed_date: new Date().toISOString().split("T")[0],
      created_by: deal.assigned_to,
    });

    return deal;
  }

  // Calculate pipeline metrics
  async getPipelineMetrics(): Promise<PipelineMetrics> {
    const { data, error } = await this.supabase.rpc(
      "calculate_pipeline_metrics"
    );

    if (error) {
      throw new Error(`Failed to calculate pipeline metrics: ${error.message}`);
    }

    return data as PipelineMetrics;
  }

  // Get deals requiring follow-up (expected close date in past)
  async getOverdueDeals(): Promise<DealWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .lt("expected_close_date", new Date().toISOString().split("T")[0])
      .not("stage", "in", "(closed_won,closed_lost)")
      .order("expected_close_date");

    if (error) {
      throw new Error(`Failed to fetch overdue deals: ${error.message}`);
    }

    return data as DealWithDetails[];
  }

  // Get deals closing this month
  async getDealsClosingThisMonth(): Promise<DealWithDetails[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await this.query()
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .gte("expected_close_date", startOfMonth.toISOString().split("T")[0])
      .lte("expected_close_date", endOfMonth.toISOString().split("T")[0])
      .not("stage", "in", "(closed_won,closed_lost)")
      .order("expected_close_date");

    if (error) {
      throw new Error(
        `Failed to fetch deals closing this month: ${error.message}`
      );
    }

    return data as DealWithDetails[];
  }

  // Search deals by name or company
  async searchDeals(searchTerm: string): Promise<DealWithDetails[]> {
    const { data, error } = await this.query()
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .or(`name.ilike.%${searchTerm}%,company.name.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to search deals: ${error.message}`);
    }

    return data as DealWithDetails[];
  }

  // Get deals by value range
  async getDealsByValueRange(
    minValue: number,
    maxValue?: number
  ): Promise<DealWithDetails[]> {
    let query = this.query()
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .gte("value", minValue);

    if (maxValue) {
      query = query.lte("value", maxValue);
    }

    const { data, error } = await query.order("value", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch deals by value: ${error.message}`);
    }

    return data as DealWithDetails[];
  }

  // Create deal with activity log
  async createDealWithActivity(
    dto: CreateDealDTO,
    initialNote?: string
  ): Promise<Deal> {
    // Set created_by if not provided
    if (!dto.assigned_to) {
      // This should be set from the authenticated user in the API
      throw new Error("assigned_to is required");
    }

    const deal = await this.create(dto);

    // Log initial activity
    await this.supabase.from("tf_deal_activities").insert({
      deal_id: deal.id,
      activity_type: "follow_up",
      subject: "Deal created",
      notes: initialNote || "New deal added to pipeline",
      completed: true,
      completed_date: new Date().toISOString().split("T")[0],
      created_by: deal.created_by,
    });

    return deal;
  }

  // Bulk update deal stages (for kanban drag-and-drop)
  async bulkUpdateStages(
    updates: Array<{ id: string; stage: Deal["stage"] }>
  ): Promise<void> {
    const promises = updates.map((update) =>
      this.updateDealStage(
        update.id,
        update.stage,
        "Bulk stage update via drag-and-drop"
      )
    );

    await Promise.all(promises);
  }

  // Get pipeline conversion stats
  async getConversionStats(timeframe = 90): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframe);

    const { data, error } = await this.query()
      .select("stage, created_at, actual_close_date")
      .gte("created_at", cutoffDate.toISOString())
      .order("created_at");

    if (error) {
      throw new Error(`Failed to fetch conversion stats: ${error.message}`);
    }

    // Calculate conversion rates
    const totalDeals = data.length;
    const wonDeals = data.filter((d) => d.stage === "closed_won").length;
    const lostDeals = data.filter((d) => d.stage === "closed_lost").length;

    return {
      total_deals: totalDeals,
      won_deals: wonDeals,
      lost_deals: lostDeals,
      win_rate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0,
      loss_rate: totalDeals > 0 ? (lostDeals / totalDeals) * 100 : 0,
      timeframe_days: timeframe,
    };
  }
}
