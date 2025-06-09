<script lang="ts">
  import { fly } from 'svelte/transition';
  import IntersectionObserver from '$lib/components/ui/IntersectionObserver.svelte';
  import { STATS_DATA } from '$lib/data/content';
</script>

<!-- Stats Section with Performance Optimization -->
<IntersectionObserver threshold={0.2} once={true} let:isVisible>
  {#if isVisible}
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          {#each STATS_DATA as stat, i}
            <div 
              class="text-center group"
              in:fly={{ y: 30, duration: 600, delay: i * 100 }}
            >
              <div class="inline-flex items-center justify-center w-12 h-12 bg-accent-100 rounded-xl mb-4 group-hover:bg-accent-200 transition-colors duration-300">
                <svelte:component this={stat.icon} size={24} class="text-accent-600" />
              </div>
              <div class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div class="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}
</IntersectionObserver> 