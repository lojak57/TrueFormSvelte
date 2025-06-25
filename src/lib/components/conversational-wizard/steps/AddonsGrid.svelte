<script lang="ts">
  import { fly } from "svelte/transition";
  import AddonCard from "$lib/components/addons/AddonCard.svelte";
  import { ADDONS_DATA } from "$lib/data/addons";
  import {
    serviceRequirements,
    serviceRecommendations,
  } from "$lib/data/addonRecommendations";

  export let selectedAddons: string[] = [];
  export let serviceParam: string | null = null;
  export let onToggleAddon: (addonId: string) => void;

  function handleToggleAddon(addonId: string) {
    // Prevent deselecting required add-ons
    if (serviceParam && serviceRequirements[serviceParam]?.includes(addonId)) {
      return;
    }
    onToggleAddon(addonId);
  }

  function isRequired(addonId: string): boolean {
    return serviceParam
      ? serviceRequirements[serviceParam]?.includes(addonId) || false
      : false;
  }

  function isRecommended(addonId: string): boolean {
    return serviceParam
      ? serviceRecommendations[serviceParam]?.includes(addonId) || false
      : false;
  }
</script>

<div class="addons-section" in:fly={{ y: 30, duration: 500, delay: 1100 }}>
  <h3 class="addons-title" in:fly={{ y: 20, duration: 400, delay: 1200 }}>
    🧩 ADD-ONS (Optional, Flat-Rate)
  </h3>
  <p class="addons-subtitle" in:fly={{ y: 20, duration: 400, delay: 1300 }}>
    These are modules, not mystery line items. Pick like you're at a menu.
  </p>

  <div class="addons-grid">
    {#each ADDONS_DATA as addon, i}
      <AddonCard
        {addon}
        selected={selectedAddons.includes(addon.id)}
        isRequired={isRequired(addon.id)}
        isRecommended={isRecommended(addon.id)}
        onToggle={() => handleToggleAddon(addon.id)}
        index={i}
      />
    {/each}
  </div>
</div>

<style>
  .addons-section {
    margin-bottom: 3rem;
  }

  .addons-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .addons-subtitle {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .addons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }
</style>
