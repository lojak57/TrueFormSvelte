<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Card from "../ui/Card.svelte";
  import Button from "../ui/Button.svelte";
  import {
    Plus,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    FileText,
  } from "lucide-svelte";
  import {
    getTrueFormOpportunities,
    updateOpportunityStatus,
  } from "$lib/api/trueform";
  import type { TrueFormOpportunity } from "$lib/api/trueform";

  let opportunities: TrueFormOpportunity[] = [];
  let loading = true;
  let error = "";

  const columns = [
    { id: "new", title: "New Leads", color: "bg-blue-50 border-blue-200" },
    {
      id: "qualified",
      title: "Qualified",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      id: "proposal",
      title: "Proposal Sent",
      color: "bg-purple-50 border-purple-200",
    },
    {
      id: "negotiation",
      title: "Negotiation",
      color: "bg-orange-50 border-orange-200",
    },
    {
      id: "closed_won",
      title: "Closed Won",
      color: "bg-green-50 border-green-200",
    },
    {
      id: "closed_lost",
      title: "Closed Lost",
      color: "bg-gray-50 border-gray-200",
    },
  ];

  onMount(async () => {
    await loadOpportunities();
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

  function getOpportunitiesByStatus(status: string) {
    return opportunities.filter((opp) => opp.status === status);
  }

  async function moveOpportunity(opportunityId: string, newStatus: string) {
    try {
      await updateOpportunityStatus(opportunityId, newStatus);
      await loadOpportunities(); // Reload to get updated data
    } catch (err) {
      console.error("Error updating opportunity:", err);
      error =
        err instanceof Error ? err.message : "Failed to update opportunity";
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function isRecentOpportunity(dateString: string) {
    const created = new Date(dateString);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  }

  function getStatusColor(status: string) {
    const colorMap = {
      new: "bg-blue-100 text-blue-800",
      qualified: "bg-yellow-100 text-yellow-800",
      proposal: "bg-purple-100 text-purple-800",
      negotiation: "bg-orange-100 text-orange-800",
      closed_won: "bg-green-100 text-green-800",
      closed_lost: "bg-gray-100 text-gray-800",
    };
    return (
      colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
    );
  }

  // Drag and drop handlers
  let draggedOpportunity: TrueFormOpportunity | null = null;

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
      <!-- Proposals functionality removed -->
      <Button variant="outline" disabled>
        <FileText size={20} class="mr-2" />
        Proposals (Removed)
      </Button>
      <Button variant="accent" class="flex items-center gap-2">
        <Plus size={20} />
        Add Opportunity
      </Button>
    </div>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4" in:fade>
      <p class="text-red-700">{error}</p>
      <Button
        variant="outline"
        size="sm"
        on:click={loadOpportunities}
        class="mt-2"
      >
        Retry
      </Button>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"
      />
    </div>
  {:else}
    <!-- Kanban Board -->
    <div class="flex gap-6 overflow-x-auto pb-6">
      {#each columns as column}
        <div class="flex-shrink-0 w-80">
          <div class="sticky top-0 z-10 bg-white pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">{column.title}</h3>
              <span
                class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {getOpportunitiesByStatus(column.id).length}
              </span>
            </div>
          </div>

          <!-- Drop Zone -->
          <div
            class="min-h-96 p-4 rounded-lg border-2 border-dashed {column.color} transition-colors"
            on:dragover={handleDragOver}
            on:drop={handleDrop(column.id)}
          >
            <div class="space-y-4">
              {#each getOpportunitiesByStatus(column.id) as opportunity}
                <div
                  class="cursor-grab active:cursor-grabbing"
                  draggable="true"
                  on:dragstart={handleDragStart(opportunity)}
                  in:fade={{ duration: 200 }}
                >
                  <Card
                    class="p-4 hover:shadow-md transition-shadow {isRecentOpportunity(
                      opportunity.created_at
                    )
                      ? 'ring-2 ring-blue-200 bg-blue-50'
                      : ''}"
                  >
                    <!-- Opportunity Header -->
                    <div class="flex justify-between items-start mb-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <h4
                            class="font-semibold text-gray-900 text-sm leading-tight"
                          >
                            {opportunity.name}
                          </h4>
                          {#if isRecentOpportunity(opportunity.created_at)}
                            <span
                              class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                              >NEW</span
                            >
                          {/if}
                        </div>
                        <p class="text-xs text-gray-600 mt-1">
                          {opportunity.company}
                        </p>
                      </div>
                      <div class="text-right">
                        <span class="text-xl font-bold text-green-600">
                          {formatCurrency(opportunity.value)}
                        </span>
                        <div class="text-xs text-gray-500 mt-1">
                          {opportunity.probability}% prob
                        </div>
                      </div>
                    </div>

                    <!-- Contact Info -->
                    <div class="space-y-2 mb-3">
                      <div
                        class="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <Mail size={12} />
                        <span class="truncate">{opportunity.email}</span>
                      </div>
                      {#if opportunity.phone}
                        <div
                          class="flex items-center gap-2 text-xs text-gray-600"
                        >
                          <Phone size={12} />
                          <span>{opportunity.phone}</span>
                        </div>
                      {/if}
                    </div>

                    <!-- Project Notes Preview -->
                    {#if opportunity.notes}
                      <div class="mb-3 p-2 bg-gray-50 rounded text-xs">
                        <div class="text-gray-700 line-clamp-3">
                          {opportunity.notes
                            .split("\n")
                            .slice(0, 2)
                            .join(" • ")}
                        </div>
                      </div>
                    {/if}

                    <!-- Opportunity Details -->
                    <div class="flex items-center justify-between text-xs">
                      <span
                        class="px-2 py-1 rounded-full {getStatusColor(
                          opportunity.status
                        )}"
                      >
                        {opportunity.probability}% prob
                      </span>
                      <span class="text-gray-500">
                        {formatDate(opportunity.created_at)}
                      </span>
                    </div>

                    <!-- Quick Actions -->
                    <div class="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        class="flex-1 text-xs"
                      >
                        View Details
                      </Button>
                      {#if opportunity.status === "qualified"}
                        <Button
                          variant="accent"
                          size="sm"
                          class="flex items-center gap-1 text-xs"
                          disabled
                        >
                          Proposals Removed
                        </Button>
                      {:else if opportunity.status === "proposal"}
                        <Button
                          variant="outline"
                          size="sm"
                          class="flex items-center gap-1 text-xs"
                          disabled
                        >
                          Proposals Removed
                        </Button>
                      {:else}
                        <Button
                          variant="outline"
                          size="sm"
                          class="flex items-center gap-1"
                        >
                          <Phone size={12} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          class="flex items-center gap-1"
                        >
                          <Mail size={12} />
                        </Button>
                      {/if}
                    </div>
                  </Card>
                </div>
              {/each}

              <!-- Empty State -->
              {#if getOpportunitiesByStatus(column.id).length === 0}
                <div class="text-center py-8 text-gray-400">
                  <p class="text-sm">No opportunities</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
      <Card class="p-6 text-center">
        <div class="text-2xl font-bold text-blue-600 mb-2">
          {getOpportunitiesByStatus("new").length}
        </div>
        <p class="text-sm text-gray-600">New Leads</p>
      </Card>

      <Card class="p-6 text-center">
        <div class="text-2xl font-bold text-purple-600 mb-2">
          {getOpportunitiesByStatus("proposal").length}
        </div>
        <p class="text-sm text-gray-600">Proposals (Removed)</p>
      </Card>

      <Card class="p-6 text-center">
        <div class="text-2xl font-bold text-green-600 mb-2">
          {formatCurrency(
            opportunities
              .filter((o) => o.status === "closed_won")
              .reduce((sum, o) => sum + o.value, 0)
          )}
        </div>
        <p class="text-sm text-gray-600">Won This Month</p>
      </Card>

      <Card class="p-6 text-center">
        <div class="text-2xl font-bold text-orange-600 mb-2">
          {Math.round(
            opportunities
              .filter(
                (o) => o.status !== "closed_lost" && o.status !== "closed_won"
              )
              .reduce((sum, o) => sum + (o.value * o.probability) / 100, 0)
          )}
        </div>
        <p class="text-sm text-gray-600">Weighted Pipeline</p>
      </Card>
    </div>
  {/if}
</div>

<!-- Floating Action Button for Quick Proposal Creation -->
<div class="fixed bottom-6 right-6 z-50">
  <button
    class="bg-accent-600 hover:bg-accent-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group"
    disabled
    title="Create New Proposal"
  >
    <FileText size={24} />
    <span class="hidden group-hover:block text-sm font-medium"
      >New Proposal</span
    >
  </button>
</div>

<style>
  .cursor-grab {
    cursor: grab;
  }

  .active\:cursor-grabbing:active {
    cursor: grabbing;
  }
</style>
