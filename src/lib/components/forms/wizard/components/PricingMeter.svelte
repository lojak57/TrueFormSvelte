<script lang="ts">
  import { derived } from 'svelte/store';
  import { wizardStore } from '../stores/wizardStore';
  import { fade, slide } from 'svelte/transition';
  import { ShoppingCart, Sparkles } from 'lucide-svelte';
  
  // Pricing configuration - updated to match FeaturesStep prices
  const PRICING_MODEL = {
    base: 999,
    includedFeatures: 6,
    addOnCosts: {
      'blog': 100,           // Blog/News
      'chat': 50,            // Live Chat  
      'members': 250,        // Customer Portal
      'newsletter': 200,     // Email Newsletter
      'multilang': 200,      // Multi-language Support
      'mobile': 500,         // Custom Application (will be enterprise)
      'rushDelivery': 150,   // Rush delivery for timeline
      'brandGuide': 300,
      'advancedAnalytics': 150,
      'emailMarketing': 200,
      'membershipSystem': 350,
      'advancedSEO': 150
    }
  };
  
  // Enterprise features that trigger custom quote
  const ENTERPRISE_FEATURES = [
    'mobile', // Custom Application - this should trigger enterprise immediately
    'multiUser', 
    'advancedAnalytics',
    'apiIntegration',
    'customIntegrations',
    'enterpriseSecurity',
    'whiteLabelSolution'
  ];
  
  // Feature mapping to add-on keys (using actual IDs from FeaturesStep)
  const FEATURE_TO_ADDON: Record<string, string> = {
    'members': 'members',
    'multilang': 'multilang', 
    'blog': 'blog',
    'chat': 'chat',
    'mobile': 'mobile', // This will be enterprise
    'newsletter': 'newsletter'
  };
  
  // Feature ID to display name mapping (using actual IDs from FeaturesStep)
  const FEATURE_DISPLAY_NAMES: Record<string, string> = {
    'mobile': 'Custom Application',
    'members': 'Customer Portal',
    'multilang': 'Multi-language Support',
    'blog': 'Blog/News',
    'chat': 'Live Chat',
    'newsletter': 'Email Newsletter',
    'analytics': 'Analytics Dashboard',
    'booking': 'Appointment Booking',
    'payment': 'Payment Processing',
    'contact': 'Contact Forms',
    'gallery': 'Photo Gallery',
    'seo': 'SEO Optimization',
    'social': 'Social Media Integration',
    'search': 'Search Functionality'
  };
  
  // Calculate current price based on selections
  const currentPrice = derived(wizardStore, $store => {
    const features = $store.answers.coreFeatures || [];
    const timeline = $store.answers.timeline || '';
    
    // Check for enterprise features
    const hasEnterpriseFeatures = features.some((feature: string) => 
      ENTERPRISE_FEATURES.includes(feature)
    );
    
    if (hasEnterpriseFeatures) {
      return { 
        isEnterprise: true, 
        total: 0, 
        addOns: [], 
        featureCount: features.length,
        enterpriseFeatures: features.filter((f: string) => ENTERPRISE_FEATURES.includes(f))
      };
    }
    
    let total = PRICING_MODEL.base;
    let addOns: string[] = [];
    
    // Count base features (first 6 are included)
    const baseFeatures = features.filter(f => !PRICING_MODEL.addOnCosts[f]);
    const premiumFeatures = features.filter(f => PRICING_MODEL.addOnCosts[f]);
    
    // Add premium feature costs
    premiumFeatures.forEach((feature: string) => {
      if (PRICING_MODEL.addOnCosts[feature]) {
        total += PRICING_MODEL.addOnCosts[feature];
        addOns.push(feature);
      }
    });
    
    // Check for rush delivery
    if (timeline === 'asap') {
      total += PRICING_MODEL.addOnCosts.rushDelivery;
      addOns.push('rushDelivery');
    }
    
    return { 
      isEnterprise: false, 
      total, 
      addOns, 
      featureCount: features.length 
    };
  });
  
  // Show meter starting from features step (step 9) and when features are selected
  $: showMeter = $wizardStore.currentStepIndex >= 9 && 
                 ($wizardStore.answers.coreFeatures?.length > 0);
  
  // Monthly payment calculation
  $: monthlyPayment = Math.ceil($currentPrice.total / 12);
  
  // Enterprise feature display names
  $: enterpriseFeatureNames = ($currentPrice.enterpriseFeatures as string[])?.map(feature => FEATURE_DISPLAY_NAMES[feature] || feature).join(', ') || '';
