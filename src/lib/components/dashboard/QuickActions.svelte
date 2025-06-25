<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Plus, MessageSquare, FileText, Users } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  const actions = [
    { id: "new-company", label: "New Company", icon: Plus },
    { id: "new-contact", label: "New Contact", icon: Users },
    { id: "new-proposal", label: "New Proposal", icon: FileText },
    { id: "view-messages", label: "Messages", icon: MessageSquare },
  ];

  function handleAction(actionId: string) {
    dispatch("action", actionId);
  }
</script>

<div class="quick-actions">
  {#each actions as action}
    <button
      on:click={() => handleAction(action.id)}
      class="action-button"
      title={action.label}
    >
      <svelte:component this={action.icon} size={20} />
      <span class="action-label">{action.label}</span>
    </button>
  {/each}
</div>

<style>
  .quick-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .action-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  .action-button:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .action-label {
      display: none;
    }

    .action-button {
      padding: 0.5rem;
    }
  }
</style>
