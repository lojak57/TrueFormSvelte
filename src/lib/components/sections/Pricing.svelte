<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { Check } from 'lucide-svelte';
  import { PRICING_DATA } from '$lib/data/content';
</script>

<!-- Pricing Section -->
<section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Simple, Transparent Pricing
      </h2>
      <p class="text-xl text-gray-600">
        From free demos to full custom solutions - we've got you covered
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {#each PRICING_DATA as tier}
        <Card class="p-8 text-center hover:shadow-xl transition-all duration-300 relative {tier.isPopular ? 'border-2 border-accent-500 transform scale-105' : ''}">
          {#if tier.badge}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-{tier.isPopular ? 'accent' : 'green'}-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {tier.badge}
              </span>
            </div>
          {/if}
          
          <h3 class="text-2xl font-semibold text-gray-900 mb-2 {tier.badge ? 'mt-4' : ''}">{tier.name}</h3>
          <div class="text-5xl font-bold text-{tier.isPopular ? 'accent' : 'green'}-600 mb-{tier.monthlyPrice ? '2' : '4'}">
            {tier.price}
          </div>
          
          {#if tier.monthlyPrice}
            <p class="text-sm text-gray-500 mb-4">{tier.monthlyPrice}</p>
          {/if}
          
          <p class="text-gray-600 mb-8">{tier.description}</p>
          
          <ul class="text-left space-y-3 mb-8">
            {#each tier.features as feature}
              <li class="flex items-start gap-2">
                <Check size={20} class="text-green-500 mt-0.5" />
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
          
          <Button 
            variant={tier.isPopular ? 'accent' : 'outline'} 
            size="lg" 
            class="w-full {tier.isPopular ? 'shadow-lg mb-3' : ''}"
          >
            <a href={tier.buttonHref}>{tier.buttonText}</a>
          </Button>
          
          {#if tier.isPopular}
            <p class="text-xs text-gray-500">Buy now, pay later options available</p>
          {/if}
        </Card>
      {/each}
    </div>
    
    <!-- BNPL Info -->
    <div class="text-center mt-12">
      <p class="text-gray-600 max-w-2xl mx-auto">
        🚀 <strong>Fast Track:</strong> Start your project today with our Buy Now, Pay Later option. 
        No credit check required - spread your investment over 12 months at just $83/month.
      </p>
    </div>
  </div>
</section> 