<script lang="ts">
  import { Check, X, Zap, Award } from "lucide-svelte";

  const competitors = [
    {
      name: "DIY Builders",
      subtitle: "Wix, Squarespace, etc.",
      price: "$20-40/mo",
      totalCost: "$240-480/year",
      features: [
        { name: "Custom Design", value: false },
        { name: "Professional Look", value: false },
        { name: "Your Time Required", value: "50+ hours" },
        { name: "Performance", value: false },
        { name: "SEO Optimization", value: false },
        { name: "Human Support", value: false },
        { name: "Hosting Included", value: true },
        { name: "Mobile Optimized", value: "basic" },
      ],
    },
    {
      name: "Freelancers",
      subtitle: "Upwork, Fiverr, etc.",
      price: "$500-2000",
      totalCost: "$500-2000 + hosting",
      features: [
        { name: "Custom Design", value: "maybe" },
        { name: "Professional Look", value: "maybe" },
        { name: "Your Time Required", value: "20+ hours" },
        { name: "Performance", value: "maybe" },
        { name: "SEO Optimization", value: "maybe" },
        { name: "Human Support", value: false },
        { name: "Hosting Included", value: false },
        { name: "Mobile Optimized", value: "maybe" },
      ],
    },
    {
      name: "TrueForm",
      subtitle: "Professional & Fast",
      price: "$999",
      totalCost: "$999 (Year 1 hosting FREE)",
      isUs: true,
      features: [
        { name: "Custom Design", value: true },
        { name: "Professional Look", value: true },
        { name: "Your Time Required", value: "2 hours" },
        { name: "Performance", value: true },
        { name: "SEO Optimization", value: true },
        { name: "Human Support", value: true },
        { name: "Hosting Included", value: true },
        { name: "Mobile Optimized", value: true },
      ],
    },
    {
      name: "Agencies",
      subtitle: "Traditional dev shops",
      price: "$5000-15000",
      totalCost: "$5000-15000 + hosting",
      features: [
        { name: "Custom Design", value: true },
        { name: "Professional Look", value: true },
        { name: "Your Time Required", value: "40+ hours" },
        { name: "Performance", value: true },
        { name: "SEO Optimization", value: true },
        { name: "Human Support", value: "during project" },
        { name: "Hosting Included", value: false },
        { name: "Mobile Optimized", value: true },
      ],
    },
  ];

  function getFeatureDisplay(value: boolean | string) {
    if (value === true)
      return { icon: Check, class: "text-green-600", text: "✓" };
    if (value === false) return { icon: X, class: "text-red-500", text: "✗" };
    if (value === "maybe")
      return { icon: null, class: "text-yellow-600", text: "Maybe" };
    if (value === "basic")
      return { icon: null, class: "text-yellow-600", text: "Basic" };
    if (value === "during project")
      return {
        icon: null,
        class: "text-yellow-600",
        text: "During project only",
      };
    return { icon: null, class: "text-gray-700", text: value };
  }
</script>

