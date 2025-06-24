<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { Check } from "lucide-svelte";
  import { PRICING_DATA } from "$lib/data/content";
</script>

<!-- Pricing Section -->
<section class="py-16 sm:py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 sm:mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
        DIY vs. Developer vs. <span class="text-accent-600">TrueForm</span>
      </h2>
      <p class="text-lg sm:text-xl text-gray-600 px-4 sm:px-0">
        Why spend 50+ hours or $10k+ when you can get better results for $999?
      </p>
    </div>

    <!-- Mobile Comparison Cards -->
    <div class="block lg:hidden mb-16 space-y-6">
      <!-- TrueForm Card (Featured) -->
      <div class="relative">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-accent-600 to-accent-400 rounded-2xl blur opacity-75"
        />
        <div
          class="relative bg-white rounded-2xl border-2 border-accent-200 shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
        >
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
                ⚡ BEST VALUE
              </div>
              <h3 class="text-2xl font-black text-white mb-1 tracking-tight">
                TrueForm
              </h3>
              <div
                class="text-3xl font-black text-white mt-3 mb-1 tracking-tight"
              >
                $999
              </div>
              <p class="text-sm text-accent-100 font-medium">
                Year 1 Total Cost
              </p>
            </div>
          </div>
          <div class="p-5 space-y-4 bg-gradient-to-b from-white to-gray-50">
            <div
              class="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-accent-50/50 transition-colors duration-200"
            >
              <span class="text-sm font-semibold text-gray-800"
                >DIY Hours Required</span
              >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full" />
                <span class="text-sm font-bold text-green-600"
                  >&lt; 2 hours</span
                >
              </div>
            </div>
            <div
              class="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-accent-50/50 transition-colors duration-200"
            >
              <span class="text-sm font-semibold text-gray-800"
                >Time to Launch</span
              >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-accent-500 rounded-full" />
                <span class="text-sm font-bold text-accent-600">7 days</span>
              </div>
            </div>
            <div
              class="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-accent-50/50 transition-colors duration-200"
            >
              <span class="text-sm font-semibold text-gray-800"
                >Custom Design</span
              >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full" />
                <span class="text-sm font-bold text-green-600">Yes</span>
              </div>
            </div>
            <div
              class="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-accent-50/50 transition-colors duration-200"
            >
              <span class="text-sm font-semibold text-gray-800"
                >Hosting + Support</span
              >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full" />
                <span class="text-sm font-bold text-green-600"
                  >First year FREE</span
                >
              </div>
            </div>
            <div
              class="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-accent-50/50 transition-colors duration-200"
            >
              <span class="text-sm font-semibold text-gray-800"
                >Year 2+ Hosting</span
              >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-accent-500 rounded-full" />
                <span class="text-sm font-bold text-accent-600">$179/year</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DIY Builders -->
      <div
        class="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div
          class="bg-gradient-to-r from-red-50 to-red-100 p-5 text-center border-b border-red-200 relative"
        >
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-red-200/30 rounded-full -translate-y-12 translate-x-12"
          />
          <div class="relative z-10">
            <h3 class="text-xl font-bold text-gray-900 mb-1 tracking-tight">
              Wix/Squarespace
            </h3>
            <div class="text-2xl font-bold text-gray-900 mt-3 mb-1">
              $600-700
            </div>
            <p class="text-sm text-gray-600 font-medium">Year 1 Total Cost</p>
          </div>
        </div>
        <div class="p-5 space-y-3">
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >DIY Hours Required</span
            >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-red-500 rounded-full" />
              <span class="text-sm font-bold text-red-600">40-50+ hours</span>
            </div>
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Time to Launch</span
            >
            <span class="text-sm text-gray-600 font-medium"
              >Weeks of DIY work</span
            >
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Custom Design</span
            >
            <span class="text-sm text-gray-600 font-medium"
              >Limited templates</span
            >
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Hosting + Support</span
            >
            <span class="text-sm text-gray-600 font-medium">Extra $$</span>
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Year 2+ Hosting</span
            >
            <span class="text-sm text-gray-600 font-medium">$300+/year</span>
          </div>
        </div>
      </div>

      <!-- Local Developer -->
      <div
        class="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div
          class="bg-gradient-to-r from-blue-50 to-blue-100 p-5 text-center border-b border-blue-200 relative"
        >
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full -translate-y-12 translate-x-12"
          />
          <div class="relative z-10">
            <h3 class="text-xl font-bold text-gray-900 mb-1 tracking-tight">
              Local Developer
            </h3>
            <div class="text-2xl font-bold text-gray-900 mt-3 mb-1">
              $10-15k
            </div>
            <p class="text-sm text-gray-600 font-medium">Year 1 Total Cost</p>
          </div>
        </div>
        <div class="p-5 space-y-3">
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >DIY Hours Required</span
            >
            <span class="text-sm text-gray-600 font-medium">~10 oversight</span>
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Time to Launch</span
            >
            <span class="text-sm text-gray-600 font-medium">6-12 weeks</span>
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Custom Design</span
            >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full" />
              <span class="text-sm font-bold text-green-600">Yes</span>
            </div>
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Hosting + Support</span
            >
            <span class="text-sm text-gray-600 font-medium">Extra $$$</span>
          </div>
          <div
            class="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span class="text-sm font-semibold text-gray-700"
              >Year 2+ Hosting</span
            >
            <span class="text-sm text-gray-600 font-medium">$600+/year</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Comparison Table -->
    <div class="mb-16 sm:mb-20 overflow-x-auto hidden lg:block">
      <table
        class="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="p-4 text-left font-semibold" />
            <th class="p-4 text-center">Wix/Squarespace</th>
            <th class="p-4 text-center">Local Developer</th>
            <th class="p-4 text-center bg-accent-50 text-accent-700 font-bold"
              >TrueForm</th
            >
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr>
            <td class="p-4 font-medium">Year 1 Total Cost</td>
            <td class="p-4 text-center">$600-700</td>
            <td class="p-4 text-center">$10-15k</td>
            <td class="p-4 text-center bg-accent-50 font-bold">$999</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="p-4 font-medium">DIY Hours Required</td>
            <td class="p-4 text-center text-red-600 font-semibold"
              >40-50+ hours</td
            >
            <td class="p-4 text-center">~10 oversight</td>
            <td class="p-4 text-center bg-accent-50 font-bold text-green-600"
              >&lt; 2 hours</td
            >
          </tr>
          <tr>
            <td class="p-4 font-medium">Time to Launch</td>
            <td class="p-4 text-center">Weeks of DIY work</td>
            <td class="p-4 text-center">6-12 weeks</td>
            <td class="p-4 text-center bg-accent-50 font-bold">7 days</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="p-4 font-medium">Custom Design</td>
            <td class="p-4 text-center text-gray-800">Limited templates</td>
            <td class="p-4 text-center">Yes</td>
            <td class="p-4 text-center bg-accent-50 font-bold">Yes</td>
          </tr>
          <tr>
            <td class="p-4 font-medium">Hosting + Support Included</td>
            <td class="p-4 text-center text-gray-800">Extra $$</td>
            <td class="p-4 text-center text-gray-800">Extra $$$</td>
            <td class="p-4 text-center bg-accent-50 font-bold text-green-600"
              >First year FREE</td
            >
          </tr>
          <tr class="bg-gray-50">
            <td class="p-4 font-medium">Year 2+ Hosting</td>
            <td class="p-4 text-center">$300+/year</td>
            <td class="p-4 text-center">$600+/year</td>
            <td class="p-4 text-center bg-accent-50 font-bold">$179/year</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
      {#each PRICING_DATA as tier}
        <Card
          class="p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 relative {tier.isPopular
            ? 'border-2 border-accent-500 transform scale-105'
            : ''}"
        >
          {#if tier.badge}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-{tier.isPopular
                  ? 'accent'
                  : 'green'}-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                {tier.badge}
              </span>
            </div>
          {/if}

          <h3
            class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 {tier.badge
              ? 'mt-4'
              : ''}"
          >
            {tier.name}
          </h3>
          <div
            class="text-4xl sm:text-5xl font-bold text-{tier.isPopular
              ? 'accent'
              : 'green'}-600 mb-{tier.monthlyPrice ? '2' : '4'}"
          >
            {tier.price}
          </div>

          {#if tier.monthlyPrice}
            <p class="text-sm text-gray-600 mb-4">{tier.monthlyPrice}</p>
          {/if}

          <p class="text-gray-700 mb-6 sm:mb-8">{tier.description}</p>

          <ul class="text-left space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {#each tier.features as feature}
              <li class="flex items-start gap-2">
                <Check size={20} class="text-green-500 mt-0.5 flex-shrink-0" />
                <span class="text-sm sm:text-base">{feature}</span>
              </li>
            {/each}
          </ul>

          <Button
            variant={tier.isPopular ? "accent" : "outline"}
            size="lg"
            class="w-full {tier.isPopular ? 'shadow-lg mb-3' : ''}"
            on:click={() =>
              (window.location.href = tier.buttonHref.includes("/request")
                ? `${tier.buttonHref}?start=true`
                : tier.buttonHref)}
          >
            {tier.buttonText}
          </Button>

          {#if tier.isPopular}
            <p class="text-xs text-gray-700">
              Buy now, pay later options available
            </p>
          {/if}
        </Card>
      {/each}
    </div>

    <!-- BNPL Info -->
    <div class="text-center mt-8 sm:mt-12 px-4">
      <p class="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
        🚀 <strong>Fast Track:</strong> Start your project today with our Buy Now,
        Pay Later option. No credit check required - spread your investment over
        12 months at just $83/month.
      </p>
    </div>
  </div>
</section>
