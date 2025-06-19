<script lang="ts">
  import { scale } from "svelte/transition";
  import { Check } from "lucide-svelte";
  import type { VibeOption } from "$lib/data/designVibes";
  import VibePreview from "./VibePreview.svelte";

  export let vibe: VibeOption;
  export let isSelected = false;
  export let onClick: () => void;
</script>

<button
  class="vibe-option {isSelected ? 'selected' : ''}"
  on:click={onClick}
  type="button"
  aria-pressed={isSelected}
  aria-label="Select {vibe.label} design style"
>
  <div class="vibe-content">
    <!-- Header -->
    <div class="vibe-header">
      <h3 class="vibe-title">{vibe.label}</h3>
      <p class="vibe-description">{vibe.description}</p>
    </div>

    <!-- Preview -->
    <div class="vibe-preview">
      <VibePreview {vibe} {isSelected} />
    </div>

    <!-- Color Palette -->
    <div class="color-palette">
      {#each vibe.colors as color}
        <div
          class="color-swatch"
          style="background-color: {color}"
          title={color}
        />
      {/each}
    </div>

    <!-- Selection Indicator -->
    {#if isSelected}
      <div
        class="selection-indicator"
        transition:scale={{ duration: 200, start: 0.8 }}
      >
        <Check size={16} />
      </div>
    {/if}
  </div>
</button>

<style>
  .vibe-option {
    position: relative;
    width: 100%;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: left;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .vibe-option:hover {
    border-color: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .vibe-option.selected {
    border-color: #6366f1;
    background: #f0f9ff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .vibe-header {
    margin-bottom: 1rem;
  }

  .vibe-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .vibe-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .vibe-preview {
    margin-bottom: 1rem;
  }

  .color-palette {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .color-swatch {
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  .selection-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    background: #6366f1;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>