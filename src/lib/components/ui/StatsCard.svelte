<script lang="ts">
  import ModernCard from "./ModernCard.svelte";
  import type { ComponentType } from "svelte";

  export let title: string;
  export let value: string;
  export let change: number | null = null;
  export let changeLabel: string = "vs last period";
  export let trend: "up" | "down" | "neutral" = "neutral";
  export let icon: ComponentType | string = "";
  export let href: string | undefined = undefined;
  export let loading: boolean = false;
  export let size: "sm" | "md" | "lg" = "md";

  $: isPositiveChange = change !== null && change > 0;
  $: isNegativeChange = change !== null && change < 0;
  $: changeColor = isPositiveChange
    ? "positive"
    : isNegativeChange
    ? "negative"
    : "neutral";

  function formatChange(change: number): string {
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${change.toFixed(1)}%`;
  }
</script>

<ModernCard variant={href ? "interactive" : "elevated"} {size} {href} {loading}>
  <div class="stats-card-content">
    <div class="stats-header">
      {#if icon}
        <div class="icon-container">
          {#if typeof icon === "string"}
            <span class="icon">{icon}</span>
          {:else}
            <svelte:component this={icon} size={20} class="icon-component" />
          {/if}
        </div>
      {/if}

      <div class="title-section">
        <h3 class="stats-title">{title}</h3>
      </div>
    </div>

    <div class="stats-value">
      {value}
    </div>

    {#if change !== null}
      <div class="stats-change">
        <span class="change-indicator change-{changeColor}">
          {#if trend === "up"}
            <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          {:else if trend === "down"}
            <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          {:else}
            <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          {/if}
          {formatChange(change)}
        </span>
        <span class="change-label">{changeLabel}</span>
      </div>
    {/if}
  </div>
</ModernCard>

<style>
  .stats-card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
  }

  .stats-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
    transition: all 0.2s ease;
  }

  .icon {
    font-size: 20px;
    line-height: 1;
  }

  :global(.icon-component) {
    color: rgb(71, 85, 105);
    transition: color 0.2s ease;
  }

  .title-section {
    flex: 1;
    min-width: 0;
  }

  .stats-title {
    font-size: 14px;
    font-weight: 600;
    color: rgb(71, 85, 105);
    margin: 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  .stats-value {
    font-size: 28px;
    font-weight: 700;
    color: rgb(15, 23, 42);
    line-height: 1.2;
    margin: 4px 0;
    letter-spacing: -0.02em;
  }

  .stats-change {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
  }

  .change-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }

  .change-icon {
    width: 12px;
    height: 12px;
  }

  .change-positive {
    background: rgb(220, 252, 231);
    color: rgb(5, 150, 105);
  }

  .change-negative {
    background: rgb(254, 226, 226);
    color: rgb(220, 38, 38);
  }

  .change-neutral {
    background: rgb(243, 244, 246);
    color: rgb(107, 114, 128);
  }

  .change-label {
    font-size: 12px;
    color: rgb(107, 114, 128);
  }

  /* Size variations */
  :global(.size-sm) .stats-value {
    font-size: 20px;
  }

  :global(.size-sm) .icon-container {
    width: 32px;
    height: 32px;
  }

  :global(.size-sm) .icon {
    font-size: 16px;
  }

  :global(.size-lg) .stats-value {
    font-size: 36px;
  }

  :global(.size-lg) .icon-container {
    width: 48px;
    height: 48px;
  }

  :global(.size-lg) .icon {
    font-size: 24px;
  }

  /* Dark mode */
  :global(.dark) .icon-container {
    background: rgb(31, 41, 55);
  }

  :global(.dark) .stats-title {
    color: rgb(156, 163, 175);
  }

  :global(.dark) .stats-value {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .change-label {
    color: rgb(156, 163, 175);
  }

  :global(.dark) .change-neutral {
    background: rgb(55, 65, 81);
    color: rgb(156, 163, 175);
  }

  /* Mobile responsive */
  @media (max-width: 640px) {
    .stats-card-content {
      gap: 8px;
    }

    .stats-header {
      gap: 8px;
    }

    .icon-container {
      width: 36px;
      height: 36px;
    }

    .icon {
      font-size: 18px;
    }

    .stats-title {
      font-size: 13px;
      font-weight: 600;
    }

    .stats-value {
      font-size: 24px;
      font-weight: 800;
      margin: 2px 0;
    }

    .stats-change {
      flex-direction: row;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
    }

    .change-indicator {
      padding: 1px 4px;
      font-size: 11px;
      font-weight: 700;
    }

    .change-icon {
      width: 10px;
      height: 10px;
    }

    .change-label {
      font-size: 11px;
      font-weight: 500;
    }
  }

  /* Extra small mobile */
  @media (max-width: 480px) {
    .stats-value {
      font-size: 20px;
    }

    .stats-title {
      font-size: 12px;
    }

    .icon-container {
      width: 32px;
      height: 32px;
    }

    .icon {
      font-size: 16px;
    }
  }

  /* Mobile-first improvements */
  @media (max-width: 640px) {
    /* Better mobile shadows */
    :global(.size-md) .stats-card-content {
      padding: 12px;
    }

    /* Enhanced mobile contrast */
    .stats-title {
      color: rgb(75, 85, 99);
    }

    .stats-value {
      color: rgb(17, 24, 39);
      text-shadow: none;
    }

    /* Mobile-optimized change indicators */
    .change-positive {
      background: rgb(34, 197, 94);
      color: white;
      border-radius: 12px;
    }

    .change-negative {
      background: rgb(239, 68, 68);
      color: white;
      border-radius: 12px;
    }

    .change-neutral {
      background: rgb(107, 114, 128);
      color: white;
      border-radius: 12px;
    }
  }
</style>
