<script lang="ts">
  import type { Proposal } from "$lib/types";
  import { formatDate } from "$lib/utils/proposalHelpers";

  export let proposal: Proposal;
</script>

<div class="sticky top-6 space-y-6">
  <!-- Proposal Details -->
  <div class="tf-card">
    <div class="tf-card-header">
      <h3 class="tf-card-title">Proposal Details</h3>
    </div>
    <div class="tf-card-body space-y-3">
      <div>
        <span class="text-sm font-medium text-gray-500">Created</span>
        <p class="text-gray-900">{formatDate(proposal.created_at)}</p>
      </div>
      {#if proposal.sent_at}
        <div>
          <span class="text-sm font-medium text-gray-500">Sent</span>
          <p class="text-gray-900">{formatDate(proposal.sent_at)}</p>
        </div>
      {/if}
      {#if proposal.expires_at}
        <div>
          <span class="text-sm font-medium text-gray-500">Expires</span>
          <p class="text-gray-900">{formatDate(proposal.expires_at)}</p>
        </div>
      {/if}
      {#if proposal.accepted_at}
        <div>
          <span class="text-sm font-medium text-gray-500">Accepted</span>
          <p class="text-gray-900">{formatDate(proposal.accepted_at)}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Terms and Notes -->
  {#if proposal.terms || proposal.notes}
    <div class="tf-card">
      <div class="tf-card-header">
        <h3 class="tf-card-title">Additional Information</h3>
      </div>
      <div class="tf-card-body space-y-4">
        {#if proposal.terms}
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Terms & Conditions</h4>
            <p class="text-sm text-gray-600 whitespace-pre-wrap">
              {proposal.terms}
            </p>
          </div>
        {/if}
        {#if proposal.notes}
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Internal Notes</h4>
            <p class="text-sm text-gray-600 whitespace-pre-wrap">
              {proposal.notes}
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
