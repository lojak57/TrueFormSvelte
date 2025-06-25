<script lang="ts">
  import type { Proposal } from "$lib/types";
  import { getStatusBadgeClass } from "$lib/utils/proposalHelpers";
  import { PDFService } from "$lib/services/pdfService";

  export let proposal: Proposal;
  export let onBack: () => void;

  async function handleDownloadPDF(event: Event) {
    event.preventDefault();

    const button = event.target as HTMLButtonElement;

    try {
      PDFService.setButtonLoading(button, true);
      await PDFService.downloadProposal(proposal.id);

      // Restore button after short delay
      setTimeout(() => {
        PDFService.setButtonLoading(button, false);
      }, 1000);
    } catch (error) {
      alert("Failed to generate PDF. Please try again.");
      PDFService.setButtonLoading(button, false);
    }
  }
</script>

<div class="flex items-start justify-between">
  <div>
    <div class="flex items-center gap-3 mb-2">
      <button class="tf-btn tf-btn-ghost tf-btn-sm" on:click={onBack}>
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Proposals
      </button>
      <span class={getStatusBadgeClass(proposal.status)}>
        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
      </span>
    </div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">
      {proposal.title}
    </h1>
    <p class="text-gray-600">
      Proposal #{proposal.id.slice(0, 8)}
    </p>
  </div>
  <div class="flex gap-3">
    <button class="tf-btn tf-btn-primary" on:click={handleDownloadPDF}>
      <svg
        class="w-4 h-4 mr-2"
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
      Download PDF
    </button>
  </div>
</div>
