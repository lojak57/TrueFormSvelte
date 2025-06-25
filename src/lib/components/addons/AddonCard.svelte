<script lang="ts">
  import { fly } from "svelte/transition";
  import type { AddonData } from "$lib/data/addons";

  export let addon: AddonData;
  export let selected: boolean = false;
  export let isRequired: boolean = false;
  export let isRecommended: boolean = false;
  export let onToggle: () => void;
  export let index: number = 0;
</script>

<div
  class="addon-card"
  class:selected
  class:required={isRequired}
  class:recommended={isRecommended}
  in:fly={{ y: 30, duration: 400, delay: 1400 + index * 80 }}
>
  <!-- Visual Header -->
  <div class="addon-visual bg-gradient-to-br {addon.imageBg}">
    <svelte:component this={addon.icon} size={32} class={addon.iconColor} />
    {#if isRequired}
      <div class="required-badge">REQUIRED</div>
    {:else if addon.popular || isRecommended}
      <div class="popular-badge">
        {isRecommended ? "RECOMMENDED" : "POPULAR"}
      </div>
    {/if}
  </div>

  <!-- Content -->
  <div class="addon-content">
    <div class="addon-header">
      <h4>{addon.title}</h4>
      <span class="addon-price">${addon.price}</span>
    </div>

    <p class="addon-description">{addon.description}</p>

    <ul class="addon-benefits">
      {#each addon.benefits as benefit}
        <li>{benefit}</li>
      {/each}
    </ul>

    <button
      class="addon-toggle"
      class:selected
      class:disabled={isRequired}
      on:click={onToggle}
    >
      {#if isRequired}
        ✓ Required
      {:else if selected}
        ✓ Added
      {:else}
        + Add This
      {/if}
    </button>
  </div>
</div>

<style>
  .addon-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .addon-card:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .addon-card.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .addon-card.recommended {
    border-color: #f59e0b;
  }

  .addon-card.required {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .addon-visual {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .popular-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #1d4ed8;
    font-size: 0.65rem;
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .required-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    font-size: 0.65rem;
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .addon-content {
    padding: 1.5rem;
  }

  .addon-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .addon-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    flex: 1;
  }

  .addon-price {
    color: #059669;
    font-weight: 700;
    font-size: 1.125rem;
  }

  .addon-description {
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .addon-benefits {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
  }

  .addon-benefits li {
    color: #374151;
    font-size: 0.875rem;
    padding: 0.25rem 0;
    position: relative;
    padding-left: 1rem;
  }

  .addon-benefits li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #059669;
    font-weight: 600;
  }

  .addon-toggle {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .addon-toggle:not(.selected):not(.disabled) {
    background: #f3f4f6;
    color: #374151;
  }

  .addon-toggle:not(.selected):not(.disabled):hover {
    background: #e5e7eb;
  }

  .addon-toggle.selected {
    background: #3b82f6;
    color: white;
  }

  .addon-toggle.disabled {
    background: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
  }
</style>
