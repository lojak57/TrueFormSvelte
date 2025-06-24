<script lang="ts">
  import { Zap } from "lucide-svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { page } from "$app/stores";

  export let title: string;
  export let subtitle: string;
  export let description: string;
  export let heroImage: string;
  export let badge: string = "";

  // Service pricing mapping based on our new business model
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
  $: serviceSpecificCTA = `Start Your ${title} Project`;
</script>

<section
  class="relative bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white overflow-hidden"
>
  <!-- Background Effects -->
  <div
    class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-600/20 via-transparent to-transparent"
  />
  <!-- Geometric Background Pattern -->
  <div class="absolute inset-0 opacity-10">
    <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern
          id="services-pattern"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="1" fill="#38bdf8" />
          <rect
            x="5"
            y="5"
            width="10"
            height="10"
            fill="none"
            stroke="#38bdf8"
            stroke-width="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#services-pattern)" />
    </svg>
  </div>
  <!-- Top accent border -->
  <div
    class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400"
  />

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Content -->
      <div>
        {#if badge}
          <div
            class="inline-flex items-center px-4 py-2 mb-8 bg-accent-600/90 border border-accent-400/50 rounded-full text-white text-sm font-medium shadow-lg backdrop-blur-sm"
          >
            <Zap size={16} class="mr-2" />
            {badge}
          </div>
        {/if}

        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {title}
          <span
            class="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent block"
          >
            {subtitle}
          </span>
        </h1>

        <p class="text-xl text-gray-300 mb-6 leading-relaxed">
          {description}
        </p>

        <!-- Pricing Display -->
        <div
          class="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div class="text-3xl font-bold text-white">
                Starting at {pricing.startingPrice}
              </div>
              <div class="text-sm text-gray-300">
                Most clients: {pricing.typicalRange}
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-accent-300 font-semibold">
                CRM Integration Popular
              </div>
              <div class="text-xs text-gray-400">+$200 setup, $49/month</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <Button
            variant="accent"
            size="lg"
            class="px-8 py-4 text-lg shadow-2xl hover:shadow-accent-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden"
            on:click={() =>
              (window.location.href = `/request?service=${slug}&start=true`)}
          >
            <Zap size={20} class="mr-2" />
            {serviceSpecificCTA}
            <!-- Pulse effect for mobile prominence -->
            <div
              class="absolute inset-0 bg-white/20 animate-pulse opacity-30 md:opacity-0"
            />
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="px-8 py-4 text-lg border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm font-semibold"
            on:click={() => (window.location.href = "/contact")}
          >
            Discuss Your Needs
          </Button>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative">
        <div
          class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20"
        >
          <img
            src={heroImage}
            alt={title}
            class="w-full h-auto object-cover aspect-[4/3]"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-accent-900/30 to-transparent"
          />
        </div>
        <!-- Floating elements -->
        <div
          class="absolute -top-4 -right-4 w-24 h-24 bg-accent-500 rounded-full opacity-30 blur-xl"
        />
        <div
          class="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-400 rounded-full opacity-20 blur-2xl"
        />
      </div>
    </div>
  </div>

  <!-- Bottom Wave -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" class="w-full h-12 md:h-20 fill-gray-50">
      <path
        d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
      />
    </svg>
  </div>
</section>
