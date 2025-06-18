<script lang="ts">
  import { Building2, ShoppingBag, Sparkles, Briefcase } from "lucide-svelte";

  const industries = [
    {
      icon: ShoppingBag,
      name: "E-commerce",
      description: "Full online stores with inventory, payments, and shipping",
    },
    {
      icon: Sparkles,
      name: "Beauty & Wellness",
      description: "Salons, spas, and wellness centers with booking systems",
    },
    {
      icon: Building2,
      name: "Professional Services",
      description: "Law firms, agencies, and consultants showcasing expertise",
    },
    {
      icon: Briefcase,
      name: "Enterprise Solutions",
      description: "Complex platforms for larger organizations",
    },
  ];
</script>

<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        We've Built for Every Industry
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        From local businesses to enterprise platforms, we understand what
        different industries need to succeed online.
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each industries as industry}
        <div
          class="text-center group hover:scale-105 transition-transform duration-300"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-100 flex items-center justify-center group-hover:bg-accent-200 transition-colors"
          >
            <svelte:component
              this={industry.icon}
              size={32}
              class="text-accent-600"
            />
          </div>
          <h3 class="text-xl font-semibold mb-2">{industry.name}</h3>
          <p class="text-gray-600">{industry.description}</p>
        </div>
      {/each}
    </div>

    <!-- Enterprise Upsell -->
    <div class="mt-16 p-8 bg-gray-900 text-white rounded-2xl text-center">
      <h3 class="text-2xl font-bold mb-4">Looking for Something More?</h3>
      <p class="text-lg mb-6 opacity-90">
        Need custom applications, multi-location management, or enterprise-grade
        infrastructure? Our parent platform <span
          class="font-semibold text-accent-400">Pillar Apps</span
        > specializes in complex digital solutions.
      </p>
      <a
        href="/enterprise"
        class="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Learn More About Enterprise Solutions →
      </a>
    </div>
  </div>
</section>
