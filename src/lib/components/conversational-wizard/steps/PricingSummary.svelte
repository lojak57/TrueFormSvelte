<script lang="ts">
  import { fly, fade } from "svelte/transition";

  export let basePrice: number = 999;
  export let selectedAddons: string[] = [];
  export let estimatedTotal: number;

  // Add-ons data for price lookup
  const addons = [
    { id: "crm", title: "CRM Integration", price: 200 },
    { id: "ecommerce", title: "eCommerce (Lite)", price: 200 },
    { id: "booking", title: "Booking / Scheduling", price: 200 },
    { id: "portfolio", title: "Portfolio Builder", price: 150 },
    { id: "blog", title: "Blog Setup", price: 100 },
    { id: "forms", title: "Custom Forms / Intake", price: 100 },
    { id: "portal", title: "Client Portal", price: 300 },
    { id: "service-pages", title: "Service Page Generator", price: 100 },
    { id: "animations", title: "Premium Animation", price: 150 },
    { id: "domain-email", title: "Domain + Email Setup", price: 100 },
    { id: "copywriting", title: "Copywriting Polish", price: 200 },
  ];
</script>

<div class="pricing-summary" in:fly={{ y: 30, duration: 500, delay: 2200 }}>
  <div class="pricing-content" in:fade={{ duration: 400, delay: 2400 }}>
    <div class="pricing-breakdown">
      <div class="pricing-line" in:fly={{ x: -20, duration: 300, delay: 2500 }}>
        <span>Base Package</span>
        <span>${basePrice}</span>
      </div>
      {#each selectedAddons as addonId}
        {@const addon = addons.find((a) => a.id === addonId)}
        {#if addon}
          <div
            class="pricing-line addon-line"
            in:fly={{ x: -20, duration: 300, delay: 2600 }}
          >
            <span>{addon.title}</span>
            <span>+${addon.price}</span>
          </div>
        {/if}
      {/each}
      <div
        class="pricing-total"
        in:fly={{ x: -20, duration: 400, delay: 2700 }}
      >
        <span>Estimated Project Total</span>
        <span>${estimatedTotal.toLocaleString()}</span>
      </div>
    </div>

    <p class="pricing-note" in:fade={{ duration: 400, delay: 2800 }}>
      Nothing is final—you'll review everything with a designer.
    </p>

    <p class="pricing-anchor" in:fade={{ duration: 400, delay: 2900 }}>
      <strong
        >Most clients add CRM Integration and land between $1,200 and $1,500.</strong
      ><br />
      <span class="text-sm text-gray-500">
        Compare to dev firms: $5,000+ • DIY builders: $684/yr + your time • CRM
        monthly: $49
      </span>
    </p>
  </div>
</div>

<style>
  .pricing-summary {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .pricing-breakdown {
    margin-bottom: 1rem;
  }

  .pricing-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .addon-line {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .pricing-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0 0.5rem 0;
    border-top: 2px solid #3b82f6;
    margin-top: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .pricing-note {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
    text-align: center;
  }

  .pricing-anchor {
    text-align: center;
    font-size: 0.875rem;
    color: #111827;
  }
</style>
