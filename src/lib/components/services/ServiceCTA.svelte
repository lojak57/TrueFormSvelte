<script lang="ts">
  import { fly } from "svelte/transition";
  import { Zap, Clock, Shield } from "lucide-svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
  import { page } from "$app/stores";

  export let title: string;
  export let description: string;

  const servicePricing: Record<
    string,
    { startingPrice: string; typicalRange: string }
  > = {
    marketing: { startingPrice: "$999", typicalRange: "$999-$1,199" },
    ecommerce: { startingPrice: "$1,199", typicalRange: "$1,499-$1,649" },
    booking: { startingPrice: "$1,199", typicalRange: "$1,499-$1,599" },
    membership: { startingPrice: "$1,499", typicalRange: "$1,699-$1,899" },
    realestate: { startingPrice: "$1,899", typicalRange: "$1,999-$2,199" },
    education: { startingPrice: "$1,499", typicalRange: "$1,799-$1,999" },
  };

  $: slug = $page.params.slug;
  $: pricing = servicePricing[slug] || {
    startingPrice: "$999",
    typicalRange: "$1,200-$1,500",
  };
  $: serviceSpecificCTA =
    slug && slug !== "/"
      ? `Start Your ${title} Project`
      : "Start Your Project Today";
</script>

<section class="py-20 bg-gray-900 text-white relative overflow-hidden">
  <!-- Background Effects -->
  <div
    class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-900/30 via-transparent to-transparent"
  />
  <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

  <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.3} once={true} let:isVisible>
      {#if isVisible}
        <!-- Main CTA -->
        <div class="text-center mb-16" in:fly={{ y: 50, duration: 800 }}>
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            {title}
          </h2>
          <p
            class="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              class="px-10 py-4 text-lg shadow-2xl hover:shadow-accent-500/25 transition-all duration-300 hover:scale-105"
              on:click={() =>
                (window.location.href = slug
                  ? `/request?service=${slug}&start=true`
                  : "/request?start=true")}
            >
              <Zap size={20} class="mr-2" />
              {serviceSpecificCTA}
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="px-10 py-4 text-lg border-white bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm font-semibold"
              on:click={() => (window.location.href = "/contact")}
            >
              Schedule a Strategy Call
            </Button>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div
          class="grid md:grid-cols-3 gap-8 text-center"
          in:fly={{ y: 30, duration: 600, delay: 400 }}
        >
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mb-4"
            >
              <Clock size={28} class="text-white" />
            </div>
            <h3 class="text-lg font-semibold mb-2">7-Day Delivery</h3>
            <p class="text-gray-300">
              From concept to live website in just one week
            </p>
          </div>

          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mb-4"
            >
              <Shield size={28} class="text-white" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Year 1 Support</h3>
            <p class="text-gray-300">Hosting, updates, and support included</p>
          </div>

          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mb-4"
            >
              <Zap size={28} class="text-white" />
            </div>
            <h3 class="text-lg font-semibold mb-2">
              Starting at {pricing.startingPrice}
            </h3>
            <p class="text-gray-300">
              Transparent pricing, no hourly billing, no hidden costs
            </p>
          </div>
        </div>

        <!-- Risk-Free Guarantee -->
        <div
          class="mt-16 text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          in:fly={{ y: 30, duration: 600, delay: 600 }}
        >
          <h3 class="text-2xl font-semibold mb-4">100% Risk-Free Guarantee</h3>
          <p class="text-gray-300 text-lg max-w-2xl mx-auto">
            Not happy with your website? We'll work with you until you love it,
            or refund your money. That's how confident we are in our process.
          </p>
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>

<style>
  .bg-grid-white\/\[0\.02\] {
    background-image: radial-gradient(circle, white 1px, transparent 1px);
  }
</style>
