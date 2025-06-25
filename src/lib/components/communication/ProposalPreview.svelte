<script lang="ts">
  import { formatCurrency } from "$lib/utils";

  export let proposal: any; // This would be a proper Proposal type
  export let compact = false;

  function handleView() {
    // Navigate to proposal view
    window.open(`/admin/proposals/${proposal.id}`, "_blank");
  }

  function handleDownload() {
    // Download proposal PDF
    window.open(`/api/proposals/${proposal.id}/pdf`, "_blank");
  }

  $: statusColor =
    {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      viewed: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }[proposal.status || "draft"] || "bg-gray-100 text-gray-800";
</script>

<div
  class="bg-white bg-opacity-10 rounded-lg p-3 border border-white border-opacity-20"
>
  <div class="flex items-start space-x-3">
    <!-- Proposal icon -->
    <div class="text-2xl flex-shrink-0">📋</div>

    <!-- Proposal info -->
    <div class="flex-1 min-w-0">
      <h4 class="font-medium text-sm truncate">
        {proposal.title || `Proposal #${proposal.proposal_number || "Unknown"}`}
      </h4>

      {#if !compact}
        <div class="flex items-center space-x-2 mt-1">
          <span class="px-2 py-1 text-xs rounded-full {statusColor}">
            {proposal.status?.toUpperCase() || "DRAFT"}
          </span>
          {#if proposal.total_amount}
            <span class="text-sm font-medium text-green-400">
              {formatCurrency(proposal.total_amount)}
            </span>
          {/if}
        </div>

        {#if proposal.company?.name}
          <p class="text-xs opacity-75 mt-1">
            For: {proposal.company.name}
          </p>
        {/if}
      {:else}
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs opacity-75">
            {proposal.status?.toUpperCase() || "DRAFT"}
          </span>
          {#if proposal.total_amount}
            <span class="text-xs font-medium">
              {formatCurrency(proposal.total_amount)}
            </span>
          {/if}
        </div>
      {/if}

      {#if proposal.created_at}
        <p class="text-xs opacity-75 mt-1">
          Created: {new Date(proposal.created_at).toLocaleDateString()}
        </p>
      {/if}
    </div>

    <!-- Actions -->
    {#if !compact}
      <div class="flex space-x-1 flex-shrink-0">
        <button
          class="p-1 hover:bg-white hover:bg-opacity-20 rounded text-xs"
          on:click={handleView}
          title="View proposal"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <button
          class="p-1 hover:bg-white hover:bg-opacity-20 rounded text-xs"
          on:click={handleDownload}
          title="Download PDF"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>
      </div>
    {/if}
  </div>

  {#if compact}
    <div class="flex justify-between items-center mt-2">
      <button
        class="text-xs underline hover:no-underline"
        on:click={handleView}
      >
        View
      </button>
      <button
        class="text-xs underline hover:no-underline"
        on:click={handleDownload}
      >
        Download
      </button>
    </div>
  {/if}
</div>
