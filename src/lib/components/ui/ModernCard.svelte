<script lang="ts">
  export let variant:
    | "default"
    | "elevated"
    | "interactive"
    | "minimal"
    | "feature" = "default";
  export let size: "sm" | "md" | "lg" | "xl" = "md";
  export let accent: string | null = null;
  export let href: string | undefined = undefined;
  export let loading: boolean = false;
  export let disabled: boolean = false;
  export let borderless: boolean = false;
  export let glass: boolean = false;

  // Determine if this should be a link
  $: isLink = href !== undefined;
  $: isInteractive = variant === "interactive" || isLink;

  // Build classes
  $: cardClasses = [
    "modern-card",
    `size-${size}`,
    `variant-${variant}`,
    borderless && "borderless",
    glass && "glass",
    isInteractive && "interactive",
    loading && "loading",
    disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");

  // Handle click events
  function handleClick(event: MouseEvent | KeyboardEvent) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
  }
</script>

{#if isLink}
  <a
    {href}
    class={cardClasses}
    style:--accent-color={accent}
    on:click={handleClick}
    on:keydown={handleClick}
    aria-disabled={disabled}
  >
    {#if loading}
      <div class="loading-state">
        <div class="loading-skeleton" />
      </div>
    {:else}
      <slot />
    {/if}
  </a>
{:else if isInteractive}
  <button
    class={cardClasses}
    style:--accent-color={accent}
    on:click={handleClick}
    on:keydown={handleClick}
    {disabled}
  >
    {#if loading}
      <div class="loading-state">
        <div class="loading-skeleton" />
      </div>
    {:else}
      <slot />
    {/if}
  </button>
{:else}
  <div class={cardClasses} style:--accent-color={accent}>
    {#if loading}
      <div class="loading-state">
        <div class="loading-skeleton" />
      </div>
    {:else}
      <slot />
    {/if}
  </div>
{/if}

<style>
  .modern-card {
    position: relative;
    background: white;
    border-radius: 12px;
    border: 1px solid rgb(229, 231, 235);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    width: 100%;
    text-align: left;
    font-family: inherit;
    color: inherit;
    text-decoration: none;
    display: flex;
    flex-direction: column;
  }

  /* Size variants */
  .size-sm {
    padding: 16px;
    gap: 12px;
  }

  .size-md {
    padding: 20px;
    gap: 16px;
  }

  .size-lg {
    padding: 24px;
    gap: 20px;
  }

  .size-xl {
    padding: 32px;
    gap: 24px;
  }

  /* Style variants */
  .variant-default {
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .variant-elevated {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .variant-minimal {
    box-shadow: none;
    border: 1px solid rgb(243, 244, 246);
  }

  .variant-feature {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    border: 1px solid rgb(209, 213, 219);
  }

  /* Accent bar for cards with accent color */
  .modern-card[style*="--accent-color"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  /* Interactive states */
  .interactive {
    cursor: pointer;
  }

  .interactive:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  .interactive:hover::before {
    transform: scaleX(1);
  }

  .interactive:focus {
    outline: 2px solid rgb(59, 130, 246);
    outline-offset: 2px;
  }

  .interactive:active {
    transform: translateY(0);
  }

  /* Disabled state */
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Borderless variant */
  .borderless {
    border: none;
    box-shadow: none;
  }

  /* Glass effect */
  .glass {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Loading state */
  .loading {
    pointer-events: none;
  }

  .loading-state {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .loading-skeleton {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgb(243, 244, 246) 25%,
      rgb(229, 231, 235) 50%,
      rgb(243, 244, 246) 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: inherit;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Remove default button/link styles */
  button.modern-card {
    border: 1px solid rgb(229, 231, 235);
    background: white;
  }

  a.modern-card {
    text-decoration: none;
    color: inherit;
  }

  /* Dark mode support */
  :global(.dark) .modern-card {
    background: rgb(17, 24, 39);
    border-color: rgb(55, 65, 81);
    color: rgb(243, 244, 246);
  }

  :global(.dark) .variant-minimal {
    border-color: rgb(31, 41, 55);
  }

  :global(.dark) .glass {
    background: rgba(17, 24, 39, 0.9);
    border-color: rgba(75, 85, 99, 0.3);
  }

  :global(.dark) .loading-skeleton {
    background: linear-gradient(
      90deg,
      rgb(31, 41, 55) 25%,
      rgb(55, 65, 81) 50%,
      rgb(31, 41, 55) 75%
    );
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .size-lg {
      padding: 20px;
      gap: 16px;
    }

    .size-xl {
      padding: 24px;
      gap: 20px;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .modern-card {
      transition: none;
    }

    .interactive:hover {
      transform: none;
    }

    .loading-skeleton {
      animation: none;
    }
  }
</style>
