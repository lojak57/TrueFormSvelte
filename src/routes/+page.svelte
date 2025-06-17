<script lang="ts">
  // Import all the focused section components
  import Hero from '$lib/components/sections/Hero.svelte';
  import Stats from '$lib/components/sections/Stats.svelte';
  import Features from '$lib/components/sections/Features.svelte';
  import AdvancedFeatures from '$lib/components/sections/AdvancedFeatures.svelte';
  import Testimonials from '$lib/components/sections/Testimonials.svelte';
  import Pricing from '$lib/components/sections/Pricing.svelte';
  import CallToAction from '$lib/components/sections/CallToAction.svelte';
</script>

<svelte:head>
  <title>TrueForm | Transform Your Business with Professional Websites</title>
  <meta name="description" content="Get a stunning, professional website that converts visitors into customers. From concept to completion in just days." />
</svelte:head>

<!-- Clean, focused page composition -->
<div class="min-h-screen">
  <Hero />
  <Stats />
  <Features />
  <AdvancedFeatures />
  <Testimonials />
  <Pricing />
  <CallToAction />
</div>

 