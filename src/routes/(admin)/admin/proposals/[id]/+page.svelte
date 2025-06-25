<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { Proposal, Company, Contact } from "$lib/types";
  import ProposalHeader from "$lib/components/proposals/ProposalHeader.svelte";
  import ClientInfoCard from "$lib/components/proposals/ClientInfoCard.svelte";
  import LineItemsCard from "$lib/components/proposals/LineItemsCard.svelte";
  import ProposalSidebar from "$lib/components/proposals/ProposalSidebar.svelte";

  let proposal: Proposal | null = null;
  let company: Company | null = null;
  let contact: Contact | null = null;
  let loading = true;
  let error = "";

  $: proposalId = $page.params.id;

  onMount(async () => {
    await loadProposal();
  });

  async function loadProposal() {
    try {
      loading = true;

      // Load proposal
      const proposalResponse = await fetch(`/api/proposals/${proposalId}`);
      if (!proposalResponse.ok) {
        throw new Error("Proposal not found");
      }
      proposal = await proposalResponse.json();

      // Load company details
      if (proposal?.company_id) {
        const companyResponse = await fetch(
          `/api/companies/${proposal.company_id}`
        );
        if (companyResponse.ok) {
          company = await companyResponse.json();
        }
      }

      // Load contact details if exists
      if (proposal?.contact_id) {
        const contactResponse = await fetch(
          `/api/contacts/${proposal.contact_id}`
        );
        if (contactResponse.ok) {
          contact = await contactResponse.json();
        }
      }
    } catch (err) {
      console.error("Error loading proposal:", err);
      error = err instanceof Error ? err.message : "Failed to load proposal";
    } finally {
      loading = false;
    }
  }

  function handleBack() {
    goto("/admin/proposals");
  }
</script>

<svelte:head>
  <title>{proposal ? proposal.title : "Proposal"} | TrueForm Admin</title>
</svelte:head>

{#if loading}
  <div class="flex items-center justify-center py-12">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
    />
    <span class="ml-3 text-gray-600">Loading proposal...</span>
  </div>
{:else if error}
  <div class="tf-card border-red-200 bg-red-50">
    <div class="tf-card-body">
      <div class="flex items-center gap-3">
        <svg
          class="w-5 h-5 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h4 class="font-medium text-red-900">Error Loading Proposal</h4>
          <p class="text-red-700 text-sm">{error}</p>
        </div>
      </div>
      <div class="mt-4">
        <button class="tf-btn tf-btn-outline" on:click={handleBack}>
          Back to Proposals
        </button>
      </div>
    </div>
  </div>
{:else if proposal}
  <div class="space-y-6">
    <!-- Header -->
    <ProposalHeader {proposal} onBack={handleBack} />

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Client Information -->
        <ClientInfoCard {company} {contact} />

        <!-- Line Items -->
        <LineItemsCard {proposal} />
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <ProposalSidebar {proposal} />
      </div>
    </div>
  </div>
{/if}
