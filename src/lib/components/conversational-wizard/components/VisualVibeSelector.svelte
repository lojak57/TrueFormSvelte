<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { DESIGN_VIBES } from "$lib/data/designVibes";
  import VibeOption from "./VibeOption.svelte";
  import type { VibeOption as VibeOptionType } from "$lib/data/designVibes";

  export let selectedVibe = "";

  const dispatch = createEventDispatcher();

  function selectVibe(vibe: VibeOptionType) {
    selectedVibe = vibe.id;
    dispatch("select", {
      value: vibe.label,
      vibeData: vibe,
    });
  }
</script>

<div class="vibe-selector">
  <div class="vibe-grid">
    {#each DESIGN_VIBES as vibe, i}
      <div in:fade={{ duration: 300, delay: i * 50 }}>
        <VibeOption
          {vibe}
          isSelected={selectedVibe === vibe.id}
          onClick={() => selectVibe(vibe)}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .vibe-selector {
    width: 100%;
  }

  .vibe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .vibe-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
