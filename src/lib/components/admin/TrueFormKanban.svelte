<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../ui/Button.svelte";
  import KanbanColumn from "../kanban/KanbanColumn.svelte";
  import { Plus, FileText } from "lucide-svelte";
  import {
    getTrueFormOpportunities,
    updateOpportunityStatus,
  } from "$lib/api/trueform";
  import type { TrueFormOpportunity } from "$lib/api/trueform";
  import { kanbanColumns } from "$lib/data/kanbanData";
  import {
    getOpportunitiesByStatus,
    isRecentOpportunity,
    calculateTotalValue,
    formatCurrency,
  } from "$lib/utils/kanbanHelpers";

  let opportunities: TrueFormOpportunity[] = [];
  let loading = true;
  let error = "";
  let draggedOpportunity: TrueFormOpportunity | null = null;

  onMount(() => {
    loadOpportunities();
  });

  async function loadOpportunities() {
    try {
      loading = true;
      error = "";
      opportunities = await getTrueFormOpportunities();
    } catch (err) {
      console.error("Error loading opportunities:", err);
      error =
        err instanceof Error ? err.message : "Failed to load opportunities";
    } finally {
      loading = false;
    }
  }

  async function moveOpportunity(opportunityId: string, newStatus: string) {
    try {
      await updateOpportunityStatus(opportunityId, newStatus);
      await loadOpportunities();
    } catch (err) {
      console.error("Error updating opportunity:", err);
      error =
        err instanceof Error ? err.message : "Failed to update opportunity";
    }
  }

  function handleDragStart(opportunity: TrueFormOpportunity) {
    return function (event: Event) {
      draggedOpportunity = opportunity;
      const dragEvent = event as DragEvent;
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.effectAllowed = "move";
        dragEvent.dataTransfer.setData("text/plain", opportunity.id);
      }
    };
  }

  function handleDragOver(event: Event) {
    event.preventDefault();
    const dragEvent = event as DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = "move";
    }
  }

  function handleDrop(newStatus: string) {
    return function (event: Event) {
      event.preventDefault();
      if (draggedOpportunity && draggedOpportunity.status !== newStatus) {
        moveOpportunity(draggedOpportunity.id, newStatus);
      }
      draggedOpportunity = null;
    };
  }

  $: totalValue = calculateTotalValue(opportunities);
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">
        🎯 TrueForm Pipeline
      </h2>
      <p class="text-gray-600">Manage website development opportunities</p>
    </div>
    <div class="flex items-center space-x-3">
      <Button variant="outline" disabled>
        <FileText size={20} class="mr-2" />
        Proposals (Removed)
      </Button>
      <Button variant="accent" disabled>
        <Plus size={20} class="mr-2" />
        Add Opportunity (Coming Soon)
      </Button>
    </div>
  </div>

  <!-- Pipeline Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="text-sm text-gray-600">Total Opportunities</div>
      <div class="text-2xl font-bold text-gray-900">{opportunities.length}</div>
    </div>
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="text-sm text-gray-600">Pipeline Value</div>
      <div class="text-2xl font-bold text-green-600">
        {formatCurrency(totalValue)}
      </div>
    </div>
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="text-sm text-gray-600">Won This Month</div>
      <div class="text-2xl font-bold text-blue-600">
        {getOpportunitiesByStatus(opportunities, "closed_won").length}
      </div>
    </div>
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="text-sm text-gray-600">Active Deals</div>
      <div class="text-2xl font-bold text-orange-600">
        {opportunities.filter(
          (opp) => !["closed_won", "closed_lost"].includes(opp.status)
        ).length}
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="text-gray-500">Loading opportunities...</div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="text-red-800">Error: {error}</div>
      <Button variant="outline" class="mt-2" on:click={loadOpportunities}>
        Retry
      </Button>
    </div>
  {:else}
    <!-- Kanban Board -->
    <div class="overflow-x-auto">
      <div class="flex gap-6 min-w-fit pb-6">
        {#each kanbanColumns as column}
          <KanbanColumn
            {column}
            opportunities={getOpportunitiesByStatus(opportunities, column.id)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            {isRecentOpportunity}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
