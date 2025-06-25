<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { DealWithDetails, PipelineMetrics } from "$lib/types";
  import DealPipeline from "$lib/components/crm/DealPipeline.svelte";
  import DashboardStats from "$lib/components/dashboard/DashboardStats.svelte";
  import RecentActivity from "$lib/components/dashboard/RecentActivity.svelte";
  import QuickActions from "$lib/components/dashboard/QuickActions.svelte";

  // Stats data
  let stats = {
    companies: 0,
    contacts: 0,
    projects: 0,
    proposals: 0,
    totalRevenue: 0,
    activeDeals: 0,
  };

  // Deal pipeline data
  let deals: DealWithDetails[] = [];
  let metrics: PipelineMetrics | null = null;

  // Recent activity
  let recentActivities: any[] = [];

  // Loading states
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    await Promise.all([
      loadStats(),
      loadDeals(),
      loadMetrics(),
      loadRecentActivity(),
    ]);
    loading = false;
  });

  async function loadStats() {
    try {
      const [companiesRes, contactsRes, projectsRes, proposalsRes] =
        await Promise.all([
          fetch("/api/companies"),
          fetch("/api/contacts"),
          fetch("/api/projects"),
          fetch("/api/proposals"),
        ]);

      if (companiesRes.ok) {
        const companies = await companiesRes.json();
        stats.companies = companies.length;
      }

      if (contactsRes.ok) {
        const contacts = await contactsRes.json();
        stats.contacts = contacts.length;
      }

      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        stats.projects = projects.length;
      }

      if (proposalsRes.ok) {
        const proposals = await proposalsRes.json();
        stats.proposals = proposals.length;
        // Calculate total revenue from accepted proposals
        stats.totalRevenue = proposals
          .filter((p: any) => p.status === "accepted")
          .reduce((sum: number, p: any) => sum + (p.total || 0), 0);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }

  async function loadDeals() {
    try {
      const response = await fetch("/api/deals?with_details=true");
      if (!response.ok) throw new Error("Failed to load deals");

      const result = await response.json();
      if (result.success) {
        deals = result.data || [];
        stats.activeDeals = deals.filter(
          (d) => !["closed_won", "closed_lost"].includes(d.stage)
        ).length;
      }
    } catch (err) {
      console.error("Error loading deals:", err);
    }
  }

  async function loadMetrics() {
    try {
      const response = await fetch("/api/deals/pipeline-metrics");
      if (!response.ok) throw new Error("Failed to load metrics");

      const result = await response.json();
      if (result.success) {
        metrics = result.data;
      }
    } catch (err) {
      console.error("Error loading metrics:", err);
    }
  }

  async function loadRecentActivity() {
    // TODO: Create an activity feed API endpoint
    // For now, we'll use mock data
    recentActivities = [
      {
        id: 1,
        type: "proposal_sent",
        description: "Proposal sent to Acme Corp",
        timestamp: new Date().toISOString(),
        icon: "FileText",
      },
      {
        id: 2,
        type: "deal_won",
        description: "Deal closed with TechStart Inc",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        icon: "Trophy",
      },
      {
        id: 3,
        type: "contact_added",
        description: "New contact added: John Smith",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        icon: "UserPlus",
      },
    ];
  }

  async function handleStageChange(event: CustomEvent) {
    const { dealId, newStage } = event.detail;

    try {
      const response = await fetch(`/api/deals/${dealId}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: newStage,
          notes: `Stage changed via pipeline to ${newStage}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to update stage");

      const result = await response.json();
      if (result.success) {
        deals = deals.map((deal) =>
          deal.id === dealId ? { ...deal, stage: newStage } : deal
        );
        await loadMetrics();
      }
    } catch (err) {
      console.error("Error updating stage:", err);
      alert("Failed to update deal stage");
    }
  }

  function handleDealClick(event: CustomEvent) {
    const deal = event.detail;
    goto(`/admin/companies/${deal.company_id}`);
  }

  function handleQuickAction(action: string) {
    switch (action) {
      case "new-company":
        goto("/admin/companies/create");
        break;
      case "new-contact":
        goto("/admin/contacts/create");
        break;
      case "new-proposal":
        goto("/admin/proposals/new");
        break;
      case "view-messages":
        goto("/admin/messages");
        break;
    }
  }
</script>

<svelte:head>
  <title>Dashboard | TrueForm Admin</title>
</svelte:head>

<div class="dashboard-container">
  {#if loading}
    <div class="loading-state">
      <div class="tf-spinner tf-spinner-lg" />
      <p>Loading dashboard...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <p class="text-red-600">{error}</p>
    </div>
  {:else}
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="tf-heading-1">Dashboard</h1>
        <p class="text-gray-600">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>
      <QuickActions on:action={(e) => handleQuickAction(e.detail)} />
    </div>

    <!-- Stats Grid -->
    <DashboardStats {stats} />

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Deal Pipeline (2/3 width) -->
      <div class="pipeline-section">
        <div class="section-header">
          <h2 class="tf-heading-2">Deal Pipeline</h2>
          {#if metrics}
            <div class="pipeline-metrics">
              <span class="metric">
                <strong>${(metrics.total_value || 0).toLocaleString()}</strong>
                total value
              </span>
              <span class="metric">
                <strong
                  >{metrics.average_deal_size?.toLocaleString() || 0}</strong
                >
                avg deal
              </span>
            </div>
          {/if}
        </div>
        <DealPipeline
          {deals}
          on:stageChange={handleStageChange}
          on:dealClick={handleDealClick}
        />
      </div>

      <!-- Recent Activity (1/3 width) -->
      <div class="activity-section">
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard-container {
    max-width: 1600px;
    margin: 0 auto;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  .pipeline-section {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .pipeline-metrics {
    display: flex;
    gap: 2rem;
  }

  .metric {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .metric strong {
    color: #111827;
    font-weight: 600;
  }

  .activity-section {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  /* Responsive */
  @media (max-width: 1280px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
