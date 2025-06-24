<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let addon: {
    id: string;
    title: string;
    price: number;
    description: string;
    icon: any;
    imageBg: string;
    iconColor: string;
    benefits: string[];
    popular?: boolean;
  };
  export let isSelected: boolean = false;

  const dispatch = createEventDispatcher();

  function toggleAddon() {
    dispatch("toggle", addon);
  }
</script>

<div
  class="relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer {isSelected
    ? 'border-accent-600 ring-2 ring-accent-600 ring-opacity-50'
    : 'border-gray-200 hover:border-gray-300'}"
  on:click={toggleAddon}
  on:keydown={(e) => e.key === 'Enter' && toggleAddon()}
  role="button"
  tabindex="0"
>
  {#if addon.popular}
    <div
      class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-medium"
    >
      Most Popular
    </div>
  {/if}

  <div class="p-6">
    <!-- Icon and Title -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-12 h-12 rounded-lg bg-gradient-to-br {addon.imageBg} flex items-center justify-center">
        <svelte:component this={addon.icon} class="w-6 h-6 {addon.iconColor}" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{addon.title}</h3>
        <p class="text-2xl font-bold text-accent-600">+${addon.price}</p>
      </div>
    </div>

    <!-- Description -->
    <p class="text-gray-600 text-sm mb-4 leading-relaxed">
      {addon.description}
    </p>

    <!-- Benefits -->
    <div class="space-y-2">
      {#each addon.benefits as benefit}
        <div class="flex items-center space-x-2">
          <div class="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
          <span class="text-sm text-gray-700">{benefit}</span>
        </div>
      {/each}
    </div>

    <!-- Selection Indicator -->
    {#if isSelected}
      <div 
        class="mt-4 flex items-center justify-center space-x-2 bg-accent-50 text-accent-700 py-2 px-4 rounded-lg"
        in:fade={{ duration: 200 }}
      >
        <div class="w-2 h-2 bg-accent-600 rounded-full"></div>
        <span class="text-sm font-medium">Added to package</span>
      </div>
    {/if}
  </div>
</div>