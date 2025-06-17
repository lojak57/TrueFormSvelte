<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { Settings, Globe, Rocket, Target, TrendingDown, AlertCircle, Clock, Sparkles } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let selected = '';

  const situationOptions = [
    {
      id: 'outdated_website',
      title: 'Current website needs modernization',
      description: 'Outdated design, poor mobile experience, or missing features',
      icon: Settings,
      priority: 'High Priority',
      urgency: 'immediate',
      preview: {
        before: 'Old, slow, confusing',
        after: 'Modern, fast, intuitive'
      },
      color: 'orange'
    },
    {
      id: 'no_website',
      title: 'No web presence established',
      description: 'Ready to establish professional online presence',
      icon: Globe,
      priority: 'High Priority',
      urgency: 'immediate',
      preview: {
        before: 'Invisible to online customers',
        after: 'Professional digital presence'
      },
      color: 'blue'
    },
    {
      id: 'new_launch',
      title: 'Launching new initiative',
      description: 'New product, service, or business expansion',
      icon: Rocket,
      priority: 'Medium Priority',
      urgency: 'planned',
      preview: {
        before: 'Exciting plans, no platform',
        after: 'Launch-ready digital platform'
      },
      color: 'green'
    },
    {
      id: 'competitor_pressure',
      title: 'Competitive disadvantage',
      description: 'Competitors have superior online presence',
      icon: Target,
      priority: 'High Priority',
      urgency: 'immediate',
      preview: {
        before: 'Falling behind competition',
        after: 'Industry-leading presence'
      },
      color: 'red'
    },
    {
      id: 'losing_business',
      title: 'Revenue opportunities at risk',
      description: 'Poor online experience affecting conversions',
      icon: TrendingDown,
      priority: 'Critical Priority',
      urgency: 'urgent',
      preview: {
        before: 'Lost sales, missed leads',
        after: 'Optimized conversion engine'
      },
      color: 'red'
    },
    {
      id: 'modernize',
      title: 'Ready to modernize entirely',
      description: 'Complete digital transformation initiative',
      icon: Sparkles,
      priority: 'Medium Priority',
      urgency: 'planned',
      preview: {
        before: 'Legacy systems, manual processes',
        after: 'Modern digital infrastructure'
      },
      color: 'purple'
    }
  ];

  function selectSituation(situationId: string) {
    selected = situationId;
  }

  function handleContinue() {
    dispatch('complete', { value: selected });
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && selected) {
      handleContinue();
    }
  }

  $: selectedOption = situationOptions.find(option => option.id === selected);
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="premium-step" in:fade={{ duration: 400 }}>
  <!-- Premium Header -->
  <div class="text-center mb-12">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 shadow-xl">
      <AlertCircle size={32} class="text-white" />
    </div>
    
    <h2 class="text-3xl font-light text-gray-900 mb-4 tracking-wide">
      Current Situation
    </h2>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
      Understanding your current challenge helps us design the perfect solution for your specific needs.
    </p>
  </div>

  <!-- Situation Grid -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
    {#each situationOptions as option, i}
      <div
        class="situation-option relative"
        in:scale={{ duration: 400, delay: i * 100 }}
      >
        <button
          class="w-full text-left group focus:outline-none"
          on:click={() => selectSituation(option.id)}
        >
          <!-- Selection State with Orange Fill Effect -->
          <div class="relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl overflow-hidden
                      {selected === option.id 
                        ? 'border-orange-400 shadow-orange-100 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'}">
            
            <!-- Orange Fill Effect -->
            {#if selected === option.id}
              <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-60"></div>
            {/if}
            
            <!-- Selection Indicator -->
            {#if selected === option.id}
              <div class="absolute -top-3 -right-3 z-20">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-white font-semibold text-sm">✓</span>
                </div>
              </div>
            {/if}

            <!-- Content -->
            <div class="relative z-10 p-6">
              <!-- Header with Icon and Priority -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300
                           {selected === option.id 
                             ? 'bg-orange-100' 
                             : option.color === 'orange' ? 'bg-orange-50' : 
                               option.color === 'blue' ? 'bg-blue-50' : 
                               option.color === 'green' ? 'bg-green-50' : 
                               option.color === 'red' ? 'bg-red-50' : 
                               option.color === 'purple' ? 'bg-purple-50' : 'bg-gray-50'}">
                  <svelte:component this={option.icon} size={20} 
                    class="{selected === option.id 
                             ? 'text-orange-600' 
                             : option.color === 'orange' ? 'text-orange-600' : 
                               option.color === 'blue' ? 'text-blue-600' : 
                               option.color === 'green' ? 'text-green-600' : 
                               option.color === 'red' ? 'text-red-600' : 
                               option.color === 'purple' ? 'text-purple-600' : 'text-gray-600'}" />
                </div>
                
                <div class="text-right">
                  <span class="inline-block px-2 py-1 text-xs font-medium rounded-lg
                              {option.priority === 'Critical Priority' ? 'bg-red-100 text-red-700' : 
                               option.priority === 'High Priority' ? 'bg-orange-100 text-orange-700' : 
                               'bg-blue-100 text-blue-700'}">
                    {option.priority}
                  </span>
                </div>
              </div>
              
              <!-- Title and Description -->
              <div class="mb-4">
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p class="text-sm text-gray-600 leading-relaxed font-light">
                  {option.description}
                </p>
              </div>
              
              <!-- Before/After Preview -->
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div class="text-gray-500 font-medium mb-1">Current State</div>
                    <div class="text-gray-700">{option.preview.before}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 font-medium mb-1">Future State</div>
                    <div class="text-green-700 font-medium">{option.preview.after}</div>
                  </div>
                </div>
                
                <!-- Progress Arrow -->
                <div class="flex items-center justify-center mt-2">
                  <div class="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-green-500 rounded-full"></div>
                  <div class="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    {/each}
  </div>

  <!-- Selected Preview -->
  {#if selectedOption}
    <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 max-w-4xl mx-auto border border-orange-200 mb-8"
         in:fade={{ duration: 400 }}>
      <h3 class="text-xl font-medium text-gray-900 mb-4 text-center">
        Your Current Challenge
      </h3>
      
      <div class="flex items-center gap-4 justify-center mb-6">
        <div class="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-sm border border-orange-200">
          <svelte:component this={selectedOption.icon} size={20} class="text-orange-600" />
          <span class="font-medium text-gray-800">{selectedOption.title}</span>
          <span class="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded-lg font-medium">
            {selectedOption.priority}
          </span>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-gray-600 font-light leading-relaxed">
          We'll address this challenge with a tailored solution that transforms 
          <strong>{selectedOption.preview.before.toLowerCase()}</strong> into 
          <strong>{selectedOption.preview.after.toLowerCase()}</strong>.
        </p>
      </div>
    </div>
  {/if}

  <!-- Continue Button -->
  <div class="text-center">
    {#if selected}
      <button
        on:click={handleContinue}
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium rounded-xl 
               hover:from-orange-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
               focus:outline-none focus:ring-4 focus:ring-orange-200"
      >
        <AlertCircle size={20} />
        Continue with This Challenge
      </button>
      
      <p class="text-sm text-gray-500 mt-4 font-light">
        Press Enter to continue
      </p>
    {:else}
      <div class="space-y-3">
        <p class="text-gray-600 font-light">Please select your current situation</p>
        <p class="text-sm text-gray-500">This helps us understand your specific needs</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .premium-step {
    @apply max-w-7xl mx-auto px-6 py-8;
  }
  
  .situation-option:hover .relative {
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
</style>