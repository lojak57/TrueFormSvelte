<script lang="ts">
  export let variant: "hero" | "compact" | "mini" = "hero";
  export let accent: string = "var(--color-primary)";
  export let clickable: boolean = true;
  export let href: string | undefined = undefined;
  export let loading: boolean = false;
  export let elevated: boolean = false;
  export let padding: "none" | "sm" | "md" | "lg" = "md";

  // Allow custom CSS classes
  let className: string = "";
  export { className as class };

  // Determine if this should be a link or button
  $: isLink = href !== undefined;
  $: isInteractive = clickable || isLink;

  // CSS classes based on variant and props
  $: cardClasses = [
    "base-card",
    `variant-${variant}`,
    `padding-${padding}`,
    isInteractive && "interactive",
    elevated && "elevated",
    className,
    loading && "loading",
  ]
    .filter(Boolean)
    .join(" ");
</script>

{#if isLink}
  <a
    {href}
    class={cardClasses}
    style="--accent-color: {accent}"
    role="button"
    tabindex="0"
    on:click
    on:keydown
  >
    {#if loading}
      <div class="loading-overlay">
        <div class="skeleton skeleton-card" />
      </div>
    {:else}
      <slot />
    {/if}
  </a>
{:else if isInteractive}
  <button
    class={cardClasses}
    style="--accent-color: {accent}"
    on:click
    on:keydown
  >
    {#if loading}
      <div class="loading-overlay">
        <div class="skeleton skeleton-card" />
      </div>
    {:else}
      <slot />
    {/if}
  </button>
{:else}
  <div class={cardClasses} style="--accent-color: {accent}">
    {#if loading}
      <div class="loading-overlay">
        <div class="skeleton skeleton-card" />
      </div>
    {:else}
      <slot />
    {/if}
  </div>
{/if}

<style>
  .base-card {
    position: relative;
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border-muted);
    box-shadow: var(--shadow-sm);
    transition: var(--transition-all);
    overflow: hidden;
    width: 100%;
    text-align: left;
    font-family: inherit;
    color: inherit;
    text-decoration: none;
  }

  /* Accent bar */
  .base-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--accent-color);
    transition: width var(--duration-300) var(--ease-out);
    z-index: 1;
  }

  /* Variant styles */
  .variant-hero {
    min-height: 200px;
  }

  .variant-compact {
    min-height: 120px;
  }

  .variant-mini {
    min-height: 80px;
  }

  /* Padding variants */
  .padding-none {
    padding: 0;
  }

  .padding-sm {
    padding: var(--space-3);
  }

  .padding-md {
    padding: var(--space-4);
  }

  .padding-lg {
    padding: var(--space-6);
  }

  /* Interactive states */
  .interactive {
    cursor: pointer;
  }

  .interactive:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .interactive:hover::before {
    width: 100%;
  }

  .interactive:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .interactive:active {
    transform: translateY(-1px);
  }

  /* Elevated variant */
  .elevated {
    box-shadow: var(--shadow-md);
  }

  .elevated:hover {
    box-shadow: var(--shadow-lg);
  }

  /* Loading state */
  .loading {
    pointer-events: none;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .loading-overlay .skeleton-card {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  /* Remove button styles when used as button */
  button.base-card {
    border: 1px solid var(--color-border-muted);
    background-color: var(--color-surface);
  }

  /* Remove link styles when used as link */
  a.base-card {
    color: inherit;
    text-decoration: none;
  }

  a.base-card:hover {
    color: inherit;
    text-decoration: none;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .variant-hero {
      min-height: 150px;
    }

    .variant-compact {
      min-height: 100px;
    }

    .variant-mini {
      min-height: 60px;
    }

    .padding-lg {
      padding: var(--space-4);
    }
  }

  /* Dark mode adjustments */
  :global(.dark) .base-card {
    background-color: var(--color-surface);
    border-color: var(--color-border);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .base-card {
      transition: none;
    }

    .base-card::before {
      transition: none;
    }

    .interactive:hover {
      transform: none;
    }
  }
</style>
