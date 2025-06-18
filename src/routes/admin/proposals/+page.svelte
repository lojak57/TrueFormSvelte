<script lang="ts">
  import { onMount } from "svelte";
  import type { Proposal } from "$lib/types";

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
  <title>Proposals | TrueForm Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-semibold text-gray-900">Proposals</h1>
      <p class="text-gray-600 mt-1">Create and manage client proposals</p>
    </div>
    <a
      href="/admin/proposals/new"
      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      New Proposal
    </a>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      />
      <span class="ml-3 text-gray-600">Loading proposals...</span>
    </div>
  {:else if proposals.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No proposals</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating your first proposal.
      </p>
      <div class="mt-6">
        <a
          href="/admin/proposals/new"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Your First Proposal
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
                        <svg
                          class="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path
                            fill-rule="evenodd"
                            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                            clip-rule="evenodd"
                          />
                        </svg>
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
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
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
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 0h10m-10 0l.5 9a1 1 0 001 1h9a1 1 0 001-1l.5-9"
                      />
                    </svg>
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
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    PDF
                  </button>

                  <div
                    class="flex items-center gap-1.5 text-blue-600 text-xs font-medium"
                  >
                    <span>View Details</span>
                    <svg
                      class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
