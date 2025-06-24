<script lang="ts">
  import { fly } from "svelte/transition";
  import { Check, Zap, Target } from "lucide-svelte";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
  import type { ServiceMarketingSection } from "$lib/types/service.types";

  export let marketingContent: ServiceMarketingSection;
</script>

<section class="py-20 bg-gradient-to-br from-accent-50 to-blue-50">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.3} once={true} let:isVisible>
      {#if isVisible}
        <div
          class="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          in:fly={{ y: 50, duration: 800 }}
        >
          <!-- Header -->
          <div
            class="text-center mb-12"
            in:fly={{ y: 30, duration: 600, delay: 200 }}
          >
            <div
              class="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-full text-sm font-medium mb-6"
            >
              <Target size={16} class="mr-2" />
              Why Choose TrueForm
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {marketingContent.title}
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {marketingContent.description}
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <!-- Key Highlights -->
            <div in:fly={{ x: -50, duration: 600, delay: 400 }}>
              <h3
                class="text-2xl font-semibold text-gray-900 mb-6 flex items-center"
              >
                <Zap size={24} class="text-accent-600 mr-3" />
                What You Get
              </h3>
              <div class="space-y-4">
                {#each marketingContent.highlights as highlight, i}
                  <div
                    class="flex items-start"
                    in:fly={{ x: -20, duration: 400, delay: 600 + i * 100 }}
                  >
                    <Check
                      size={20}
                      class="text-green-600 mr-3 mt-1 flex-shrink-0"
                    />
                    <span class="text-gray-700 font-medium">{highlight}</span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Business Benefits -->
            <div in:fly={{ x: 50, duration: 600, delay: 400 }}>
              <h3
                class="text-2xl font-semibold text-gray-900 mb-6 flex items-center"
              >
                <Target size={24} class="text-accent-600 mr-3" />
                Business Impact
              </h3>
              <div class="space-y-4">
                {#each marketingContent.benefits as benefit, i}
                  <div
                    class="flex items-start"
                    in:fly={{ x: 20, duration: 400, delay: 600 + i * 100 }}
                  >
                    <Check
                      size={20}
                      class="text-green-600 mr-3 mt-1 flex-shrink-0"
                    />
                    <span class="text-gray-700 font-medium">{benefit}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- Value Proposition -->
          <div
            class="mt-12 text-center bg-gray-50 rounded-2xl p-8"
            in:fly={{ y: 30, duration: 600, delay: 800 }}
          >
            <h3 class="text-2xl font-semibold text-gray-900 mb-4">
              The TrueForm Advantage
            </h3>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto">
              While others charge $5k-15k and take months to deliver, we provide
              enterprise-quality results at a fraction of the cost in just 7
              days. Professional design, modern technology, and ongoing
              support—all included.
            </p>
          </div>
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>
