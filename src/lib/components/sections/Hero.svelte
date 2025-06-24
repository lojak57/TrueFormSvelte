<script lang="ts">
  import { fly } from "svelte/transition";
  import Button from "$lib/components/ui/Button.svelte";
  import { ArrowRight } from "lucide-svelte";
  import { HERO_CONTENT } from "$lib/data/content";
</script>

<svelte:head>
  <title>TrueForm | Transform Your Business with Professional Websites</title>
  <meta
    name="description"
    content="Get a stunning, professional website that converts visitors into customers. From concept to completion in just days."
  />
</svelte:head>

<!-- Hero Section with Enhanced Design -->
<section
  class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-accent-900 text-white overflow-hidden mobile-hero"
>
  <!-- Background Effects -->
  <div
    class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-900/20 via-transparent to-transparent"
  />
  <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

  <!-- Mobile overlay for better contrast -->
  <div class="absolute inset-0 bg-gray-900/40 md:bg-transparent" />

  <div
    class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-20 lg:py-32 mobile-content"
  >
    <div class="text-center">
      <!-- Premium Badge -->
      <div
        class="inline-flex items-center px-4 py-2 mb-6 sm:mb-8 bg-accent-600/30 sm:bg-accent-600/20 border border-accent-400/50 sm:border-accent-400/30 rounded-full text-accent-200 sm:text-accent-300 text-sm font-medium backdrop-blur-sm"
      >
        <svelte:component
          this={HERO_CONTENT.badge.icon}
          size={16}
          class="mr-2"
        />
        <span class="font-semibold sm:font-medium"
          >{HERO_CONTENT.badge.text}</span
        >
      </div>

      <h1
        class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
      >
        <span class="text-white">{HERO_CONTENT.title.main}</span>
        <span
          class="bg-gradient-to-r from-accent-300 to-yellow-300 sm:from-accent-400 sm:to-yellow-400 bg-clip-text text-transparent block mt-1 sm:mt-0"
        >
          {HERO_CONTENT.title.highlight}
        </span>
      </h1>

      <p
        class="text-lg sm:text-xl md:text-2xl text-gray-200 sm:text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
      >
        {HERO_CONTENT.description}
      </p>

      <div
        class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-2 sm:px-0"
      >
        <Button
          variant="accent"
          size="lg"
          class="w-full sm:w-auto px-8 py-4 text-lg shadow-2xl hover:shadow-accent-500/25 transition-all duration-300 hover:scale-105"
          on:click={() =>
            (window.location.href = `${HERO_CONTENT.buttons.primary.href}?start=true`)}
        >
          <div class="flex items-center gap-3 justify-center">
            <svelte:component
              this={HERO_CONTENT.buttons.primary.icon}
              size={24}
            />
            {HERO_CONTENT.buttons.primary.text}
            <ArrowRight size={20} />
          </div>
        </Button>

        <Button
          variant="outline"
          size="lg"
          class="w-full sm:w-auto px-8 py-4 text-lg border-white/70 sm:border-white bg-white/20 sm:bg-white/10 text-white hover:bg-white/30 sm:hover:bg-white/20 hover:text-white backdrop-blur-sm font-bold"
          on:click={() =>
            (window.location.href = HERO_CONTENT.buttons.secondary.href)}
        >
          {HERO_CONTENT.buttons.secondary.text}
        </Button>
      </div>

      <!-- Trust Indicators -->
      <div
        class="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-300 sm:text-gray-400 px-2 sm:px-0"
      >
        {#each HERO_CONTENT.trustIndicators as indicator}
          <div class="flex items-center gap-2">
            <svelte:component this={indicator.icon} size={16} />
            <span class="text-sm font-medium sm:font-normal"
              >{indicator.text}</span
            >
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Bottom Wave -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" class="w-full h-8 sm:h-12 md:h-20 fill-gray-50">
      <path
        d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
      />
    </svg>
  </div>
</section>

<style>
  .bg-grid-white\/\[0\.02\] {
    background-image: radial-gradient(circle, white 1px, transparent 1px);
  }

  /* Mobile-first hero improvements */
  .mobile-hero {
    min-height: 85vh;
    position: relative;
  }

  .mobile-content {
    min-height: calc(85vh - 120px); /* Account for wave */
    display: flex;
    align-items: center;
  }

  @media (min-width: 768px) {
    .mobile-hero {
      min-height: auto;
    }

    .mobile-content {
      min-height: auto;
      display: block;
    }
  }

  /* Enhanced mobile contrast */
  @media (max-width: 767px) {
    .mobile-hero h1,
    .mobile-hero p,
    .mobile-hero span {
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    /* Better mobile spacing */
    .mobile-content {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
  }
</style>
