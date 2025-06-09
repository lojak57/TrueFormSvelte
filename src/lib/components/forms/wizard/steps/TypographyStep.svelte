<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { scale } from 'svelte/transition';
  
  export let selected: string = '';
  
  const dispatch = createEventDispatcher();
  
  let animatingOption = '';
  
  const typographyOptions = [
    { 
      id: 'sans-serif', 
      name: 'Clean & Modern Sans-serif', 
      icon: 'Aa', 
      description: 'Clean, readable, contemporary',
      sample: 'The quick brown fox jumps over the lazy dog',
      fontClass: 'font-sans',
      example: 'Perfect for tech companies, startups, modern businesses'
    },
    { 
      id: 'serif', 
      name: 'Professional Serif', 
      icon: 'Aa', 
      description: 'Traditional, trustworthy, elegant',
      sample: 'The quick brown fox jumps over the lazy dog',
      fontClass: 'font-serif',
      example: 'Ideal for law firms, finance, established businesses'
    },
    { 
      id: 'display', 
      name: 'Creative Display Fonts', 
      icon: 'Aa', 
      description: 'Unique, expressive, memorable',
      sample: 'THE QUICK BROWN FOX',
      fontClass: 'font-bold tracking-wide',
      example: 'Great for creative agencies, artists, bold brands'
    },
    { 
      id: 'mono', 
      name: 'Tech/Code-inspired', 
      icon: 'Aa', 
      description: 'Technical, precise, modern',
      sample: 'console.log("Hello World");',
      fontClass: 'font-mono',
      example: 'Perfect for tech companies, developers, SaaS'
    },
    { 
      id: 'script', 
      name: 'Handwritten/Script', 
      icon: 'Aa', 
      description: 'Personal, warm, creative',
      sample: 'Welcome to our story...',
      fontClass: 'italic font-light',
      example: 'Excellent for personal brands, boutiques, cafes'
    },
    { 
      id: 'bold', 
      name: 'Bold & Impactful', 
      icon: 'Aa', 
      description: 'Strong, confident, attention-grabbing',
      sample: 'MAKE AN IMPACT',
      fontClass: 'font-black uppercase tracking-wider',
      example: 'Powerful for fitness, sports, bold statements'
    },
    { 
      id: 'custom', 
      name: 'Let You Choose', 
      icon: '?', 
      description: 'We\'ll recommend the perfect typography',
      sample: 'Trust our design expertise',
      fontClass: 'font-medium',
      example: 'We\'ll select fonts that match your brand perfectly'
    }
  ];
  
  function isSelected(optionId: string): boolean {
    return selected === optionId;
  }
  
  function selectOption(optionId: string) {
    if (selected === optionId) {
      // Clicking the same option that's already selected = deselect it
      selected = '';
      animatingOption = '';
    } else {
      // Clicking a different option = select it
      selected = optionId;
      animatingOption = optionId;
      // Clear animation state after animation completes
      setTimeout(() => {
        animatingOption = '';
      }, 600);
      // Auto-advance after full animation
      setTimeout(() => {
        dispatch('complete', { value: selected });
      }, 1200);
    }
  }
</script>

<div class="mb-4">
  <p class="text-sm text-gray-600">
    Typography sets the tone for your entire website. Choose a style that reflects your brand personality.
  </p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  {#each typographyOptions as option}
    <button
      on:click={() => selectOption(option.id)}
      class="relative p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] overflow-hidden text-left
        {isSelected(option.id)
          ? 'border-accent-600 ring-2 ring-accent-200 shadow-lg scale-[1.05]' 
          : 'border-gray-200 hover:border-gray-300 bg-white'}"
    >
      <!-- Fill-up animation background -->
      {#if animatingOption === option.id || isSelected(option.id)}
        <div 
          class="absolute inset-0 bg-orange-600"
          in:scale={{ duration: 500, start: 0, easing: (t) => t * t * (3 - 2 * t) }}
          out:scale={{ duration: 200, start: 1 }}
          style="transform-origin: center center;"
        />
        <!-- Beautiful bloom effect -->
        <div 
          class="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 opacity-60"
          in:scale={{ duration: 800, delay: 400, start: 0.3, easing: (t) => 1 - Math.pow(1 - t, 3) }}
          out:scale={{ duration: 200, start: 1 }}
          style="transform-origin: center center;"
        />
        <!-- Subtle sparkle overlay -->
        <div 
          class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"
          in:scale={{ duration: 600, delay: 600, start: 0.8 }}
          out:scale={{ duration: 200, start: 1 }}
          style="transform-origin: center center;"
        />
        <!-- Checkmark -->
        <div 
          class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl z-20 ring-2 ring-white/50"
          in:scale={{ duration: 400, delay: 300, start: 0 }}
          out:scale={{ duration: 200, start: 0.5 }}
        >
          <svg class="w-5 h-5 text-orange-600 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      {/if}
      
      <div class="space-y-4 relative z-10">
        <!-- Typography Preview -->
        <div class="mb-4">
          <div class="text-4xl {option.fontClass} mb-2 {isSelected(option.id) ? 'text-white drop-shadow-sm' : 'text-gray-800'} transition-colors duration-300">
            {option.icon}
          </div>
          <div class="text-sm {option.fontClass} {isSelected(option.id) ? 'text-white/90 drop-shadow-sm' : 'text-gray-600'} transition-colors duration-300 leading-relaxed">
            {option.sample}
          </div>
        </div>
        
        <!-- Typography Info -->
        <div>
          <h3 class="font-bold {isSelected(option.id) ? 'text-white drop-shadow-sm' : 'text-gray-900'} text-lg mb-2 transition-colors duration-300">
            {option.name}
          </h3>
          <p class="text-sm font-medium {isSelected(option.id) ? 'text-white/90 drop-shadow-sm' : 'text-gray-600'} mb-3 transition-colors duration-300">
            {option.description}
          </p>
          <p class="text-xs {isSelected(option.id) ? 'text-white/80 drop-shadow-sm' : 'text-gray-500'} italic transition-colors duration-300">
            {option.example}
          </p>
        </div>
      </div>
    </button>
  {/each}
</div>

<style>
  /* Removed CSS animations - now using Svelte transitions for better reactivity */
</style> 