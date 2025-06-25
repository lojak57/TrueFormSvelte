# 🔥 Phase 1 Implementation: CRM Foundation (Weeks 1-2)

**Mission**: Build the core CRM foundation that maintains our A- architecture standards while delivering enterprise-grade functionality.

---

## 🎯 **Week 1: Database Foundation & Core Models**

### **Day 1-2: Database Schema Design**

#### **1. Contact Relationships System**

```sql
-- Contact relationship mapping
CREATE TABLE tf_contact_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    related_contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('reports_to', 'colleague', 'decision_maker', 'influencer', 'assistant')),
    influence_level INTEGER CHECK (influence_level BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(primary_contact_id, related_contact_id)
);

-- Contact interaction history
CREATE TABLE tf_contact_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'demo', 'proposal_sent', 'follow_up')),
    subject TEXT NOT NULL,
    notes TEXT,
    outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'negative', 'follow_up_needed')),
    next_action TEXT,
    next_action_date DATE,
    duration_minutes INTEGER,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_contact_relationships_primary ON tf_contact_relationships(primary_contact_id);
CREATE INDEX idx_contact_relationships_related ON tf_contact_relationships(related_contact_id);
CREATE INDEX idx_contact_interactions_contact ON tf_contact_interactions(contact_id);
CREATE INDEX idx_contact_interactions_created_by ON tf_contact_interactions(created_by);
CREATE INDEX idx_contact_interactions_date ON tf_contact_interactions(created_at);
```

#### **2. Deal Pipeline System**

```sql
-- Core deals table
CREATE TABLE tf_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    primary_contact_id UUID NOT NULL REFERENCES tf_contacts(id),
    name TEXT NOT NULL,
    description TEXT,
    value DECIMAL(12,2) NOT NULL DEFAULT 0,
    probability INTEGER CHECK (probability BETWEEN 0 AND 100) DEFAULT 50,
    stage TEXT NOT NULL CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')) DEFAULT 'lead',
    expected_close_date DATE,
    actual_close_date DATE,
    lost_reason TEXT,
    source TEXT CHECK (source IN ('website', 'referral', 'cold_outreach', 'marketing', 'existing_client')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_to UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal activities tracking
CREATE TABLE tf_deal_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES tf_deals(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'demo', 'proposal_sent', 'contract_sent', 'follow_up')),
    subject TEXT NOT NULL,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    completed_date DATE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_deals_company ON tf_deals(company_id);
CREATE INDEX idx_deals_contact ON tf_deals(primary_contact_id);
CREATE INDEX idx_deals_assigned ON tf_deals(assigned_to);
CREATE INDEX idx_deals_stage ON tf_deals(stage);
CREATE INDEX idx_deals_close_date ON tf_deals(expected_close_date);
CREATE INDEX idx_deal_activities_deal ON tf_deal_activities(deal_id);
```

#### **3. Lead Scoring System**

```sql
-- Lead scoring table
CREATE TABLE tf_lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES tf_contacts(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES tf_companies(id) ON DELETE CASCADE,
    company_size_score INTEGER DEFAULT 0,
    budget_score INTEGER DEFAULT 0,
    authority_score INTEGER DEFAULT 0,
    need_score INTEGER DEFAULT 0,
    timeline_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    total_score INTEGER GENERATED ALWAYS AS (
        company_size_score + budget_score + authority_score +
        need_score + timeline_score + engagement_score
    ) STORED,
    qualification_status TEXT CHECK (qualification_status IN ('hot', 'warm', 'cold', 'unqualified')) DEFAULT 'cold',
    last_calculated TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- Unique constraint and index
ALTER TABLE tf_lead_scores ADD CONSTRAINT unique_contact_lead_score UNIQUE(contact_id);
CREATE INDEX idx_lead_scores_total ON tf_lead_scores(total_score DESC);
CREATE INDEX idx_lead_scores_status ON tf_lead_scores(qualification_status);
```

### **Day 3-4: Service Layer Implementation**

#### **1. Deal Service (BaseService Extension)**

