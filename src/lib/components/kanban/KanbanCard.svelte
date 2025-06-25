<script lang="ts">
  import Card from "../ui/Card.svelte";
  import Button from "../ui/Button.svelte";
  import { Mail, Phone } from "lucide-svelte";
  import type { TrueFormOpportunity } from "$lib/api/trueform";

  export let opportunity: TrueFormOpportunity;
  export let isRecentOpportunity: (createdAt: string) => boolean;

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "qualified":
        return "bg-yellow-100 text-yellow-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "negotiation":
        return "bg-orange-100 text-orange-800";
      case "closed_won":
        return "bg-green-100 text-green-800";
      case "closed_lost":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
</script>

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
        <h4 class="font-semibold text-gray-900 text-sm leading-tight">
          {opportunity.name}
        </h4>
        {#if isRecentOpportunity(opportunity.created_at)}
          <span
            class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium"
          >
            NEW
          </span>
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
    <div class="flex items-center gap-2 text-xs text-gray-600">
      <Mail size={12} />
      <span class="truncate">{opportunity.email}</span>
    </div>
    {#if opportunity.phone}
      <div class="flex items-center gap-2 text-xs text-gray-600">
        <Phone size={12} />
        <span>{opportunity.phone}</span>
      </div>
    {/if}
  </div>

  <!-- Project Notes Preview -->
  {#if opportunity.notes}
    <div class="mb-3 p-2 bg-gray-50 rounded text-xs">
      <div class="text-gray-700 line-clamp-3">
        {opportunity.notes.split("\n").slice(0, 2).join(" • ")}
      </div>
    </div>
  {/if}

  <!-- Opportunity Details -->
  <div class="flex items-center justify-between text-xs">
    <span class="px-2 py-1 rounded-full {getStatusColor(opportunity.status)}">
      {opportunity.probability}% prob
    </span>
    <span class="text-gray-500">
      {formatDate(opportunity.created_at)}
    </span>
  </div>

  <!-- Quick Actions -->
  <div class="mt-3 pt-3 border-t border-gray-100 flex gap-2">
    <Button variant="outline" size="sm" class="flex-1 text-xs">
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
      <Button variant="outline" size="sm" class="flex items-center gap-1">
        <Phone size={12} />
      </Button>
      <Button variant="outline" size="sm" class="flex items-center gap-1">
        <Mail size={12} />
      </Button>
    {/if}
  </div>
</Card>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
