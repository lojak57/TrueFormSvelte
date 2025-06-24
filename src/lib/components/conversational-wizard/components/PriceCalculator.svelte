<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let basePrice: number = 999;
  export let selectedAddons: any[] = [];
  export let estimatedTotal: number = basePrice;

  const dispatch = createEventDispatcher();

  // Calculate totals when addons change
  $: {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    estimatedTotal = basePrice + addonTotal;
    
    // Dispatch the updated total
    dispatch("totalUpdate", { 
      estimatedTotal, 
      addonTotal,
      selectedAddons 
    });
  }

  // Format currency
  function formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }
</script>

<div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
  <!-- Package Summary -->
  <div class="text-center mb-6">
    <h3 class="text-xl font-bold text-gray-900 mb-2">Your Package</h3>
    <div class="text-3xl font-bold text-accent-600">
      {formatPrice(estimatedTotal)}
    </div>
    <p class="text-sm text-gray-600 mt-1">One-time project cost</p>
  </div>

  <!-- Price Breakdown -->
  <div class="space-y-3 mb-6">
    <!-- Base Package -->
    <div class="flex justify-between items-center py-2 border-b border-gray-100">
      <span class="text-gray-700 font-medium">Professional Website</span>
      <span class="font-semibold">{formatPrice(basePrice)}</span>
    </div>

    <!-- Selected Addons -->
    {#each selectedAddons as addon (addon.id)}
      <div 
        class="flex justify-between items-center py-2"
        in:slide={{ duration: 200 }}
        out:slide={{ duration: 150 }}
      >
        <span class="text-gray-600 text-sm">{addon.title}</span>
        <span class="text-gray-900 font-medium">+{formatPrice(addon.price)}</span>
      </div>
    {/each}

    <!-- Total Line -->
    {#if selectedAddons.length > 0}
      <div class="flex justify-between items-center pt-3 border-t border-gray-200">
        <span class="font-semibold text-gray-900">Total Investment</span>
        <span class="text-lg font-bold text-accent-600">{formatPrice(estimatedTotal)}</span>
      </div>
    {/if}
  </div>

  <!-- Value Proposition -->
  <div class="bg-accent-50 rounded-lg p-4 text-center">
    <p class="text-xs text-accent-700 font-medium mb-1">PROFESSIONAL VALUE</p>
    <p class="text-sm text-gray-700">
      Comparable agency projects: {formatPrice(estimatedTotal * 2.5)} - {formatPrice(estimatedTotal * 4)}
    </p>
  </div>

  <!-- Payment Terms -->
  <div class="mt-4 text-center">
    <p class="text-xs text-gray-500">
      50% deposit • Balance due on completion
    </p>
  </div>
</div>