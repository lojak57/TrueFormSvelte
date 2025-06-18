<script lang="ts">
  // Import all the focused section components
  import Hero from '$lib/components/sections/Hero.svelte';
  import Industries from '$lib/components/sections/Industries.svelte';
  import Features from '$lib/components/sections/Features.svelte';
  import AdvancedFeatures from '$lib/components/sections/AdvancedFeatures.svelte';
  import Pricing from '$lib/components/sections/Pricing.svelte';
  import CallToAction from '$lib/components/sections/CallToAction.svelte';
</script>

<svelte:head>
  <title>TrueForm | Your Business' Digital Soul, In Its True Form</title>
  <meta name="description" content="Custom websites built in 7 days for $999. First year hosting included. Skip 50+ hours of DIY frustration." />
</svelte:head>

<!-- Clean, focused page composition -->
<div class="min-h-screen">
  <Hero />
  <Industries />
  <Features />
  <AdvancedFeatures />
  <Pricing />
  <CallToAction />
</div>

 