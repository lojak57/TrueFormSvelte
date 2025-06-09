<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Button from '$lib/components/ui/Button.svelte';
  import { ArrowRight } from 'lucide-svelte';
  import { HERO_CONTENT } from '$lib/data/content';
  
  let heroVisible = false;
  
  onMount(() => {
    setTimeout(() => heroVisible = true, 100);
  });
</script>

<svelte:head>
  <title>TrueForm | Transform Your Business with Professional Websites</title>
  <meta name="description" content="Get a stunning, professional website that converts visitors into customers. From concept to completion in just days." />
</svelte:head>

<!-- Hero Section with Enhanced Design -->
<section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-accent-900 text-white overflow-hidden">
  <!-- Background Effects -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-900/20 via-transparent to-transparent"></div>
  <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
  
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
    {#if heroVisible}
      <div class="text-center" in:fly={{ y: 50, duration: 800, delay: 200 }}>
        <!-- Premium Badge -->
        <div class="inline-flex items-center px-4 py-2 mb-8 bg-accent-600/20 border border-accent-400/30 rounded-full text-accent-300 text-sm font-medium backdrop-blur-sm">
          <svelte:component this={HERO_CONTENT.badge.icon} size={16} class="mr-2" />
          {HERO_CONTENT.badge.text}
        </div>
        
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          {HERO_CONTENT.title.main}
          <span class="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent">
            {HERO_CONTENT.title.highlight}
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          {HERO_CONTENT.description}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button variant="accent" size="lg" class="px-8 py-4 text-lg shadow-2xl hover:shadow-accent-500/25 transition-all duration-300 hover:scale-105">
            <a href={HERO_CONTENT.buttons.primary.href} class="flex items-center gap-3">
              <svelte:component this={HERO_CONTENT.buttons.primary.icon} size={24} />
              {HERO_CONTENT.buttons.primary.text}
              <ArrowRight size={20} />
            </a>
          </Button>
          
          <Button variant="outline" size="lg" class="px-8 py-4 text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
            <a href={HERO_CONTENT.buttons.secondary.href}>
              {HERO_CONTENT.buttons.secondary.text}
            </a>
          </Button>
        </div>
        
        <!-- Trust Indicators -->
        <div class="flex flex-wrap justify-center items-center gap-8 text-gray-400">
          {#each HERO_CONTENT.trustIndicators as indicator}
            <div class="flex items-center gap-2">
              <svelte:component this={indicator.icon} size={16} />
              <span class="text-sm">{indicator.text}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Bottom Wave -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" class="w-full h-12 md:h-20 fill-gray-50">
      <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
    </svg>
  </div>
</section>

<style>
  .bg-grid-white\/\[0\.02\] {
    background-image: radial-gradient(circle, white 1px, transparent 1px);
  }
</style> 