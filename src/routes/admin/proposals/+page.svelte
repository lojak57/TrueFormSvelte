<script lang="ts">
  import { onMount } from "svelte";
  import type { Proposal } from "$lib/types";
  import CRMHeader from "$lib/components/ui/CRMHeader.svelte";
  import { FileText, Plus, Building2, Download, ChevronRight, Calendar } from "lucide-svelte";

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
        console.log("Proposals API response:", data);
        // Ensure we always have an array
        proposals = Array.isArray(data) ? data : data.proposals || [];
        console.log("Final proposals array:", proposals);
      } else {
        console.log(
          "API response not OK:",
          response.status,
          response.statusText
        );
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

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusGradient(status: string): string {
    switch (status) {
      case "draft":
        return "from-gray-400 to-gray-500";
      case "sent":
        return "from-blue-400 to-blue-600";
      case "accepted":
        return "from-green-400 to-green-600";
      case "rejected":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  }

  function getStatusDot(status: string): string {
    switch (status) {
      case "draft":
        return "bg-gray-500";
      case "sent":
        return "bg-blue-500";
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  async function downloadPDF(proposalId: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/proposals/${proposalId}/pdf?payment_qr=true&acceptance_qr=true`
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the filename from response headers
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `proposal-${proposalId.slice(-8)}.pdf`;

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/i);
        if (matches) {
          filename = matches[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
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
        <div
          class="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
        >
          <a href="/admin/proposals/{proposal.id}" class="block">
            <!-- Card Header with Status Indicator -->
            <div class="relative">
              <!-- Status accent bar -->
              <div
                class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {getStatusGradient(
                  proposal.status
                )}"
              />

              <div class="p-6 pb-4">
                <div class="flex items-start justify-between gap-4">
                  <!-- Main proposal info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                      <h3
                        class="text-xl font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors"
                      >
                        {proposal.title}
                      </h3>
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {getStatusColor(
                          proposal.status
                        )} flex-shrink-0"
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full {getStatusDot(
                            proposal.status
                          )} mr-1.5"
                        />
                        {proposal.status}
                      </span>
                    </div>

                    <!-- Company info with icon -->
                    <div class="flex items-center text-sm text-gray-600 mb-3">
                      <div
                        class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5"
                      >
                        <Building2 size={16} class="text-slate-500" />
                        <span class="font-medium"
                          >Company #{proposal.company_id?.slice(-8)}</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Total value - prominent display -->
                  <div class="text-right flex-shrink-0">
                    <div class="text-3xl font-bold text-blue-600">
                      {formatCurrency(proposal.total)}
                    </div>
                    <div class="text-sm text-gray-500 font-medium">
                      Total Value
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="px-6 pb-4">
              <!-- Services preview -->
              {#if proposal.line_items && proposal.line_items.length > 0}
                <div class="mb-4">
                  <div
                    class="flex items-center gap-2 text-sm text-gray-600 mb-2"
                  >
                    <FileText size={16} class="text-slate-600" />
                    <span class="font-medium"
                      >{proposal.line_items.length} Services</span
                    >
                  </div>
                  <div class="flex flex-wrap gap-2">
                    {#each proposal.line_items.slice(0, 3) as item}
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {item.name}
                      </span>
                    {/each}
                    {#if proposal.line_items.length > 3}
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                      >
                        +{proposal.line_items.length - 3} more
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}

              <!-- Metadata row -->
              <div
                class="flex items-center justify-between text-sm text-gray-500"
              >
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1.5">
                    <Calendar size={16} class="text-slate-500" />
                    <span>Created {formatDate(proposal.created_at)}</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div
                  class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    on:click={(e) => downloadPDF(proposal.id, e)}
                    title="Download PDF"
                  >
                    <Download size={14} />
                    PDF
                  </button>

                  <div
                    class="flex items-center gap-1.5 text-blue-600 text-xs font-medium"
                  >
                    <span>View Details</span>
                    <ChevronRight size={16} class="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .proposals-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .executive-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #475569 0%, #64748b 100%);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 8px rgba(71, 85, 105, 0.2);
    border: none;
    cursor: pointer;
  }

  .executive-button:hover {
    background: linear-gradient(135deg, #334155 0%, #475569 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(71, 85, 105, 0.3);
  }

  .button-icon {
    transition: transform 0.2s ease;
  }

  .executive-button:hover .button-icon {
    transform: rotate(90deg);
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    max-width: 1200px;
    margin: 0 auto 24px;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid rgba(148, 163, 184, 0.2);
    border-top: 2px solid #475569;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    margin-left: 0.75rem;
    color: #475569;
    font-weight: 500;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    max-width: 1200px;
    margin: 0 auto 24px;
  }

  .empty-icon {
    margin: 0 auto 1.5rem;
    display: flex;
    justify-content: center;
  }

  .empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 0.5rem 0;
  }

  .empty-description {
    color: #475569;
    margin: 0 0 1.5rem 0;
  }

  .empty-action {
    display: flex;
    justify-content: center;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Proposal cards container */
  .grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 24px;
    gap: 24px;
    display: grid;
  }

  /* Update existing card styles for luxury theme */
  :global(.group) {
    background: rgba(255, 255, 255, 0.8) !important;
    border: 1px solid rgba(148, 163, 184, 0.2) !important;
    backdrop-filter: blur(8px);
    transition: all 0.3s ease !important;
  }

  :global(.group:hover) {
    background: rgba(255, 255, 255, 0.95) !important;
    border-color: rgba(148, 163, 184, 0.3) !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(71, 85, 105, 0.15) !important;
  }

  :global(.group .text-xl) {
    color: #0f172a !important;
    letter-spacing: -0.01em;
  }

  :global(.group:hover .text-xl) {
    color: #475569 !important;
  }

  :global(.group .text-3xl) {
    color: #475569 !important;
    letter-spacing: -0.02em;
  }

  :global(.group .text-sm.text-gray-600) {
    color: #64748b !important;
  }

  :global(.group .text-sm.text-gray-500) {
    color: rgba(255, 255, 255, 0.75) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  :global(.group .text-sm.text-gray-600) {
    color: rgba(255, 255, 255, 0.8) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .grid {
      padding: 0 16px 16px;
    }

    .header-actions {
      width: 100%;
      justify-content: center;
    }

    .executive-button {
      width: 100%;
      justify-content: center;
    }
  }
</style>
