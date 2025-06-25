<script lang="ts">
  export let type: "email" | "phone";
  export let value: string;
  export let label: string;
  export let onAction: () => void;
  export let actionLabel: string;

  import BaseButton from "$lib/components/base/BaseButton.svelte";
</script>

<div class="contact-method">
  <div class="method-icon">
    {#if type === "email"}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        />
      </svg>
    {:else if type === "phone"}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        />
      </svg>
    {/if}
  </div>
  <div class="method-details">
    <div class="method-label">{label}</div>
    <a
      href="{type === 'email' ? 'mailto:' : 'tel:'}{value}"
      class="method-value"
    >
      {value}
    </a>
  </div>
  <BaseButton size="sm" variant="ghost" on:click={onAction}>
    {actionLabel}
  </BaseButton>
</div>

<style>
  .contact-method {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .method-icon {
    color: #64748b;
    flex-shrink: 0;
  }

  .method-details {
    flex: 1;
    min-width: 0;
  }

  .method-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    margin-bottom: 0.125rem;
  }

  .method-value {
    font-size: 0.875rem;
    color: #1f2937;
    text-decoration: none;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .method-value:hover {
    color: #3b82f6;
  }
</style>
