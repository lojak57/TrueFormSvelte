<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import BaseButton from "../base/BaseButton.svelte";
  import { X } from "lucide-svelte";

  export let open = false;
  export let title = "Confirm Action";
  export let message = "Are you sure you want to proceed?";
  export let confirmText = "Confirm";
  export let cancelText = "Cancel";
  export let variant: "danger" | "warning" | "info" = "warning";
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleConfirm() {
    dispatch("confirm");
  }

  function handleCancel() {
    dispatch("cancel");
    open = false;
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleCancel();
    }
  }
</script>

{#if open}
  <div
    class="dialog-backdrop"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    transition:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
  >
    <div class="dialog-content" transition:fly={{ y: 20, duration: 300 }}>
      <button
        class="close-button"
        on:click={handleCancel}
        aria-label="Close dialog"
        disabled={loading}
      >
        <X size={20} />
      </button>

      <div class="dialog-icon {variant}">
        {#if variant === "danger"}
          ⚠️
        {:else if variant === "warning"}
          ⚠️
        {:else}
          ℹ️
        {/if}
      </div>

      <h2 id="dialog-title" class="dialog-title">{title}</h2>
      <p class="dialog-message">{message}</p>

      <div class="dialog-actions">
        <BaseButton
          variant="outline"
          on:click={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </BaseButton>
        <BaseButton
          variant={variant === "danger" ? "danger" : "primary"}
          on:click={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </BaseButton>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }

  .dialog-content {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: 400px;
    width: 100%;
    padding: 2rem;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-md);
    transition: all 0.2s;
  }

  .close-button:hover:not(:disabled) {
    background: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .close-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dialog-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .dialog-icon.danger {
    filter: hue-rotate(-10deg) saturate(2);
  }

  .dialog-icon.warning {
    filter: saturate(1.5);
  }

  .dialog-icon.info {
    filter: hue-rotate(200deg);
  }

  .dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  .dialog-message {
    text-align: center;
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .dialog-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  @media (max-width: 640px) {
    .dialog-content {
      padding: 1.5rem;
    }

    .dialog-actions {
      flex-direction: column-reverse;
      width: 100%;
    }

    .dialog-actions :global(button) {
      width: 100%;
    }
  }
</style>
