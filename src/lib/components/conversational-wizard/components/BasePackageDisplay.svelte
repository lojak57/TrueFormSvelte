<script lang="ts">
  import { CheckCircle } from "lucide-svelte";

  export let basePrice: number = 999;

  const baseFeatures = [
    "Professional website design",
    "Mobile-responsive layout",
    "Content management system",
    "Basic SEO optimization",
    "Contact forms & integration",
    "SSL security certificate",
    "1 year domain registration",
    "3 months maintenance included",
  ];

  function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  }
</script>

<div
  class="bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl text-white p-6 mb-8"
>
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-1">Professional Website Package</h2>
      <p class="text-accent-100">Everything you need to succeed online</p>
    </div>
    <div class="text-right">
      <div class="text-3xl font-bold">{formatPrice(basePrice)}</div>
      <p class="text-accent-100 text-sm">Base package</p>
    </div>
  </div>

  <!-- Features Grid -->
  <div class="grid md:grid-cols-2 gap-3">
    {#each baseFeatures as feature}
      <div class="flex items-center space-x-3">
        <CheckCircle class="w-5 h-5 text-accent-200 flex-shrink-0" />
        <span class="text-sm">{feature}</span>
      </div>
    {/each}
  </div>

  <!-- Additional Info -->
  <div class="mt-6 pt-6 border-t border-accent-500">
    <div class="grid md:grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-lg font-bold">4-6 weeks</div>
        <div class="text-accent-200 text-xs">Delivery timeline</div>
      </div>
      <div>
        <div class="text-lg font-bold">2-3 revisions</div>
        <div class="text-accent-200 text-xs">Design iterations</div>
      </div>
      <div>
        <div class="text-lg font-bold">50/50</div>
        <div class="text-accent-200 text-xs">Payment terms</div>
      </div>
    </div>
  </div>
</div>
