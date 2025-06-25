<script lang="ts">
  import type { Deal, DealWithDetails } from "$lib/types";
  import { createEventDispatcher } from "svelte";

  export let deal: DealWithDetails;
  export let showCompany = true;
  export let compact = false;

  const dispatch = createEventDispatcher();

  const stageColors = {
    lead: "bg-gray-100 text-gray-800 border-gray-200",
    qualified: "bg-blue-100 text-blue-800 border-blue-200",
    proposal: "bg-yellow-100 text-yellow-800 border-yellow-200",
    negotiation: "bg-orange-100 text-orange-800 border-orange-200",
    closed_won: "bg-green-100 text-green-800 border-green-200",
    closed_lost: "bg-red-100 text-red-800 border-red-200",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStageDisplayName = (stage: string) => {
    return stage.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleStageChange = (newStage: string) => {
    dispatch("stageChange", { dealId: deal.id, newStage });
  };

  const handleCardClick = () => {
    dispatch("click", deal);
  };
</script>

<div
  class="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
  class:p-3={compact}
  class:p-4={!compact}
  on:click={handleCardClick}
  on:keydown={(e) => e.key === "Enter" && handleCardClick()}
  role="button"
  tabindex="0"
>
  <!-- Header -->
  <div class="flex justify-between items-start mb-3">
    <div class="flex-1 min-w-0">
      <h3
        class="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors"
      >
        {deal.name}
      </h3>
      {#if showCompany && deal.company}
        <p class="text-sm text-gray-600 truncate">{deal.company.name}</p>
      {/if}
    </div>
    <span
      class="px-2 py-1 text-xs font-medium rounded-full border {stageColors[
        deal.stage
      ]} ml-2 flex-shrink-0"
    >
      {getStageDisplayName(deal.stage)}
    </span>
  </div>

  <!-- Deal Details -->
  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Value:</span>
      <span class="font-semibold text-green-600"
        >{formatCurrency(deal.value)}</span
      >
    </div>

    {#if !compact}
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Probability:</span>
        <div class="flex items-center">
          <span class="font-medium text-sm mr-2">{deal.probability}%</span>
          <div class="w-16 bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style="width: {deal.probability}%"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Expected Close:</span>
        <span
          class="font-medium text-sm"
          class:text-red-600={deal.expected_close_date &&
            new Date(deal.expected_close_date) < new Date()}
        >
          {formatDate(deal.expected_close_date)}
        </span>
      </div>

      {#if deal.contact}
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Contact:</span>
          <span class="font-medium text-sm truncate ml-2">
            {deal.contact.first_name}
            {deal.contact.last_name}
          </span>
        </div>
      {/if}
    {/if}
  </div>

  <!-- Actions -->
  {#if !compact}
    <div class="mt-4 flex gap-2">
      <button
        class="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
        on:click|stopPropagation={() => dispatch("viewDetails", deal)}
      >
        View Details
      </button>

      <select
        class="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white hover:border-gray-400 transition-colors"
        value={deal.stage}
        on:change={(e) => handleStageChange(e.target.value)}
        on:click|stopPropagation
      >
        <option value="lead">Lead</option>
        <option value="qualified">Qualified</option>
        <option value="proposal">Proposal</option>
        <option value="negotiation">Negotiation</option>
        <option value="closed_won">Closed Won</option>
        <option value="closed_lost">Closed Lost</option>
      </select>
    </div>
  {/if}

  <!-- Compact mode footer -->
  {#if compact}
    <div
      class="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center"
    >
      <span class="text-xs text-gray-500"
        >{deal.probability}% • {formatDate(deal.expected_close_date)}</span
      >
      <button
        class="text-xs text-blue-600 hover:text-blue-700 font-medium"
        on:click|stopPropagation={() => dispatch("viewDetails", deal)}
      >
        View
      </button>
    </div>
  {/if}
</div>

<style>
  /* Custom scrollbar for mobile */
  @media (max-width: 640px) {
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  }
</style>
