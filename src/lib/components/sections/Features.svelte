<script lang="ts">
  import { fly } from "svelte/transition";
  import Card from "$lib/components/ui/Card.svelte";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
  import { FEATURES_DATA } from "$lib/data/content";
</script>

<!-- Features Section with Performance Optimization -->
<section id="features" class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.1} once={true} let:isVisible>
      {#if isVisible}
        <div class="text-center mb-16" in:fly={{ y: 30, duration: 600 }}>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Choose TrueForm?
          </h2>
          <p class="text-xl text-gray-600 max-w-4xl mx-auto">
            We're not trying to be everything to everyone. We're really good at
            building professional websites for businesses that need them done
            right, done fast, and done honestly.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each FEATURES_DATA as feature, i}
            <div in:fly={{ y: 50, duration: 600, delay: i * 100 }}>
              <Card
                class="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-0 shadow-lg"
              >
                <div class="flex items-center mb-6">
                  <div
                    class="w-12 h-12 rounded-xl {feature.colorScheme} flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <svelte:component this={feature.icon} size={24} />
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </div>
          {/each}
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>