</script>

{#if showMeter}
  <div 
    class="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg z-40"
    in:slide={{ duration: 300 }}
    out:slide={{ duration: 200 }}
  >
    <div class="max-w-4xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left side: Price display -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-accent-100 rounded-lg">
              <ShoppingCart size={20} class="text-accent-600" />
            </div>
            <div>
              <div class="text-sm text-gray-400 mb-1">Solution Price</div>
              {#if $currentPrice.isEnterprise}
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-white">
                    Custom Quote
                  </span>
                  <span class="text-sm text-gray-400">
                    Enterprise pricing
                  </span>
                </div>
                <p class="text-xs text-gray-400">
                  We'll provide a tailored proposal
                </p>
              {:else}
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-white">
                    ${$currentPrice.total}
                  </span>
                  <span class="text-sm text-gray-400">
                    or ${monthlyPayment}/mo
                  </span>
                </div>
                <p class="text-xs text-gray-400">
                  Only pay once site is approved
                </p>
              {/if}
            </div>
          </div>
          
          <!-- Feature count indicator -->
          {#if $currentPrice.featureCount > 0}
            <div class="hidden sm:block">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-300">
                  {$currentPrice.featureCount} feature{$currentPrice.featureCount !== 1 ? 's' : ''} selected
                </span>
                {#if !$currentPrice.isEnterprise && $currentPrice.featureCount > PRICING_MODEL.includedFeatures}
                  <span class="text-accent-400 font-medium">
                    (+{$currentPrice.featureCount - PRICING_MODEL.includedFeatures} premium)
                  </span>
                {/if}
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Right side: Add-ons or Enterprise indicator -->
        {#if $currentPrice.isEnterprise}
          <div class="flex items-center gap-2" in:fade={{ duration: 200 }}>
            <Sparkles size={16} class="text-purple-400" />
            <span class="text-sm text-purple-400 font-medium">
              Enterprise Features
            </span>
          </div>
        {:else if $currentPrice.addOns.length > 0}
          <div class="flex items-center gap-2" in:fade={{ duration: 200 }}>
            <Sparkles size={16} class="text-accent-400" />
            <span class="text-sm text-gray-300">
              {$currentPrice.addOns.length} add-on{$currentPrice.addOns.length !== 1 ? 's' : ''}
            </span>
          </div>
        {/if}
      </div>
      
      <!-- Mobile feature count -->
      {#if $currentPrice.featureCount > 0}
        <div class="sm:hidden mt-2 text-xs text-gray-300">
          {$currentPrice.featureCount} feature{$currentPrice.featureCount !== 1 ? 's' : ''} selected
          {#if !$currentPrice.isEnterprise && $currentPrice.featureCount > PRICING_MODEL.includedFeatures}
            <span class="text-accent-400 font-medium">
              (+{$currentPrice.featureCount - PRICING_MODEL.includedFeatures} premium)
            </span>
          {/if}
        </div>
      {/if}
      
      <!-- Enterprise features list -->
      {#if $currentPrice.isEnterprise && $currentPrice.enterpriseFeatures}
        <div class="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
          <p class="text-sm text-purple-300 font-medium mb-1">Enterprise Features Selected:</p>
          <p class="text-xs text-purple-200">
            {enterpriseFeatureNames}
          </p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Add padding to the wizard modal when meter is shown */
  :global(.wizard-modal-content.meter-active) {
    padding-bottom: 100px;
  }
</style> 