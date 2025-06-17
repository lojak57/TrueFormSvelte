<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale, fly } from 'svelte/transition';
  import { Users, Target, Building, Lightbulb, Globe, Briefcase, Heart, Zap, Crown, Coffee, Leaf, Shield } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  export let selected: any = {
    industry: '',
    audience: '',
    personality: []
  };
  
  const industries = [
    { 
      id: 'technology', 
      name: 'Technology & Software', 
      icon: Zap, 
      color: 'blue',
      example: 'TechFlow Solutions',
      tagline: 'Innovation at the speed of thought'
    },
    { 
      id: 'healthcare', 
      name: 'Healthcare & Medical', 
      icon: Heart, 
      color: 'red',
      example: 'MedCare Partners',
      tagline: 'Your health, our priority'
    },
    { 
      id: 'finance', 
      name: 'Finance & Banking', 
      icon: Shield, 
      color: 'green',
      example: 'SecureWealth Advisors',
      tagline: 'Building financial futures'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce & Retail', 
      icon: Building, 
      color: 'purple',
      example: 'StyleHub',
      tagline: 'Discover your perfect style'
    },
    { 
      id: 'professional', 
      name: 'Professional Services', 
      icon: Briefcase, 
      color: 'gray',
      example: 'Elite Consulting',
      tagline: 'Excellence in every solution'
    },
    { 
      id: 'creative', 
      name: 'Creative & Design', 
      icon: Lightbulb, 
      color: 'pink',
      example: 'Canvas Studio',
      tagline: 'Where creativity comes alive'
    },
    { 
      id: 'food', 
      name: 'Food & Hospitality', 
      icon: Coffee, 
      color: 'orange',
      example: 'Harvest Kitchen',
      tagline: 'Fresh flavors, warm memories'
    },
    { 
      id: 'wellness', 
      name: 'Wellness & Lifestyle', 
      icon: Leaf, 
      color: 'emerald',
      example: 'ZenLife Wellness',
      tagline: 'Balance for body and mind'
    },
    { 
      id: 'education', 
      name: 'Education & Training', 
      icon: Globe, 
      color: 'indigo',
      example: 'LearnSphere Academy',
      tagline: 'Unlock your potential'
    },
    { 
      id: 'other', 
      name: 'Other Industry', 
      icon: Target, 
      color: 'slate',
      example: 'Your Business',
      tagline: 'Your unique story'
    }
  ];
  
  const audiences = [
    { id: 'consumers', name: 'Everyday Consumers', description: 'Regular people looking for products/services', emoji: '👥' },
    { id: 'professionals', name: 'Business Professionals', description: 'Working professionals and decision makers', emoji: '💼' },
    { id: 'enterprises', name: 'Enterprise Companies', description: 'Large corporations and organizations', emoji: '🏢' },
    { id: 'small-business', name: 'Small Businesses', description: 'Local businesses and entrepreneurs', emoji: '🏪' },
    { id: 'creatives', name: 'Creatives & Artists', description: 'Designers, artists, and creative professionals', emoji: '🎨' },
    { id: 'tech-savvy', name: 'Tech Enthusiasts', description: 'Early adopters and tech-forward users', emoji: '💻' },
    { id: 'luxury', name: 'Luxury Market', description: 'High-end, premium market segment', emoji: '💎' },
    { id: 'youth', name: 'Young Adults', description: 'Millennials and Gen Z audience', emoji: '🌟' }
  ];
  
  const personalities = [
    { id: 'innovative', name: 'Innovative', description: 'Cutting-edge and forward-thinking', emoji: '🚀' },
    { id: 'trustworthy', name: 'Trustworthy', description: 'Reliable and dependable', emoji: '🛡️' },
    { id: 'friendly', name: 'Friendly', description: 'Approachable and welcoming', emoji: '😊' },
    { id: 'professional', name: 'Professional', description: 'Serious and business-focused', emoji: '💼' },
    { id: 'creative', name: 'Creative', description: 'Artistic and imaginative', emoji: '🎨' },
    { id: 'premium', name: 'Premium', description: 'High-end and exclusive', emoji: '👑' },
    { id: 'fun', name: 'Fun', description: 'Playful and entertaining', emoji: '🎉' },
    { id: 'authentic', name: 'Authentic', description: 'Genuine and transparent', emoji: '💯' }
  ];
  
  let currentStep = 'industry';
  
  function selectIndustry(industryId: string) {
    selected.industry = industryId;
    setTimeout(() => currentStep = 'audience', 300);
  }
  
  function selectAudience(audienceId: string) {
    selected.audience = audienceId;
    setTimeout(() => currentStep = 'personality', 300);
  }
  
  function togglePersonality(personalityId: string) {
    if (selected.personality.includes(personalityId)) {
      selected.personality = selected.personality.filter(id => id !== personalityId);
    } else if (selected.personality.length < 3) {
      selected.personality = [...selected.personality, personalityId];
    }
  }
  
  function goBack() {
    if (currentStep === 'personality') currentStep = 'audience';
    else if (currentStep === 'audience') currentStep = 'industry';
  }
  
  function handleContinue() {
    dispatch('complete', { value: selected });
  }
  
  $: selectedIndustry = industries.find(i => i.id === selected.industry);
  $: selectedAudience = audiences.find(a => a.id === selected.audience);
  $: selectedPersonalities = personalities.filter(p => selected.personality.includes(p.id));
  $: canContinue = selected.industry && selected.audience && selected.personality.length > 0;
