<!-- Quick Actions Component -->
<script lang="ts">
  import { FileText, Users, Plus, Zap } from "lucide-svelte";
  import Button from "../ui/Button.svelte";
  import { goto } from "$app/navigation";

  export let showOpportunities = true;
  export let showProposals = false;
  export let compact = false;

  function createProposal() {
    // Redirect to projects instead since proposals are removed
    goto("/admin/projects");
  }

  function createFromOpportunity() {
    // Redirect to companies instead since proposals are removed
    goto("/admin/companies");
  }

  function viewOpportunities() {
    goto("/admin/opportunities");
  }

  function viewProposals() {
    // Proposals functionality removed
    throw new Error("Proposals functionality has been removed");
  }
</script>

<div class="quick-actions flex items-center space-x-3">
  {#if compact}
    <!-- Compact Mode - Just Icons -->
    {#if showProposals}
      <Button
        variant="accent"
        size="sm"
        class="p-2"
        on:click={createProposal}
        title="Create New Proposal"
      >
        <FileText size={18} />
      </Button>
    {/if}

    {#if showOpportunities}
      <Button
        variant="outline"
        size="sm"
        class="p-2"
        on:click={viewOpportunities}
        title="View Opportunities"
      >
        <Users size={18} />
      </Button>
    {/if}
  {:else}
    <!-- Full Mode - With Labels -->
    {#if showProposals}
      <Button variant="accent" on:click={createProposal}>
        <FileText size={20} class="mr-2" />
        New Proposal
      </Button>

      <Button variant="outline" on:click={createFromOpportunity}>
        <Users size={20} class="mr-2" />
        From Opportunity
      </Button>
    {/if}

    {#if showOpportunities}
      <Button variant="outline" on:click={viewOpportunities}>
        <Zap size={20} class="mr-2" />
        Opportunities
      </Button>
    {/if}
  {/if}
</div>

<style>
  .quick-actions {
    /* Add any custom styling here */
  }
</style>
