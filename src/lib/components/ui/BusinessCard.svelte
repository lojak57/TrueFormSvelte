<script lang="ts">
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

{#if href}
  <a
    {href}
    class="business-card"
    class:loading
    style="--accent-color: {statusColors[status]}"
  >
    <div class="business-card-content">
      <slot name="header" />
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
      {#if description}
        <p class="card-description">{description}</p>
      {/if}
      {#if value}
        <div class="value-section">
          <div class="value">{value}</div>
          {#if valueLabel}
            <div class="value-label">{valueLabel}</div>
          {/if}
        </div>
      {/if}
      <slot />
    </div>
  </a>
{:else}
  <div
    class="business-card"
    class:loading
    style="--accent-color: {statusColors[status]}"
    on:click={handleCardClick}
    on:keydown={(e) => e.key === 'Enter' && handleCardClick()}
    role="button"
    tabindex="0"
  >
    <div class="business-card-content">
      <slot name="header" />
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
      {#if description}
        <p class="card-description">{description}</p>
      {/if}
      {#if value}
        <div class="value-section">
          <div class="value">{value}</div>
          {#if valueLabel}
            <div class="value-label">{valueLabel}</div>
          {/if}
        </div>
      {/if}
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
      <slot />
    </div>
  </div>
{/if}

<style>
  .business-card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-left: 4px solid var(--accent-color, #6366f1);
    transition: all 0.2s ease;
    cursor: pointer;
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .business-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .business-card.loading {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .business-card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .title-section {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.25rem 0 0 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .status-badge,
  .priority-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .status-active {
    background: #dcfce7;
    color: #059669;
  }

  .status-inactive {
    background: #f3f4f6;
    color: #4b5563;
  }

  .status-pending {
    background: #fef3c7;
    color: #d97706;
  }

  .status-draft {
    background: #ede9fe;
    color: #7c3aed;
  }

  .priority-low {
    background: #cffafe;
    color: #0891b2;
  }

  .priority-medium {
    background: #fef3c7;
    color: #d97706;
  }

  .priority-high {
    background: #fee2e2;
    color: #dc2626;
  }

  .card-description {
    font-size: 0.875rem;
    color: #4b5563;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .value-section {
    margin-top: auto;
    padding-top: 0.5rem;
    border-top: 1px solid #f3f4f6;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
  }

  .value-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.125rem;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: auto;
  }

  .action-btn {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-primary {
    background: #3b82f6;
    color: white;
  }

  .action-primary:hover {
    background: #2563eb;
  }

  .action-secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .action-secondary:hover {
    background: #e5e7eb;
  }

  .action-danger {
    background: #fee2e2;
    color: #dc2626;
  }

  .action-danger:hover {
    background: #fca5a5;
  }

  @media (max-width: 640px) {
    .card-header {
      flex-direction: column;
      gap: 0.75rem;
    }

    .badges {
      align-self: flex-start;
    }

    .card-title {
      font-size: 1rem;
    }

    .value {
      font-size: 1.25rem;
    }
  }
</style>