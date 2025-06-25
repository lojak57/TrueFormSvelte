<script lang="ts">
  import type { DealWithDetails, PipelineMetrics } from "$lib/types";
  import DealCard from "./DealCard.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  export let deals: DealWithDetails[] = [];
  export let metrics: PipelineMetrics | null = null;
  export let loading = false;

  const dispatch = createEventDispatcher();

  const stages = [
    { key: "lead", name: "Lead", description: "Initial interest" },
    {
      key: "qualified",
      name: "Qualified",
      description: "Budget & need confirmed",
    },
    { key: "proposal", name: "Proposal", description: "Proposal sent" },
    {
      key: "negotiation",
      name: "Negotiation",
      description: "Terms discussion",
    },
    { key: "closed_won", name: "Closed Won", description: "Deal won!" },
    { key: "closed_lost", name: "Closed Lost", description: "Deal lost" },
  ];

  const stageColors = {
    lead: "border-gray-300 bg-gray-50",
    qualified: "border-blue-300 bg-blue-50",
    proposal: "border-yellow-300 bg-yellow-50",
    negotiation: "border-orange-300 bg-orange-50",
    closed_won: "border-green-300 bg-green-50",
    closed_lost: "border-red-300 bg-red-50",
  };

  // Group deals by stage
  $: dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.key] = deals.filter((deal) => deal.stage === stage.key);
    return acc;
  }, {} as Record<string, DealWithDetails[]>);

  // Calculate stage values
  $: stageValues = stages.reduce((acc, stage) => {
    const stageDeals = dealsByStage[stage.key] || [];
    acc[stage.key] = {
      count: stageDeals.length,
      value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
      weightedValue: stageDeals.reduce(
        (sum, deal) => sum + (deal.value * deal.probability) / 100,
        0
      ),
    };
    return acc;
  }, {} as Record<string, { count: number; value: number; weightedValue: number }>);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const handleStageChange = (event: CustomEvent) => {
    dispatch("stageChange", event.detail);
  };

  const handleDealClick = (event: CustomEvent) => {
    dispatch("dealClick", event.detail);
  };

  const handleViewDetails = (event: CustomEvent) => {
    dispatch("viewDetails", event.detail);
  };

  const handleAddDeal = (stage: string) => {
    dispatch("addDeal", { stage });
  };
</script>

<div class="bg-white rounded-lg shadow-sm border">
  <!-- Pipeline Header -->
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
        <p class="text-sm text-gray-600 mt-1">
          Track deals through your sales process
        </p>
      </div>

      {#if metrics}
        <div class="flex items-center space-x-6 text-sm">
          <div class="text-center">
            <div class="font-semibold text-gray-900">
              {formatCurrency(metrics.total_pipeline_value)}
            </div>
            <div class="text-gray-600">Total Pipeline</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-green-600">
              {formatCurrency(metrics.weighted_pipeline_value)}
            </div>
            <div class="text-gray-600">Weighted Value</div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Pipeline Stages -->
  <div class="p-6">
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        />
        <span class="ml-3 text-gray-600">Loading pipeline...</span>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {#each stages as stage}
          {@const stageDeals = dealsByStage[stage.key] || []}
          {@const stageStats = stageValues[stage.key]}

          <div
            class="border-2 border-dashed rounded-lg p-4 min-h-[400px] {stageColors[
              stage.key
            ]}"
          >
            <!-- Stage Header -->
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">{stage.name}</h3>
                <span class="text-sm font-medium text-gray-600"
                  >({stageStats.count})</span
                >
              </div>
              <p class="text-xs text-gray-600 mt-1">{stage.description}</p>

              <!-- Stage Metrics -->
              <div class="mt-2 space-y-1">
                <div class="text-xs text-gray-700">
                  <span class="font-medium">Total:</span>
                  {formatCurrency(stageStats.value)}
                </div>
                {#if stage.key !== "closed_won" && stage.key !== "closed_lost"}
                  <div class="text-xs text-gray-700">
                    <span class="font-medium">Weighted:</span>
                    {formatCurrency(stageStats.weightedValue)}
                  </div>
                {/if}
              </div>
            </div>

            <!-- Add Deal Button -->
            <button
              class="w-full mb-3 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              on:click={() => handleAddDeal(stage.key)}
            >
              + Add Deal
            </button>

            <!-- Deals in Stage -->
            <div class="space-y-3">
              {#each stageDeals as deal}
                <DealCard
                  {deal}
                  compact={true}
                  on:stageChange={handleStageChange}
                  on:click={handleDealClick}
                  on:viewDetails={handleViewDetails}
                />
              {/each}
            </div>

            <!-- Empty State -->
            {#if stageDeals.length === 0}
              <div class="text-center py-8 text-gray-500">
                <svg
                  class="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p class="text-xs">No deals in {stage.name.toLowerCase()}</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Pipeline Metrics Footer -->
  {#if metrics && !loading}
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center">
          <div class="font-semibold text-gray-900">
            {metrics.conversion_rates.lead_to_qualified.toFixed(1)}%
          </div>
          <div class="text-gray-600">Lead → Qualified</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-900">
            {metrics.conversion_rates.qualified_to_won.toFixed(1)}%
          </div>
          <div class="text-gray-600">Qualified → Won</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-900">
            {Object.values(dealsByStage).flat().length}
          </div>
          <div class="text-gray-600">Total Active Deals</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-900">
            {formatCurrency(
              Object.values(dealsByStage)
                .flat()
                .reduce((sum, deal) => sum + deal.value, 0) /
                Object.values(dealsByStage).flat().length || 0
            )}
          </div>
          <div class="text-gray-600">Avg Deal Size</div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Ensure consistent column heights on larger screens */
  @media (min-width: 1024px) {
    .grid > div {
      height: 500px;
      overflow-y: auto;
    }
  }
</style>