</script>

<div class="space-y-8" in:fade={{ duration: 300 }}>
  <!-- Progress indicators -->
  <div class="flex justify-center items-center gap-4 mb-8">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  {currentStep === 'industry' ? 'bg-purple-500 text-white' : 
                   selected.industry ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}">
        1
      </div>
      <span class="text-sm font-medium {currentStep === 'industry' ? 'text-purple-600' : 'text-gray-600'}">Industry</span>
    </div>
    
    <div class="w-8 h-0.5 bg-gray-200 {selected.industry ? 'bg-green-500' : ''}"></div>
    
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  {currentStep === 'audience' ? 'bg-purple-500 text-white' : 
                   selected.audience ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}">
        2
      </div>
      <span class="text-sm font-medium {currentStep === 'audience' ? 'text-purple-600' : 'text-gray-600'}">Audience</span>
    </div>
    
    <div class="w-8 h-0.5 bg-gray-200 {selected.audience ? 'bg-green-500' : ''}"></div>
    
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  {currentStep === 'personality' ? 'bg-purple-500 text-white' : 
                   selected.personality.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}">
        3
      </div>
      <span class="text-sm font-medium {currentStep === 'personality' ? 'text-purple-600' : 'text-gray-600'}">Personality</span>
    </div>
  </div>

  <!-- Industry Selection -->
  {#if currentStep === 'industry'}
    <div in:fly={{ x: -50, duration: 300 }} out:fly={{ x: 50, duration: 200 }}>
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
          <Building size={32} class="text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">What industry are you in?</h3>
        <p class="text-gray-600">This helps us understand your market and competition</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {#each industries as industry, i}
          <button
            class="industry-card p-6 rounded-xl border-2 border-gray-200 hover:border-{industry.color}-400 
                   bg-white hover:bg-{industry.color}-50 transition-all duration-200 text-left group
                   focus:outline-none focus:ring-4 focus:ring-{industry.color}-200"
            on:click={() => selectIndustry(industry.id)}
            in:scale={{ duration: 200, delay: i * 50 }}
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 rounded-lg bg-{industry.color}-100 flex items-center justify-center">
                <svelte:component this={industry.icon} size={24} class="text-{industry.color}-600" />
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">{industry.name}</div>
              </div>
            </div>
            
            <!-- Example branding preview -->
            <div class="bg-{industry.color}-50 p-3 rounded-lg border border-{industry.color}-200 group-hover:bg-{industry.color}-100 transition-colors">
              <div class="text-sm font-semibold text-{industry.color}-700 mb-1">
                {industry.example}
              </div>
              <div class="text-xs text-{industry.color}-600">
                {industry.tagline}
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Audience Selection -->
  {#if currentStep === 'audience'}
    <div in:fly={{ x: -50, duration: 300 }} out:fly={{ x: 50, duration: 200 }}>
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mb-4">
          <Users size={32} class="text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Who's your primary audience?</h3>
        <p class="text-gray-600">Understanding your audience shapes every design decision</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {#each audiences as audience, i}
          <button
            class="audience-card p-6 rounded-xl border-2 border-gray-200 hover:border-green-400 
                   bg-white hover:bg-green-50 transition-all duration-200 text-left
                   focus:outline-none focus:ring-4 focus:ring-green-200"
            on:click={() => selectAudience(audience.id)}
            in:scale={{ duration: 200, delay: i * 75 }}
          >
            <div class="flex items-start gap-4">
              <div class="text-3xl">{audience.emoji}</div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">{audience.name}</h4>
                <p class="text-sm text-gray-600">{audience.description}</p>
              </div>
            </div>
          </button>
        {/each}
      </div>
      
      <div class="text-center mt-6">
        <button
          on:click={goBack}
          class="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          ← Back to industry
        </button>
      </div>
    </div>
  {/if}

  <!-- Personality Selection -->
  {#if currentStep === 'personality'}
    <div in:fly={{ x: -50, duration: 300 }} out:fly={{ x: 50, duration: 200 }}>
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
          <Heart size={32} class="text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">What's your brand personality?</h3>
        <p class="text-gray-600">Choose up to 3 traits that define your brand's character</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
        {#each personalities as personality, i}
          <button
            class="personality-card p-4 rounded-xl border-2 transition-all duration-200 text-center
                   {selected.personality.includes(personality.id) 
                     ? 'border-purple-500 bg-purple-50' 
                     : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'}
                   focus:outline-none focus:ring-4 focus:ring-purple-200"
            on:click={() => togglePersonality(personality.id)}
            disabled={!selected.personality.includes(personality.id) && selected.personality.length >= 3}
            in:scale={{ duration: 200, delay: i * 50 }}
          >
            <div class="text-3xl mb-2">{personality.emoji}</div>
            <h4 class="font-semibold text-gray-900 mb-1 text-sm">{personality.name}</h4>
            <p class="text-xs text-gray-600">{personality.description}</p>
            
            {#if selected.personality.includes(personality.id)}
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {selected.personality.indexOf(personality.id) + 1}
              </div>
            {/if}
          </button>
        {/each}
      </div>
      
      <div class="text-center space-y-4">
        <button
          on:click={goBack}
          class="text-gray-600 hover:text-gray-800 text-sm font-medium mr-6"
        >
          ← Back to audience
        </button>
        
        {#if selected.personality.length > 0}
          <div>
            <button
              on:click={handleContinue}
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl 
                     hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Heart size={18} />
              Perfect! Let's continue
            </button>
            <p class="text-sm text-gray-500 mt-2">
              {selected.personality.length}/3 personality traits selected
            </p>
          </div>
        {:else}
          <p class="text-sm text-gray-500">Select at least one personality trait to continue</p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Selected summary (always visible at bottom when selections are made) -->
  {#if selected.industry || selected.audience || selected.personality.length > 0}
    <div class="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-4 max-w-2xl mx-auto border border-purple-200"
         in:fade={{ duration: 300 }}>
      <div class="flex flex-wrap gap-3 text-sm">
        {#if selectedIndustry}
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-blue-200">
            <svelte:component this={selectedIndustry.icon} size={14} class="text-blue-600" />
            {selectedIndustry.name}
          </span>
        {/if}
        {#if selectedAudience}
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-green-200">
            <span>{selectedAudience.emoji}</span>
            {selectedAudience.name}
          </span>
        {/if}
        {#each selectedPersonalities as personality}
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-purple-200">
            <span>{personality.emoji}</span>
            {personality.name}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .industry-card, .audience-card, .personality-card {
    position: relative;
  }
  
  .personality-card:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>