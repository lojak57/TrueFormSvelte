<script lang="ts">
  import ModernCard from "./ModernCard.svelte";
  import { createEventDispatcher } from "svelte";

  export let title: string;
  export let subtitle: string = "";
  export let description: string = "";
  export let status: "active" | "inactive" | "pending" | "draft" = "active";
  export let priority: "low" | "medium" | "high" | null = null;
  export let value: string = "";
  export let valueLabel: string = "";
  export let href: string | undefined = undefined;
  export let loading: boolean = false;
  export let actions: Array<{
    label: string;
    action: string;
    variant?: "primary" | "secondary" | "danger";
  }> = [];

  const dispatch = createEventDispatcher();

  const statusColors = {
    active: "#10b981",
    inactive: "#6b7280",
    pending: "#f59e0b",
    draft: "#8b5cf6",
  };

  const priorityColors = {
    low: "#06b6d4",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  function handleAction(action: string) {
    dispatch("action", { action });
  }

  function handleCardClick() {
    if (href) return; // Let the link handle it
    dispatch("click");
  }
</script>

<ModernCard
  variant="interactive"
  size="md"
  accent={statusColors[status]}
  {href}
  {loading}
  on:click={handleCardClick}
>
  <div class="business-card-content">
    <!-- Header -->
    <div class="card-header">
      <div class="title-section">
        <h3 class="card-title">{title}</h3>
        {#if subtitle}
          <p class="card-subtitle">{subtitle}</p>
        {/if}
      </div>

      <div class="badges">
        {#if priority}
          <span class="priority-badge priority-{priority}">
            {priority}
          </span>
        {/if}
        <span class="status-badge status-{status}">
          {status}
        </span>
      </div>
    </div>

    <!-- Description -->
    {#if description}
      <p class="card-description">{description}</p>
    {/if}

    <!-- Value section -->
    {#if value}
      <div class="value-section">
        <div class="value">{value}</div>
        {#if valueLabel}
          <div class="value-label">{valueLabel}</div>
        {/if}
      </div>
    {/if}

    <!-- Actions -->
    {#if actions.length > 0}
      <div class="card-actions">
        {#each actions as action}
          <button
            class="action-btn action-{action.variant || 'secondary'}"
            on:click|stopPropagation={() => handleAction(action.action)}
          >
            {action.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</ModernCard>

<style>
  .business-card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .title-section {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: rgb(17, 24, 39);
    margin: 0;
    line-height: 1.4;
    /* Text truncation with ellipsis */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-subtitle {
    font-size: 14px;
    color: rgb(107, 114, 128);
    margin: 4px 0 0 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .badges {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .status-badge,
  .priority-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .status-active {
    background: rgb(220, 252, 231);
    color: rgb(5, 150, 105);
  }

  .status-inactive {
    background: rgb(243, 244, 246);
    color: rgb(75, 85, 99);
  }

  .status-pending {
    background: rgb(254, 243, 199);
    color: rgb(217, 119, 6);
  }

  .status-draft {
    background: rgb(237, 233, 254);
    color: rgb(124, 58, 237);
  }

  .priority-low {
    background: rgb(207, 250, 254);
    color: rgb(8, 145, 178);
  }

  .priority-medium {
    background: rgb(254, 243, 199);
    color: rgb(217, 119, 6);
  }

  .priority-high {
    background: rgb(254, 226, 226);
    color: rgb(220, 38, 38);
  }

  .card-description {
    font-size: 14px;
    color: rgb(75, 85, 99);
    margin: 0;
    line-height: 1.5;
    /* Multi-line text truncation */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .value-section {
    margin-top: auto;
    padding-top: 8px;
    border-top: 1px solid rgb(243, 244, 246);
  }

  .value {
    font-size: 24px;
    font-weight: 700;
    color: rgb(17, 24, 39);
    line-height: 1.2;
  }

  .value-label {
    font-size: 12px;
    color: rgb(107, 114, 128);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }

  .card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: auto;
  }

  .action-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-primary {
    background: rgb(59, 130, 246);
    color: white;
  }

  .action-primary:hover {
    background: rgb(37, 99, 235);
  }

  .action-secondary {
    background: rgb(243, 244, 246);
    color: rgb(55, 65, 81);
  }

  .action-secondary:hover {
    background: rgb(229, 231, 235);
  }

  .action-danger {
    background: rgb(254, 226, 226);
    color: rgb(220, 38, 38);
  }

  .action-danger:hover {
    background: rgb(252, 165, 165);
  }

  /* Dark mode */
  :global(.dark) .card-title {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .card-subtitle {
    color: rgb(156, 163, 175);
  }

  :global(.dark) .card-description {
    color: rgb(156, 163, 175);
  }

  :global(.dark) .value {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .value-section {
    border-color: rgb(55, 65, 81);
  }

  :global(.dark) .action-secondary {
    background: rgb(55, 65, 81);
    color: rgb(209, 213, 219);
  }

  :global(.dark) .action-secondary:hover {
    background: rgb(75, 85, 99);
  }

  /* Mobile responsive */
  @media (max-width: 640px) {
    .card-header {
      flex-direction: column;
      gap: 12px;
    }

    .badges {
      align-self: flex-start;
    }

    .card-title {
      font-size: 16px;
    }

    .value {
      font-size: 20px;
    }
  }
</style>
