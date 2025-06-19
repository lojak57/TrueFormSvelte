<script lang="ts">
  import {
    SERVICE_CATEGORIES,
    getServicesByCategory,
  } from "$lib/data/serviceTemplates";
  import ServiceCard from "./ServiceCard.svelte";
  import type { ServiceTemplate } from "$lib/data/serviceTemplates";
  import { createEventDispatcher } from "svelte";

  export let category: keyof typeof SERVICE_CATEGORIES;
  export let selectedServices: ServiceTemplate[] = [];

  const dispatch = createEventDispatcher<{
    serviceSelect: ServiceTemplate;
  }>();

  $: services = getServicesByCategory(category);
  $: categoryInfo = SERVICE_CATEGORIES[category];

  function handleServiceSelect(event: CustomEvent<ServiceTemplate>) {
    dispatch("serviceSelect", event.detail);
  }

  function isSelected(service: ServiceTemplate) {
    return selectedServices.some((s) => s.id === service.id);
  }
</script>

<div class="mb-8">
  <!-- Category Header -->
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-10 h-10 rounded-lg {categoryInfo.color} flex items-center justify-center text-lg"
    >
      {categoryInfo.icon}
    </div>
    <div>
      <h3 class="tf-heading-3">{categoryInfo.name}</h3>
      <p class="text-gray-900 text-sm">{services.length} services available</p>
    </div>
  </div>

  <!-- Services Grid -->
  <div class="tf-grid tf-grid-cols-1 md:grid-cols-2 gap-4">
    {#each services as service}
      <ServiceCard
        {service}
        isSelected={isSelected(service)}
        on:select={handleServiceSelect}
      />
    {/each}
  </div>
</div>
