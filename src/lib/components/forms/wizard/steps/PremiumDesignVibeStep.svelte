<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { Palette, Award, Zap, Crown, Heart, Briefcase, Leaf, Coffee } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  export let selected: string[] = [];
  
  const vibes = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      description: 'Sophisticated simplicity with purposeful design',
      icon: Award,
      primaryColor: '#0f172a',
      secondaryColor: '#64748b',
      accentColor: '#f97316',
      preview: {
        company: 'Sterling & Associates',
        tagline: 'Precision in every detail',
        buttonText: 'Our Approach'
      }
    },
    {
      id: 'bold-executive',
      name: 'Bold Executive',
      description: 'Commanding presence with confident authority',
      icon: Crown,
      primaryColor: '#7c2d12',
      secondaryColor: '#ea580c',
      accentColor: '#fb923c',
      preview: {
        company: 'Apex Ventures',
        tagline: 'Leading industry transformation',
        buttonText: 'Discover More'
      }
    },
    {
      id: 'refined-luxury',
      name: 'Refined Luxury',
      description: 'Exclusive elegance for discerning clientele',
      icon: Crown,
      primaryColor: '#581c87',
      secondaryColor: '#7c3aed',
      accentColor: '#d97706',
      preview: {
        company: 'Prestige Collection',
        tagline: 'Curated for excellence',
        buttonText: 'Private Access'
      }
    },
    {
      id: 'trusted-professional',
      name: 'Trusted Professional',
      description: 'Established credibility with approachable expertise',
      icon: Briefcase,
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      preview: {
        company: 'Meridian Partners',
        tagline: 'Your success, our commitment',
        buttonText: 'Learn More'
      }
    },
    {
      id: 'innovative-forward',
      name: 'Innovative Forward',
      description: 'Cutting-edge vision with strategic thinking',
      icon: Zap,
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      accentColor: '#f59e0b',
      preview: {
        company: 'Frontier Technologies',
        tagline: 'Shaping tomorrow, today',
        buttonText: 'Explore Solutions'
      }
    },
    {
      id: 'warm-accessible',
      name: 'Warm Accessible',
      description: 'Human-centered design with genuine connection',
      icon: Heart,
      primaryColor: '#be185d',
      secondaryColor: '#ec4899',
      accentColor: '#f59e0b',
      preview: {
        company: 'Community Care',
        tagline: 'Where people come first',
        buttonText: 'Get Started'
      }
    }
  ];
  
  let hoveredVibe: string | null = null;
  
  function toggleVibe(vibeId: string) {
    if (selected.includes(vibeId)) {
      selected = selected.filter(id => id !== vibeId);
    } else {
      if (selected.length < 2) {
        selected = [...selected, vibeId];
      } else {
        selected = [selected[1], vibeId];
      }
    }
  }
  
  function handleContinue() {
    dispatch('complete', { value: selected });
  }
  
  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && selected.length > 0) {
      handleContinue();
    }
  }
  
  $: selectedVibes = vibes.filter(v => selected.includes(v.id));
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="premium-step" in:fade={{ duration: 400 }}>
  <!-- Premium Header -->
  <div class="text-center mb-12">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 shadow-xl">
      <Palette size={32} class="text-white" />
    </div>
    
    <h2 class="text-3xl font-light text-gray-900 mb-4 tracking-wide">
      Design Philosophy
    </h2>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
      Select the aesthetic direction that resonates with your brand vision. Choose up to two for a distinctive blend.
    </p>
  </div>

  <!-- Premium Vibe Grid -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
    {#each vibes as vibe, i}
      <div
        class="vibe-option relative"
        in:scale={{ duration: 400, delay: i * 100 }}
      >
        <button
          class="w-full text-left group focus:outline-none"
          on:click={() => toggleVibe(vibe.id)}
          on:mouseenter={() => hoveredVibe = vibe.id}
          on:mouseleave={() => hoveredVibe = null}
        >
          <!-- Selection State with Orange Fill Effect -->
          <div class="relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl overflow-hidden
                      {selected.includes(vibe.id) 
                        ? 'border-orange-400 shadow-orange-100 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'}">
            
            <!-- Orange Fill Effect -->
            {#if selected.includes(vibe.id)}
              <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-60"></div>
            {/if}
            
            <!-- Selection Indicator -->
            {#if selected.includes(vibe.id)}
              <div class="absolute -top-3 -right-3 z-20">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-white font-semibold text-sm">{selected.indexOf(vibe.id) + 1}</span>
                </div>
              </div>
            {/if}

            <!-- Website Preview Card -->
            <div class="relative z-10 p-6">
              <!-- Mini Browser Window -->
              <div class="website-preview bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-6">
                <!-- Browser Chrome -->
                <div class="bg-gray-200 px-3 py-2 flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <div class="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <div class="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                    <div class="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  </div>
                  <div class="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-500 font-mono">
                    company.com
                  </div>
                </div>
                
                <!-- Website Content -->
                <div class="p-4 {vibe.id === 'modern-minimal' ? 'bg-slate-50' : 
                            vibe.id === 'bold-executive' ? 'bg-orange-50' : 
                            vibe.id === 'refined-luxury' ? 'bg-purple-50' : 
                            vibe.id === 'trusted-professional' ? 'bg-blue-50' : 
                            vibe.id === 'innovative-forward' ? 'bg-green-50' : 
                            vibe.id === 'warm-accessible' ? 'bg-pink-50' : 'bg-gray-50'}">
                  <!-- Header -->
                  <div class="flex justify-between items-center mb-4">
                    <div class="font-semibold text-sm {vibe.id === 'modern-minimal' ? 'text-slate-800' : 
                                                         vibe.id === 'bold-executive' ? 'text-orange-800' : 
                                                         vibe.id === 'refined-luxury' ? 'text-purple-800' : 
                                                         vibe.id === 'trusted-professional' ? 'text-blue-800' : 
                                                         vibe.id === 'innovative-forward' ? 'text-green-800' : 
                                                         vibe.id === 'warm-accessible' ? 'text-pink-800' : 'text-gray-800'}">
                      {vibe.preview.company}
                    </div>
                    <div class="text-xs text-gray-500">Menu</div>
                  </div>
                  
                  <!-- Hero Section -->
                  <div class="text-center py-4">
                    <h3 class="font-semibold text-sm mb-2 {vibe.id === 'modern-minimal' ? 'text-slate-800' : 
                                                            vibe.id === 'bold-executive' ? 'text-orange-800' : 
                                                            vibe.id === 'refined-luxury' ? 'text-purple-800' : 
                                                            vibe.id === 'trusted-professional' ? 'text-blue-800' : 
                                                            vibe.id === 'innovative-forward' ? 'text-green-800' : 
                                                            vibe.id === 'warm-accessible' ? 'text-pink-800' : 'text-gray-800'}">
                      {vibe.preview.tagline}
                    </h3>
                    <div class="inline-block px-3 py-1.5 rounded text-xs font-medium text-white
                              {vibe.id === 'modern-minimal' ? 'bg-orange-500' : 
                               vibe.id === 'bold-executive' ? 'bg-orange-600' : 
                               vibe.id === 'refined-luxury' ? 'bg-amber-600' : 
                               vibe.id === 'trusted-professional' ? 'bg-amber-500' : 
                               vibe.id === 'innovative-forward' ? 'bg-amber-500' : 
                               vibe.id === 'warm-accessible' ? 'bg-amber-500' : 'bg-orange-500'}">
                      {vibe.preview.buttonText}
                    </div>
                  </div>
                  
                  <!-- Content Blocks -->
                  <div class="grid grid-cols-3 gap-2 mt-4">
                    {#each Array(3) as _}
                      <div class="bg-white p-2 rounded">
                        <div class="w-full h-2 rounded mb-1 {vibe.id === 'modern-minimal' ? 'bg-slate-200' : 
                                                               vibe.id === 'bold-executive' ? 'bg-orange-200' : 
                                                               vibe.id === 'refined-luxury' ? 'bg-purple-200' : 
                                                               vibe.id === 'trusted-professional' ? 'bg-blue-200' : 
                                                               vibe.id === 'innovative-forward' ? 'bg-green-200' : 
                                                               vibe.id === 'warm-accessible' ? 'bg-pink-200' : 'bg-gray-200'}"></div>
                        <div class="w-2/3 h-1 bg-gray-200 rounded"></div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>

              <!-- Vibe Information -->
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300
                           {selected.includes(vibe.id) 
                             ? 'bg-orange-100' 
                             : vibe.id === 'modern-minimal' ? 'bg-slate-50' : 
                               vibe.id === 'bold-executive' ? 'bg-orange-50' : 
                               vibe.id === 'refined-luxury' ? 'bg-purple-50' : 
                               vibe.id === 'trusted-professional' ? 'bg-blue-50' : 
                               vibe.id === 'innovative-forward' ? 'bg-green-50' : 
                               vibe.id === 'warm-accessible' ? 'bg-pink-50' : 'bg-gray-50'}">
                  <svelte:component this={vibe.icon} size={20} 
                    class="{selected.includes(vibe.id) 
                             ? 'text-orange-600' 
                             : vibe.id === 'modern-minimal' ? 'text-slate-600' : 
                               vibe.id === 'bold-executive' ? 'text-orange-600' : 
                               vibe.id === 'refined-luxury' ? 'text-purple-600' : 
                               vibe.id === 'trusted-professional' ? 'text-blue-600' : 
                               vibe.id === 'innovative-forward' ? 'text-green-600' : 
                               vibe.id === 'warm-accessible' ? 'text-pink-600' : 'text-gray-600'}" />
                </div>
                
                <div class="flex-1">
                  <h3 class="text-xl font-medium text-gray-900 mb-2">
                    {vibe.name}
                  </h3>
                  <p class="text-sm text-gray-600 leading-relaxed font-light">
                    {vibe.description}
                  </p>
                </div>
              </div>
            </div>

            <!-- Hover Effect -->
            {#if hoveredVibe === vibe.id && !selected.includes(vibe.id)}
              <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl opacity-50 pointer-events-none"
                   in:fade={{ duration: 200 }}></div>
            {/if}
          </div>
        </button>
      </div>
    {/each}
  </div>

  <!-- Selected Preview -->
  {#if selected.length > 0}
    <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 max-w-4xl mx-auto border border-orange-200 mb-8"
         in:fade={{ duration: 400 }}>
      <h3 class="text-xl font-medium text-gray-900 mb-6 text-center">
        Your Selected Aesthetic
      </h3>
      
      <div class="flex flex-wrap gap-4 justify-center mb-6">
        {#each selectedVibes as vibe, i}
          <div class="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-sm border border-orange-200">
            <div class="w-3 h-3 rounded-full" style="background-color: {vibe.accentColor}"></div>
            <span class="font-medium text-gray-800">{vibe.name}</span>
            {#if selected.length > 1}
              <span class="text-sm text-gray-500">Primary</span>
            {/if}
          </div>
        {/each}
      </div>
      
      <div class="text-center">
        {#if selected.length > 1}
          <p class="text-gray-600 font-light">
            This sophisticated combination balances 
            <strong>{selectedVibes[0]?.name.toLowerCase()}</strong> with 
            <strong>{selectedVibes[1]?.name.toLowerCase()}</strong> elements.
          </p>
        {:else}
          <p class="text-gray-600 font-light">
            A refined <strong>{selectedVibes[0]?.name.toLowerCase()}</strong> approach 
            will define your brand's visual identity.
          </p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Continue Button -->
  <div class="text-center">
    {#if selected.length > 0}
      <button
        on:click={handleContinue}
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium rounded-xl 
               hover:from-orange-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
               focus:outline-none focus:ring-4 focus:ring-orange-200"
      >
        <Award size={20} />
        Proceed with Selection
      </button>
      
      <p class="text-sm text-gray-500 mt-4 font-light">
        Press Enter to continue
      </p>
    {:else}
      <div class="space-y-3">
        <p class="text-gray-600 font-light">Please select at least one aesthetic direction</p>
        <p class="text-sm text-gray-500">Your selection will guide all subsequent design decisions</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .premium-step {
    @apply max-w-7xl mx-auto px-6 py-8;
  }
  
  .vibe-option:hover .website-preview {
    @apply shadow-lg;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  .website-preview {
    transition: all 0.3s ease;
  }
</style>