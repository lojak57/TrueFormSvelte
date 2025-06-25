<script lang="ts">
  // Import all the focused section components
  import Hero from "$lib/components/sections/Hero.svelte";
  import Industries from "$lib/components/sections/Industries.svelte";
  import Features from "$lib/components/sections/Features.svelte";
  import WebsiteEditor from "$lib/components/sections/WebsiteEditor.svelte";
  import ComparisonChart from "$lib/components/sections/ComparisonChart.svelte";
  import CallToAction from "$lib/components/sections/CallToAction.svelte";
</script>

<svelte:head>
  <title>TrueForm Apps | Professional Website Development in 7 Days</title>
  <meta
    name="description"
    content="Custom websites built in 7 days for $999. Professional design, first year hosting included. Transform your business with true-form-apps.com"
  />
</svelte:head>

<!-- Clean, focused page composition -->
<div class="min-h-screen">
  <Hero />
  <Features />
  <WebsiteEditor />
  <ComparisonChart />
  <Industries />
  <CallToAction />
</div>
