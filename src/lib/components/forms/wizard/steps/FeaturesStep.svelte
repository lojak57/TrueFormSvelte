<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Sparkles, Check, ArrowRight } from 'lucide-svelte';
  import { scale, fade } from 'svelte/transition';
  import { wizardStore } from '../stores/wizardStore';
  
  export let selected: string[] = [];
  export let websiteType: string = '';
  
  const dispatch = createEventDispatcher();
  
  // Define which features are base vs premium
  const FEATURE_TIERS = {
    base: {
      contact: { name: 'Contact Forms', icon: '📧', description: 'Let visitors reach you', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop&crop=center' },
      gallery: { name: 'Photo Gallery', icon: '🖼️', description: 'Showcase images', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center' },
      seo: { name: 'SEO & Search', icon: '🔍', description: 'Get found & searched easily', image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop&crop=center' },
      analytics: { name: 'Analytics Dashboard', icon: '📊', description: 'Track visitors & performance', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center' },
      social: { name: 'Social Media Integration', icon: '🔗', description: 'Connect all accounts', image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop&crop=center' },
      mobile: { name: 'Mobile Optimization', icon: '📱', description: 'Perfect on all devices', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&crop=center' },
      booking: { name: 'Appointment Booking', icon: '📅', description: 'Schedule appointments', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center' },
      payment: { name: 'Payment Processing', icon: '💳', description: 'Accept payments securely', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&crop=center' },
      testimonials: { name: 'Customer Testimonials', icon: '⭐', description: 'Show reviews & ratings', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&crop=center' },
      maps: { name: 'Interactive Maps', icon: '🗺️', description: 'Location & directions', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop&crop=center' },
      forms: { name: 'Custom Forms', icon: '📝', description: 'Surveys & applications', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&crop=center' },
      calendar: { name: 'Event Calendar', icon: '📆', description: 'Display events & dates', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center' }
    },
    premium: {
      blog: { name: 'Blog/News', icon: '📰', description: 'Share updates', price: 100, image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&crop=center' },
      chat: { name: 'Live Chat', icon: '💬', description: 'Real-time support', price: 50, image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop&crop=center' },
      members: { name: 'Customer Portal', icon: '🔐', description: 'Private member areas', price: 250, image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=center' },
      newsletter: { name: 'Email Newsletter', icon: '📮', description: 'Email subscribers', price: 200, image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&crop=center' },
      multilang: { name: 'Multi-language Support', icon: '🌐', description: 'Multiple languages', price: 200, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=center' },
      mobile: { name: 'Custom Application', icon: '📱', description: 'Advanced functionality', price: 500, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&crop=center' }
    }
  };
  
  // Count selected features by tier
  $: baseFeatureCount = selected.filter(id => id in FEATURE_TIERS.base).length;
  $: premiumFeatureCount = selected.filter(id => id in FEATURE_TIERS.premium).length;
  $: remainingBase = Math.max(0, 6 - baseFeatureCount);
  
  let animatingFeature = '';
  
  function toggleFeature(featureId: string) {
    if (selected.includes(featureId)) {
      // Deselecting
      selected = selected.filter(id => id !== featureId);
    } else {
      // Selecting
      selected = [...selected, featureId];
      animatingFeature = featureId;
      setTimeout(() => {
        animatingFeature = '';
      }, 600);
    }
    
    // Save to wizard store immediately for real-time pricing
    wizardStore.saveAnswer('coreFeatures', selected);
  }
  
  function isIncludedWithPlan(feature: any): boolean {
    return feature.includedWith?.includes(websiteType) || false;
  }
  
  function handleContinue() {
    dispatch('complete', { value: selected });
  }
</script>

<div class="space-y-6">
  <!-- Feature allowance indicator -->
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold text-gray-900">Your Feature Allowance</h3>
      <div class="flex items-center gap-2">
        <Check size={16} class="text-green-600" />
        <span class="text-sm font-medium text-gray-700">
          {baseFeatureCount}/6 base features used
        </span>
      </div>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div 
        class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
        style="width: {Math.min(100, (baseFeatureCount / 6) * 100)}%"
      />
    </div>
    {#if remainingBase > 0}
      <p class="text-sm text-gray-600 mt-2">
        Choose {remainingBase} more feature{remainingBase !== 1 ? 's' : ''} at no extra cost
      </p>
    {:else if premiumFeatureCount > 0}
      <p class="text-sm text-accent-600 font-medium mt-2">
        <Sparkles size={14} class="inline" />
        {premiumFeatureCount} premium feature{premiumFeatureCount !== 1 ? 's' : ''} selected
      </p>
    {/if}
  </div>

  <!-- Base Features Section -->
  <div>
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Standard Features</h3>
      <span class="text-sm text-gray-500">(Choose up to 6)</span>
    </div>
    <div class="grid grid-cols-2 gap-4">
      {#each Object.entries(FEATURE_TIERS.base) as [id, feature]}
        <button
          on:click={() => toggleFeature(id)}
          class="relative p-0 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] overflow-hidden
            {selected.includes(id) 
              ? 'border-accent-600 ring-2 ring-accent-200 shadow-lg scale-[1.05] shadow-accent-200/50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'}"
        >
          <!-- Fill-up animation background -->
          {#if animatingFeature === id || selected.includes(id)}
            <div 
              class="absolute inset-0 bg-orange-600"
              in:scale={{ duration: 500, start: 0, easing: (t) => t * t * (3 - 2 * t) }}
              out:scale={{ duration: 200, start: 1 }}
              style="transform-origin: center center;"
            />
          {/if}
          
          {#if selected.includes(id)}
            <div 
              class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl z-20 ring-2 ring-white/50"
              in:scale={{ duration: 400, delay: 300, start: 0 }}
              out:scale={{ duration: 200, start: 0.5 }}
            >
              <Check size={18} class="text-orange-600 font-bold" />
            </div>
          {/if}
          
          <!-- Image with overlay -->
          <div class="relative h-32 overflow-hidden rounded-t-xl">
            <img 
              src={feature.image} 
              alt={feature.name}
              class="w-full h-full object-cover {selected.includes(id) ? 'brightness-110' : ''}"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-2 left-2 right-2">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg filter drop-shadow-sm">{feature.icon}</span>
                <h3 class="font-bold text-white drop-shadow-sm text-sm">
                  {feature.name}
                </h3>
              </div>
              <p class="text-xs text-white/90 drop-shadow-sm">
                {feature.description}
              </p>
            </div>
          </div>
          <div class="p-4"></div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Premium Features Section -->
  <div>
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Premium Add-ons</h3>
      <Sparkles size={20} class="text-accent-500" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      {#each Object.entries(FEATURE_TIERS.premium) as [id, feature]}
        <button
          on:click={() => toggleFeature(id)}
          class="relative p-0 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] overflow-hidden
            {selected.includes(id) 
              ? 'border-accent-600 ring-2 ring-accent-200 shadow-lg scale-[1.05] shadow-accent-200/50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'}"
        >
          <!-- Price badge -->
          {#if isIncludedWithPlan(feature)}
            <span class="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full z-10">
              ✅ Included
            </span>
          {:else}
            <span class="absolute top-2 right-2 px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full z-10 font-semibold">
              +${feature.price}
            </span>
          {/if}
          
          <!-- Fill-up animation background -->
          {#if animatingFeature === id || selected.includes(id)}
            <div 
              class="absolute inset-0 bg-orange-600"
              in:scale={{ duration: 500, start: 0, easing: (t) => t * t * (3 - 2 * t) }}
              out:scale={{ duration: 200, start: 1 }}
              style="transform-origin: center center;"
            />
          {/if}
          
          {#if selected.includes(id)}
            <div 
              class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl z-20 ring-2 ring-white/50"
              in:scale={{ duration: 400, delay: 300, start: 0 }}
              out:scale={{ duration: 200, start: 0.5 }}
            >
              <Check size={18} class="text-orange-600 font-bold" />
            </div>
          {/if}
          
          <!-- Image with overlay -->
          <div class="relative h-32 overflow-hidden rounded-t-xl">
            <img 
              src={feature.image} 
              alt={feature.name}
              class="w-full h-full object-cover {selected.includes(id) ? 'brightness-110' : ''}"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-2 left-2 right-2">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg filter drop-shadow-sm">{feature.icon}</span>
                <h3 class="font-bold text-white drop-shadow-sm text-sm">
                  {feature.name}
                </h3>
              </div>
              <p class="text-xs text-white/90 drop-shadow-sm">
                {feature.description}
              </p>
            </div>
          </div>
          <div class="p-4"></div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Continue Button -->
  <div class="flex justify-end">
    <button
      on:click={handleContinue}
      disabled={selected.length === 0}
      class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
    >
      Continue
      <ArrowRight size={20} />
    </button>
  </div>

  <div class="text-center text-sm text-gray-500 pt-4 border-t">
    <p>Don't worry - you can always add or remove features later from your dashboard!</p>
  </div>
</div> 