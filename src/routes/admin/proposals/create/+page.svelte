<!-- Proposal Generator Page -->
<script lang="ts">
  import ProposalWizard from '$lib/components/proposals/ProposalWizard.svelte';
  import { goto } from '$app/navigation';

  function handleComplete(proposalId: string) {
    // Navigate to proposal details or list
    goto(`/admin/proposals/${proposalId}`);
  }

  function handleCancel() {
    // Navigate back to proposals list
    goto('/admin/proposals');
  }
</script>

<svelte:head>
  <title>Create Proposal | True-Form Admin</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
  <ProposalWizard 
    on:complete={(e) => handleComplete(e.detail.proposalId)}
    on:cancel={handleCancel}
  />
</div> 