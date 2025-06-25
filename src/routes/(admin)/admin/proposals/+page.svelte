<script lang="ts">
  import { onMount } from "svelte";
  import type { Proposal } from "$lib/types";
  import CRMHeader from "$lib/components/ui/CRMHeader.svelte";
  import ProposalListCard from "$lib/components/proposals/ProposalListCard.svelte";
  import { FileText, Plus } from "lucide-svelte";

  let proposals: Proposal[] = [];
  let loading = true;
  let error = "";

  onMount(async () => {
    await loadProposals();
  });

  async function loadProposals() {
    try {
      loading = true;
      const response = await fetch("/api/proposals");
      if (response.ok) {
        const data = await response.json();
        // Ensure we always have an array
        proposals = Array.isArray(data) ? data : data.proposals || [];
      } else {
        // If API doesn't exist yet, show empty state
        proposals = [];
      }
    } catch (err) {
      console.error("Error loading proposals:", err);
      proposals = [];
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Strategic Proposals | Command Center</title>
</svelte:head>

<div class="proposals-page">
  <CRMHeader
    title="Strategic Proposals Portfolio"
    subtitle="Craft and oversee high-value client engagements with sophistication"
    icon={FileText}
  >
    <div slot="actions" class="header-actions">
      <a href="/admin/proposals/new" class="action-button executive-button">
        <Plus size={18} class="button-icon" />
        Draft New Proposal
      </a>
    </div>
  </CRMHeader>

  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner" />
      <span class="loading-text">Retrieving proposals...</span>
    </div>
  {:else if proposals.length === 0}
    <!-- Elegant Empty State -->
    <div class="empty-state">
      <div class="empty-icon">
        <FileText size={48} class="text-slate-400" />
      </div>
      <h3 class="empty-title">No Proposals in Portfolio</h3>
      <p class="empty-description">
        Begin crafting your first strategic client proposal.
      </p>
      <div class="empty-action">
        <a href="/admin/proposals/new" class="executive-button">
          <Plus size={18} class="button-icon" />
          Create Inaugural Proposal
        </a>
      </div>
    </div>
  {:else}
    <!-- Proposals List - Modern Card Layout -->
    <div class="grid gap-6">
      {#each proposals as proposal}
        <ProposalListCard {proposal} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .proposals-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 2rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .executive-button {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .executive-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.6);
  }

  .button-icon {
    flex-shrink: 0;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 20rem;
    gap: 1rem;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    color: #6b7280;
    font-weight: 500;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 1.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .empty-icon {
    margin: 0 auto 1.5rem;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.75rem 0;
  }

  .empty-description {
    color: #6b7280;
    font-size: 1rem;
    margin: 0 0 2rem 0;
    max-width: 28rem;
    margin-left: auto;
    margin-right: auto;
  }

  .empty-action {
    display: flex;
    justify-content: center;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    .proposals-page {
      padding: 1rem;
    }
  }
</style>
