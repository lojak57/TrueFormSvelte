<script lang="ts">
  import { fly } from "svelte/transition";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
  import type { ServiceFeature } from "$lib/types/service.types";

  export let features: ServiceFeature[];
  export let title: string = "What Makes This Special";
  export let description: string =
    "Every detail is designed to deliver exceptional results for your business.";
</script>

<section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.1} once={true} let:isVisible>
      {#if isVisible}
        <!-- Header -->
        <div class="text-center mb-16" in:fly={{ y: 30, duration: 600 }}>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each features as feature, i}
            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              in:fly={{ y: 50, duration: 600, delay: 200 + i * 100 }}
            >
              <div class="flex items-center mb-6">
                <div
                  class="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4"
                >
                  <svelte:component
                    this={feature.icon}
                    size={24}
                    class="text-accent-600"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p class="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          {/each}
        </div>

        <!-- Bottom Stats -->
        <div
          class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          in:fly={{ y: 40, duration: 600, delay: 800 }}
        >
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-3xl font-bold text-accent-600 mb-2">7 Days</div>
            <div class="text-gray-600">Average Delivery</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-3xl font-bold text-accent-600 mb-2">24hr</div>
            <div class="text-gray-600">Support Response</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="text-3xl font-bold text-accent-600 mb-2">100%</div>
            <div class="text-gray-600">Custom Design</div>
          </div>
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>
