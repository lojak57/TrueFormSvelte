<script lang="ts">
  import {
    SERVICE_CATEGORIES,
    getPopularServices,
    searchServices,
  } from "$lib/data/serviceTemplates";
  import ServiceCategory from "../../shared/ServiceCategory.svelte";
  import ServiceCard from "../../shared/ServiceCard.svelte";
  import type { ServiceTemplate, LineItem } from "$lib/types";
  import { createEventDispatcher } from "svelte";

  export let selectedServices: ServiceTemplate[] = [];
  export let customLineItems: LineItem[] = [];

  const dispatch = createEventDispatcher<{
    updateServices: ServiceTemplate[];
    addCustomItem: Omit<LineItem, "id" | "total">;
  }>();

  let searchQuery = "";
  let showCustomForm = false;
  let customItem = {
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
  };

  $: searchResults = searchQuery ? searchServices(searchQuery) : [];
  $: popularServices = getPopularServices();

  function handleServiceSelect(event: CustomEvent<ServiceTemplate>) {
    const service = event.detail;
    const isAlreadySelected = selectedServices.some((s) => s.id === service.id);

    if (isAlreadySelected) {
      // Remove service
      selectedServices = selectedServices.filter((s) => s.id !== service.id);
    } else {
      // Add service
      selectedServices = [...selectedServices, service];
    }

    dispatch("updateServices", selectedServices);
  }

  function addCustomItem() {
    if (!customItem.name || customItem.unitPrice <= 0) return;

    dispatch("addCustomItem", { ...customItem });

    // Reset form
    customItem = {
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
    };
    showCustomForm = false;
  }

  function isServiceSelected(service: ServiceTemplate) {
    return selectedServices.some((s) => s.id === service.id);
  }
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h3 class="tf-heading-3 mb-2">Choose your services</h3>
    <p class="text-gray-900">
      Select from our template services or add custom items
    </p>
  </div>

  <!-- Search and Filter -->
  <div class="tf-card">
    <div class="tf-card-body">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          class="tf-input pl-10"
          bind:value={searchQuery}
          placeholder="Search services (e.g., website, design, hosting)"
        />
      </div>
    </div>
  </div>

  <!-- Selected Services Summary -->
  {#if selectedServices.length > 0}
    <div class="tf-card">
      <div class="tf-card-header">
        <h4 class="tf-heading-4">
          Selected Services ({selectedServices.length})
        </h4>
      </div>
      <div class="tf-card-body">
        <div class="flex flex-wrap gap-2">
          {#each selectedServices as service}
            <span
              class="inline-flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm"
            >
              {service.name}
              <button
                class="hover:bg-primary-200 rounded p-0.5"
                on:click={() => handleServiceSelect({ detail: service })}
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Search Results -->
  {#if searchQuery && searchResults.length > 0}
    <div>
      <h4 class="tf-heading-4 mb-4">Search Results ({searchResults.length})</h4>
      <div class="tf-grid tf-grid-cols-1 md:grid-cols-2 gap-4">
        {#each searchResults as service}
          <ServiceCard
            {service}
            isSelected={isServiceSelected(service)}
            on:select={handleServiceSelect}
          />
        {/each}
      </div>
    </div>
  {:else if searchQuery}
    <div class="text-center py-8">
      <p class="text-gray-900">No services found for "{searchQuery}"</p>
      <button
        class="tf-btn tf-btn-outline mt-4"
        on:click={() => (showCustomForm = true)}
      >
        Add Custom Service
      </button>
    </div>
  {:else}
    <!-- Popular Services -->
    <div>
      <h4 class="tf-heading-4 mb-6">🔥 Popular Services</h4>
      <div class="tf-grid tf-grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {#each popularServices as service}
          <ServiceCard
            {service}
            isSelected={isServiceSelected(service)}
            on:select={handleServiceSelect}
          />
        {/each}
      </div>
    </div>

    <!-- Service Categories -->
    {#each Object.keys(SERVICE_CATEGORIES) as category}
      <ServiceCategory
        {category}
        {selectedServices}
        on:serviceSelect={handleServiceSelect}
      />
    {/each}
  {/if}

  <!-- Custom Service Form -->
  <div class="tf-card">
    <div class="tf-card-header">
      <h4 class="tf-heading-4">Add Custom Service</h4>
      <p class="text-gray-900 text-sm">
        Create a custom line item not covered by our templates
      </p>
    </div>

    {#if showCustomForm}
      <div class="tf-card-body space-y-4">
        <div>
          <label class="tf-label">Service Name</label>
          <input
            type="text"
            class="tf-input"
            bind:value={customItem.name}
            placeholder="Custom service name"
          />
        </div>

        <div>
          <label class="tf-label">Description (Optional)</label>
          <textarea
            class="tf-input tf-textarea"
            bind:value={customItem.description}
            placeholder="Describe what this service includes"
            rows="2"
          />
        </div>

        <div class="tf-grid tf-grid-cols-2 gap-4">
          <div>
            <label class="tf-label">Quantity</label>
            <input
              type="number"
              class="tf-input"
              bind:value={customItem.quantity}
              min="1"
              step="1"
            />
          </div>

          <div>
            <label class="tf-label">Unit Price</label>
            <input
              type="number"
              class="tf-input"
              bind:value={customItem.unitPrice}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            class="tf-btn tf-btn-primary"
            on:click={addCustomItem}
            disabled={!customItem.name || customItem.unitPrice <= 0}
          >
            Add Custom Service
          </button>
          <button
            class="tf-btn tf-btn-outline"
            on:click={() => (showCustomForm = false)}
          >
            Cancel
          </button>
        </div>
      </div>
    {:else}
      <div class="tf-card-body">
        <button
          class="tf-btn tf-btn-outline w-full"
          on:click={() => (showCustomForm = true)}
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Custom Service
        </button>
      </div>
    {/if}
  </div>
</div>
