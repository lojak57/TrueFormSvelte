<script lang="ts">
  export let variant: "primary" | "secondary" | "outline" | "ghost" | "danger" =
    "primary";
  export let size: "sm" | "md" | "lg" = "md";
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let href: string | undefined = undefined;
  export let type: "button" | "submit" | "reset" = "button";
  export let fullWidth: boolean = false;
  export let icon: boolean = false; // For icon-only buttons

  // Allow custom CSS classes
  let className: string = "";
  export { className as class };

  // Determine if this should be a link
  $: isLink = href !== undefined;

  // CSS classes based on variant and props
  $: buttonClasses = [
    "base-button",
    `variant-${variant}`,
    `size-${size}`,
    disabled && "disabled",
    loading && "loading",
    fullWidth && "full-width",
    icon && "icon-only",
    className,
  ]
    .filter(Boolean)
    .join(" ");
</script>

{#if isLink}
  <a
    {href}
    class={buttonClasses}
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled}
    on:click
    on:keydown
  >
    {#if loading}
      <span class="loading-spinner" aria-hidden="true" />
    {/if}
    <span class="button-content" class:sr-only={loading}>
      <slot />
    </span>
  </a>
{:else}
  <button
    class={buttonClasses}
    {type}
    {disabled}
    aria-disabled={disabled}
    on:click
    on:keydown
  >
    {#if loading}
      <span class="loading-spinner" aria-hidden="true" />
    {/if}
    <span class="button-content" class:sr-only={loading}>
      <slot />
    </span>
  </button>
{/if}

<style>
  .base-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-family: var(--font-sans);
    font-weight: var(--font-medium);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    transition: var(--transition-all);
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    vertical-align: middle;
  }

  /* Size variants */
  .size-sm {
    padding: var(--space-1_5) var(--space-3);
    font-size: var(--text-sm);
    line-height: var(--leading-tight);
  }

  .size-md {
    padding: var(--space-2_5) var(--space-4);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
  }

  .size-lg {
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
  }

  /* Icon-only buttons */
  .icon-only.size-sm {
    padding: var(--space-1_5);
    width: 32px;
    height: 32px;
  }

  .icon-only.size-md {
    padding: var(--space-2_5);
    width: 40px;
    height: 40px;
  }

  .icon-only.size-lg {
    padding: var(--space-3);
    width: 48px;
    height: 48px;
  }

  /* Full width */
  .full-width {
    width: 100%;
  }

  /* Variant styles */
  .variant-primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  .variant-primary:hover:not(.disabled) {
    background-color: var(--color-primary-700);
    border-color: var(--color-primary-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-primary);
  }

  .variant-primary:active:not(.disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  .variant-secondary {
    background-color: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }

  .variant-secondary:hover:not(.disabled) {
    background-color: var(--color-accent-700);
    border-color: var(--color-accent-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-accent);
  }

  .variant-secondary:active:not(.disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  .variant-outline {
    background-color: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .variant-outline:hover:not(.disabled) {
    background-color: var(--color-primary);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--shadow-primary);
  }

  .variant-outline:active:not(.disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  .variant-ghost {
    background-color: transparent;
    color: var(--color-text);
    border-color: transparent;
  }

  .variant-ghost:hover:not(.disabled) {
    background-color: var(--color-neutral-100);
    color: var(--color-text);
  }

  .variant-ghost:active:not(.disabled) {
    background-color: var(--color-neutral-200);
  }

  .variant-danger {
    background-color: var(--color-error);
    color: white;
    border-color: var(--color-error);
  }

  .variant-danger:hover:not(.disabled) {
    background-color: var(--color-error-700);
    border-color: var(--color-error-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-error);
  }

  .variant-danger:active:not(.disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  /* Focus states */
  .base-button:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .variant-danger:focus {
    outline-color: var(--color-error);
  }

  /* Disabled state */
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Loading state */
  .loading {
    pointer-events: none;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin var(--duration-1000) linear infinite;
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  /* Remove link styles when used as link */
  a.base-button {
    color: inherit;
    text-decoration: none;
  }

  a.base-button:hover {
    text-decoration: none;
  }

  /* Dark mode adjustments */
  :global(.dark) .variant-ghost {
    color: var(--color-text);
  }

  :global(.dark) .variant-ghost:hover:not(.disabled) {
    background-color: var(--color-neutral-800);
  }

  :global(.dark) .variant-ghost:active:not(.disabled) {
    background-color: var(--color-neutral-700);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .base-button {
      transition: none;
    }

    .base-button:hover:not(.disabled) {
      transform: none;
    }

    .base-button:active:not(.disabled) {
      transform: none;
    }

    .loading-spinner {
      animation: none;
      border: 2px solid currentColor;
      border-top: 2px solid transparent;
    }
  }

  /* Mobile touch targets */
  @media (max-width: 640px) {
    .size-sm {
      min-height: 44px;
      padding: var(--space-2) var(--space-3);
    }

    .size-md {
      min-height: 44px;
    }

    .icon-only.size-sm {
      width: 44px;
      height: 44px;
    }
  }
</style>