<section class="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-16">
      <div
        class="inline-flex items-center px-4 py-2 mb-6 bg-accent-100 border border-accent-200 rounded-full text-accent-700 text-sm font-medium"
      >
        <Award size={16} class="mr-2" />
        The Smart Choice Comparison
      </div>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        What You Get vs <span class="text-accent-600">The Competition</span>
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        See exactly why TrueForm delivers more value than DIY builders,
        freelancers, or expensive agencies.
      </p>
    </div>

    <!-- Comparison Chart -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <!-- Mobile Cards View -->
        <div class="block md:hidden space-y-6">
          {#each competitors as competitor}
            <div class="relative">
              {#if competitor.isUs}
                <!-- TrueForm mobile highlight card -->
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-accent-600 to-accent-400 rounded-2xl blur opacity-75"
                />
                <div
                  class="relative bg-white rounded-2xl border-2 border-accent-200 shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
                >
                  <!-- Header -->
                  <div
                    class="bg-gradient-to-br from-accent-600 via-accent-500 to-accent-700 p-6 text-center relative overflow-hidden"
                  >
                    <!-- Background pattern -->
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    />
                    <div
                      class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"
                    />

                    <div class="relative z-10">
                      <div
                        class="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3 shadow-lg"
                      >
                        <Zap size={12} class="mr-1" />
                        BEST VALUE
                      </div>
                      <h3
                        class="text-2xl font-black text-white mb-1 tracking-tight"
                      >
                        {competitor.name}
                      </h3>
                      <p class="text-sm text-accent-100 mb-3 font-medium">
                        {competitor.subtitle}
                      </p>
                      <div
                        class="text-3xl font-black text-white mb-1 tracking-tight"
                      >
                        {competitor.price}
                      </div>
                      <p class="text-sm text-accent-100 font-medium">
                        {competitor.totalCost}
                      </p>
                    </div>
                  </div>

                  <!-- Features -->
                  <div
                    class="p-5 space-y-4 bg-gradient-to-b from-white to-gray-50"
                  >
                    {#each competitor.features as feature}
                      {@const display = getFeatureDisplay(feature.value)}
                      <div
                        class="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-accent-50/50 transition-colors duration-200"
                      >
                        <span class="text-sm font-semibold text-gray-800"
                          >{feature.name}</span
                        >
                        {#if display.icon}
                          <div
                            class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100"
                          >
                            <svelte:component
                              this={display.icon}
                              size={18}
                              class={display.class}
                            />
                          </div>
                        {:else}
                          <span
                            class="text-sm {display.class} font-bold px-3 py-1 rounded-full bg-accent-100 text-accent-700"
                            >{display.text}</span
                          >
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              {:else}
                <!-- Regular competitor mobile card -->
                <div
                  class="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01]"
                >
                  <!-- Header -->
                  <div
                    class="bg-gradient-to-r from-gray-50 to-gray-100 p-5 text-center border-b border-gray-200 relative"
                  >
                    <div
                      class="absolute top-0 right-0 w-24 h-24 bg-gray-200/30 rounded-full -translate-y-12 translate-x-12"
                    />
                    <div class="relative z-10">
                      <h3
                        class="text-xl font-bold text-gray-900 mb-1 tracking-tight"
                      >
                        {competitor.name}
                      </h3>
                      <p class="text-sm text-gray-600 mb-3 font-medium">
                        {competitor.subtitle}
                      </p>
                      <div class="text-2xl font-bold text-gray-900 mb-1">
                        {competitor.price}
                      </div>
                      <p class="text-sm text-gray-600 font-medium">
                        {competitor.totalCost}
                      </p>
                    </div>
                  </div>

                  <!-- Features -->
                  <div class="p-5 space-y-3">
                    {#each competitor.features as feature}
                      {@const display = getFeatureDisplay(feature.value)}
                      <div
                        class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span class="text-sm font-semibold text-gray-700"
                          >{feature.name}</span
                        >
                        {#if display.icon}
                          <div
                            class="flex items-center justify-center w-7 h-7 rounded-full {display.class ===
                            'text-green-600'
                              ? 'bg-green-100'
                              : 'bg-red-100'}"
                          >
                            <svelte:component
                              this={display.icon}
                              size={16}
                              class={display.class}
                            />
                          </div>
                        {:else}
                          <span
                            class="text-xs {display.class} font-bold px-2 py-1 rounded-full {display.class.includes(
                              'yellow'
                            )
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-700'}"
                            >{display.text}</span
                          >
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Desktop Grid View -->
        <div class="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-4">
          {#each competitors as competitor}
            <div class="relative">
              {#if competitor.isUs}
                <!-- TrueForm highlight card -->
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-accent-600 to-accent-400 rounded-2xl blur opacity-75"
                />
                <div
                  class="relative bg-white rounded-2xl border-2 border-accent-200 shadow-xl"
                >
                  <div class="p-6">
                    <div class="text-center mb-6">
                      <div
                        class="inline-flex items-center px-3 py-1 bg-accent-600 text-white text-xs font-semibold rounded-full mb-3"
                      >
                        <Zap size={12} class="mr-1" />
                        BEST VALUE
                      </div>
                      <h3 class="text-2xl font-bold text-gray-900">
                        {competitor.name}
                      </h3>
                      <p class="text-sm text-gray-600 mb-3">
                        {competitor.subtitle}
                      </p>
                      <div class="text-3xl font-bold text-accent-600">
                        {competitor.price}
                      </div>
                      <p class="text-sm text-gray-600">
                        {competitor.totalCost}
                      </p>
                    </div>
                  </div>
                </div>
              {:else}
                <!-- Regular competitor card -->
                <div
                  class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="p-6">
                    <div class="text-center mb-6">
                      <h3 class="text-xl font-semibold text-gray-900">
                        {competitor.name}
                      </h3>
                      <p class="text-sm text-gray-500 mb-3">
                        {competitor.subtitle}
                      </p>
                      <div class="text-2xl font-bold text-gray-900">
                        {competitor.price}
                      </div>
                      <p class="text-sm text-gray-500">
                        {competitor.totalCost}
                      </p>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Features comparison table - Desktop Only -->
        <div
          class="mt-12 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hidden md:block"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[800px]">
              <!-- Header -->
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="text-left p-6 font-semibold text-gray-900 border-r border-gray-200"
                    >Features</th
                  >
                  {#each competitors as competitor}
                    <th
                      class="text-center p-6 border-r border-gray-200 last:border-r-0 {competitor.isUs
                        ? 'bg-accent-50'
                        : ''}"
                    >
                      <div
                        class="font-semibold {competitor.isUs
                          ? 'text-accent-700'
                          : 'text-gray-700'}"
                      >
                        {competitor.name}
                      </div>
                      {#if competitor.isUs}
                        <div
                          class="inline-flex items-center px-2 py-1 bg-accent-600 text-white text-xs font-semibold rounded-full mt-2"
                        >
                          <Zap size={10} class="mr-1" />
                          RECOMMENDED
                        </div>
                      {/if}
                    </th>
                  {/each}
                </tr>
              </thead>
              <!-- Body -->
              <tbody>
                {#each competitors[0].features as feature, index}
                  <tr class="border-b border-gray-100 hover:bg-gray-25">
                    <td
                      class="p-6 font-medium text-gray-900 border-r border-gray-200 bg-gray-50/50"
                    >
                      {feature.name}
                    </td>
                    {#each competitors as competitor}
                      {@const display = getFeatureDisplay(
                        competitor.features[index].value
                      )}
                      <td
                        class="p-6 text-center border-r border-gray-200 last:border-r-0 {competitor.isUs
                          ? 'bg-accent-25'
                          : ''}"
                      >
                        {#if display.icon}
                          <div class="flex justify-center">
                            <svelte:component
                              this={display.icon}
                              size={24}
                              class={display.class}
                            />
                          </div>
                        {:else}
                          <span class="text-sm {display.class} font-medium"
                            >{display.text}</span
                          >
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="text-center mt-8 md:mt-12 px-4">
          <div
            class="inline-flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors cursor-pointer text-center"
            on:click={() => (window.location.href = "/request")}
          >
            <Zap size={20} class="mr-2" />
            Get Your TrueForm Site Today →
          </div>
          <p class="text-sm text-gray-500 mt-3">
            Ready in 7 days. First year hosting included.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
