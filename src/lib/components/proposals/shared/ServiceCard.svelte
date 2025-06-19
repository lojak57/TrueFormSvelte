<script lang="ts">
  import type { ServiceTemplate } from "$lib/data/serviceTemplates";
  import { createEventDispatcher } from "svelte";

  export let service: ServiceTemplate;
  export let isSelected = false;

  const dispatch = createEventDispatcher<{
    select: ServiceTemplate;
  }>();

  function handleSelect() {
    dispatch("select", service);
  }

  function formatPrice(price: number, unit: string) {
    return `$${price.toLocaleString()}${
      unit === "hour"
        ? "/hr"
        : unit === "month"
        ? "/mo"
        : unit === "year"
        ? "/yr"
        : ""
    }`;
  }
</script>

<div
  class="tf-card tf-card-interactive {isSelected
    ? 'ring-2 ring-primary-500 bg-primary-50'
    : ''}"
  on:click={handleSelect}
  on:keydown={(e) => e.key === "Enter" && handleSelect()}
  role="button"
  tabindex="0"
>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="tf-heading-4 text-lg">{service.name}</h3>
          {#if service.popular}
            <span
              class="px-2 py-1 text-xs font-medium bg-accent-100 text-accent-700 rounded-full"
            >
              Popular
            </span>
          {/if}
        </div>
        <p class="text-gray-900 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>

      <div class="ml-4 text-right">
        <div class="tf-heading-3 text-gray-900">
          {formatPrice(service.basePrice, service.unit)}
        </div>
        <div class="text-sm text-gray-900">per {service.unit}</div>
      </div>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      {#each service.tags.slice(0, 3) as tag}
        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
          {tag.replace("-", " ")}
        </span>
      {/each}
      {#if service.tags.length > 3}
        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
          +{service.tags.length - 3} more
        </span>
      {/if}
    </div>

    <!-- Selection indicator -->
    {#if isSelected}
      <div class="mt-4 flex items-center text-primary-600 text-sm font-medium">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        Selected
      </div>
    {/if}
  </div>
</div>