```typescript
// src/lib/services/DealService.ts
import { BaseService } from "./BaseService";
import type { Deal, CreateDealDTO, UpdateDealDTO } from "$lib/types/deals";

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
        contact:tf_contacts(*),
        assigned_user:auth.users(id, email)
      `
      )
      .order("expected_close_date");

    if (error) {
      throw new Error(`Failed to fetch deals with details: ${error.message}`);
    }

    return data;
  }

  // Update deal stage with activity log
  async updateDealStage(
    dealId: string,
    newStage: string,
    notes?: string
  ): Promise<Deal> {
    // Start transaction
    const deal = await this.update(dealId, { stage: newStage });

    // Log activity
    await this.supabase.from("tf_deal_activities").insert({
      deal_id: dealId,
      activity_type: "stage_change",
      subject: `Deal moved to ${newStage}`,
      notes,
      completed: true,
      completed_date: new Date().toISOString(),
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

    return data;
  }
}
```

#### **2. Contact Interaction Service**

```typescript
// src/lib/services/ContactInteractionService.ts
import { BaseService } from "./BaseService";
import type {
  ContactInteraction,
  CreateInteractionDTO,
} from "$lib/types/interactions";

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
        contact:tf_contacts(*),
        created_by_user:auth.users(id, email)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent interactions: ${error.message}`);
    }

    return data;
  }

  // Get interactions requiring follow-up
  async getFollowUpRequired(): Promise<ContactInteraction[]> {
    const { data, error } = await this.query()
      .select("*")
      .eq("outcome", "follow_up_needed")
      .not("next_action_date", "is", null)
      .lte("next_action_date", new Date().toISOString())
      .order("next_action_date");

    if (error) {
      throw new Error(`Failed to fetch follow-ups: ${error.message}`);
    }

    return data;
  }

  // Log interaction with automatic next steps
  async logInteraction(dto: CreateInteractionDTO): Promise<ContactInteraction> {
    const interaction = await this.create(dto);

    // If this was a positive meeting, suggest follow-up
    if (dto.interaction_type === "meeting" && dto.outcome === "positive") {
      await this.suggestNextAction(interaction.id);
    }

    return interaction;
  }

  private async suggestNextAction(interactionId: string): Promise<void> {
    // AI-powered next action suggestion logic
    // For now, simple rule-based suggestions
    const suggestions = {
      meeting: "Send follow-up email with proposal",
      call: "Schedule demo meeting",
      demo: "Send formal proposal",
      email: "Follow up with phone call",
    };

    // Implementation details...
  }
}
```

#### **3. Lead Scoring Service**

```typescript
// src/lib/services/LeadScoringService.ts
import { BaseService } from "./BaseService";
import type { LeadScore, UpdateLeadScoreDTO } from "$lib/types/leadScoring";

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
      company_size_score: this.calculateCompanySizeScore(contact.company),
      budget_score: this.calculateBudgetScore(contact),
      authority_score: this.calculateAuthorityScore(contact),
      need_score: this.calculateNeedScore(contact),
      timeline_score: this.calculateTimelineScore(contact),
      engagement_score: this.calculateEngagementScore(contactId),
    };

    const qualification_status = this.determineQualificationStatus(scores);

    // Upsert the score
    const { data, error } = await this.supabase
      .from("tf_lead_scores")
      .upsert({
        contact_id: contactId,
        company_id: contact.company_id,
        ...scores,
        qualification_status,
        last_calculated: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lead score: ${error.message}`);
    }

    return data;
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

    return data;
  }

  // Scoring algorithms
  private calculateCompanySizeScore(company: Company): number {
    // Score based on company size indicators
    const indicators = [
      company.billing_street ? 5 : 0, // Has office address
      company.website ? 10 : 0, // Has website
      // Add more sophisticated scoring logic
    ];

    return Math.min(
      indicators.reduce((a, b) => a + b, 0),
      25
    );
  }

  private calculateBudgetScore(contact: Contact): number {
    // Score based on budget indicators from interactions
    // Implementation details...
    return 0; // Placeholder
  }

  private calculateAuthorityScore(contact: Contact): number {
    // Score based on job title and decision-making power
    const authorityTitles = [
      "ceo",
      "cto",
      "founder",
      "president",
      "director",
      "manager",
    ];
    const title = contact.title?.toLowerCase() || "";

    for (const authTitle of authorityTitles) {
      if (title.includes(authTitle)) {
        return authTitle === "ceo" || authTitle === "founder" ? 25 : 20;
      }
    }

    return 5;
  }

  private calculateNeedScore(contact: Contact): number {
    // Score based on expressed needs in interactions
    // Implementation details...
    return 0; // Placeholder
  }

  private calculateTimelineScore(contact: Contact): number {
    // Score based on urgency indicators
    // Implementation details...
    return 0; // Placeholder
  }

  private async calculateEngagementScore(contactId: string): Promise<number> {
    // Score based on interaction frequency and recency
    const interactions = await this.supabase
      .from("tf_contact_interactions")
      .select("created_at, outcome")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (interactions.error || !interactions.data.length) {
      return 0;
    }

    // Recent interactions = higher score
    const now = new Date();
    let score = 0;

    interactions.data.forEach((interaction, index) => {
      const daysSince = Math.floor(
        (now.getTime() - new Date(interaction.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const recencyScore = Math.max(0, 10 - daysSince); // 10 points for today, decreasing
      const outcomeMultiplier = interaction.outcome === "positive" ? 1.5 : 1;

      score += recencyScore * outcomeMultiplier;
    });

    return Math.min(score, 25);
  }

  private determineQualificationStatus(scores: any): string {
    const total = Object.values(scores).reduce(
      (a: number, b: number) => a + b,
      0
    );

    if (total >= 80) return "hot";
    if (total >= 60) return "warm";
    if (total >= 30) return "cold";
    return "unqualified";
  }
}
```

### **Day 5-7: API Routes & Component Foundation**

#### **1. API Routes with Route Groups**

```typescript
// src/routes/(api)/api/(protected)/deals/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { DealService } from "$lib/services/DealService";
import {
  createErrorResponse,
  createSuccessResponse,
} from "$lib/server/apiHelpers";

export const GET: RequestHandler = async ({ locals, url }) => {
  try {
    const dealService = new DealService();
    const stage = url.searchParams.get("stage");
    const assignedTo = url.searchParams.get("assigned_to");

    let deals;
    if (stage) {
      deals = await dealService.getDealsByStage(stage);
    } else if (assignedTo) {
      deals = await dealService.getMyDeals(assignedTo);
    } else {
      deals = await dealService.getDealsWithDetails();
    }

    return createSuccessResponse(deals);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const dealService = new DealService();
    const data = await request.json();

    // Add created_by from session
    data.created_by = locals.user.id;
    data.assigned_to = data.assigned_to || locals.user.id;

    const deal = await dealService.create(data);
    return createSuccessResponse(deal, 201);
  } catch (error) {
    return createErrorResponse(error);
  }
};
```

#### **2. Component Foundation**

```typescript
// src/lib/components/deals/DealCard.svelte
<script lang="ts">
  import type { Deal } from '$lib/types/deals';
  import { formatCurrency, formatDate } from '$lib/utils';

  export let deal: Deal;
  export let onStageChange: (dealId: string, newStage: string) => void;

  const stageColors = {
    lead: 'bg-gray-100 text-gray-800',
    qualified: 'bg-blue-100 text-blue-800',
    proposal: 'bg-yellow-100 text-yellow-800',
    negotiation: 'bg-orange-100 text-orange-800',
    closed_won: 'bg-green-100 text-green-800',
    closed_lost: 'bg-red-100 text-red-800'
  };
</script>

<div class="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
  <div class="flex justify-between items-start mb-3">
    <h3 class="font-semibold text-gray-900 truncate">{deal.name}</h3>
    <span class="px-2 py-1 text-xs font-medium rounded-full {stageColors[deal.stage]}">
      {deal.stage.replace('_', ' ').toUpperCase()}
    </span>
  </div>

  <div class="space-y-2 text-sm text-gray-600">
    <div class="flex justify-between">
      <span>Value:</span>
      <span class="font-medium text-green-600">{formatCurrency(deal.value)}</span>
    </div>
    <div class="flex justify-between">
      <span>Probability:</span>
      <span class="font-medium">{deal.probability}%</span>
    </div>
    <div class="flex justify-between">
      <span>Expected Close:</span>
      <span class="font-medium">{formatDate(deal.expected_close_date)}</span>
    </div>
  </div>

  <div class="mt-4 flex gap-2">
    <button
      class="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
      on:click={() => /* View deal details */}
    >
      View Details
    </button>
    <select
      class="px-2 py-1 border rounded text-sm"
      value={deal.stage}
      on:change={(e) => onStageChange(deal.id, e.target.value)}
    >
      <option value="lead">Lead</option>
      <option value="qualified">Qualified</option>
      <option value="proposal">Proposal</option>
      <option value="negotiation">Negotiation</option>
      <option value="closed_won">Closed Won</option>
      <option value="closed_lost">Closed Lost</option>
    </select>
  </div>
</div>
```

---

## 🎯 **Week 2: UI Implementation & Integration**

### **Day 8-10: Pipeline Dashboard**

- Kanban-style pipeline view
- Drag-and-drop deal management
- Pipeline metrics and forecasting
- Deal detail modals

### **Day 11-12: Contact Interaction Hub**

- Interaction timeline component
- Quick interaction logging
- Follow-up task generation
- Contact relationship mapping UI

### **Day 13-14: Lead Scoring Interface**

- Lead score visualization
- Hot leads dashboard
- Score calculation explanations
- Bulk lead qualification actions

---

## 📊 **Success Metrics for Phase 1**

### **Technical Quality**

- Maintain A- (89/100) code quality
- All components < 200 lines
- 100% TypeScript coverage
- Zero code duplication
- All services extend BaseService

### **Functionality Delivered**

- Complete deal pipeline management
- Contact interaction tracking
- Lead scoring system
- Pipeline analytics foundation
- Mobile-responsive UI

### **Performance Targets**

- < 200ms API response times
- < 2s page load times
- Real-time updates for deal changes
- Smooth drag-and-drop interactions

---

## 🚀 **Phase 1 Deliverables**

By end of Week 2, we'll have:

1. **Professional CRM Foundation** that rivals enterprise solutions
2. **Zero architectural compromises** - maintaining our A- standards
3. **Scalable database design** ready for thousands of deals
4. **Clean, reusable components** following our established patterns
5. **Comprehensive API layer** with proper authentication and error handling

**This foundation will be so solid that any developer could jump in and immediately understand and extend it.**

Ready to build the most architecturally sound CRM foundation that GitHub has ever seen? 🔥
