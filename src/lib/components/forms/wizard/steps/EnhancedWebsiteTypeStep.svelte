<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { Building, ShoppingCart, Palette, PenTool, Calendar, Users, Zap, Globe } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  export let selected: string = '';
  
  const websiteTypes = [
    {
      id: 'business',
      name: 'Business Website',
      icon: Building,
      description: 'Professional company presence',
      features: ['Company info', 'Services showcase', 'Contact forms', 'Team pages'],
      example: {
        header: 'Professional Services Co.',
        sections: ['About Us', 'Our Services', 'Meet the Team', 'Contact'],
        content: 'We deliver excellence in every project',
        cta: 'Get Quote'
      },
      color: 'blue'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      icon: ShoppingCart,
      description: 'Sell products online',
      features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Order management'],
      example: {
        header: 'StyleHub Store',
        sections: ['Shop', 'Categories', 'Cart', 'Account'],
        content: 'Discover your perfect style',
        cta: 'Shop Now'
      },
      color: 'purple'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Showcase',
      icon: Palette,
      description: 'Display your creative work',
      features: ['Project galleries', 'Case studies', 'Client testimonials', 'Contact booking'],
      example: {
        header: 'Creative Studio',
        sections: ['Work', 'About', 'Process', 'Contact'],
        content: 'Where creativity meets strategy',
        cta: 'View Work'
      },
      color: 'pink'
    },
    {
      id: 'blog',
      name: 'Blog & Content',
      icon: PenTool,
      description: 'Share insights and articles',
      features: ['Article publishing', 'Categories & tags', 'Newsletter signup', 'Comment system'],
      example: {
        header: 'Industry Insights',
        sections: ['Latest', 'Categories', 'About', 'Subscribe'],
        content: 'Expert insights and industry trends',
        cta: 'Read More'
      },
      color: 'green'
    },
    {
      id: 'booking',
      name: 'Booking & Services',
      icon: Calendar,
      description: 'Schedule appointments and services',
      features: ['Online booking', 'Calendar integration', 'Service listings', 'Client portal'],
      example: {
        header: 'MedCare Clinic',
        sections: ['Services', 'Book Now', 'About', 'Contact'],
        content: 'Your health is our priority',
        cta: 'Book Appointment'
      },
      color: 'red'
    },
    {
      id: 'membership',
      name: 'Membership Site',
      icon: Users,
      description: 'Exclusive content and community',
      features: ['Member portal', 'Gated content', 'Community features', 'Subscription billing'],
      example: {
        header: 'Elite Learning',
        sections: ['Courses', 'Community', 'Resources', 'Profile'],
        content: 'Unlock your potential',
        cta: 'Join Now'
      },
      color: 'indigo'
    },
    {
      id: 'landing',
      name: 'Landing Page',
      icon: Zap,
      description: 'Single-purpose conversion page',
      features: ['Hero section', 'Benefits showcase', 'Lead capture', 'Social proof'],
      example: {
        header: 'Launch Your Success',
        sections: ['Benefits', 'Pricing', 'Testimonials', 'Sign Up'],
        content: 'Transform your business today',
        cta: 'Start Free Trial'
      },
      color: 'orange'
    },
    {
      id: 'custom',
      name: 'Custom Solution',
      icon: Globe,
      description: 'Unique requirements',
      features: ['Custom functionality', 'Integrations', 'Scalable architecture', 'Ongoing support'],
      example: {
        header: 'Your Vision',
        sections: ['Custom', 'Features', 'As Needed', 'By You'],
        content: 'Built exactly to your specifications',
        cta: 'Discuss Project'
      },
      color: 'gray'
    }
  ];
  
  function selectType(typeId: string) {
    selected = typeId;
  }
  
  function handleContinue() {
    dispatch('complete', { value: selected });
  }
  
  $: selectedType = websiteTypes.find(t => t.id === selected);
</script>

<div class="space-y-8" in:fade={{ duration: 300 }}>
  <!-- Header -->
  <div class="text-center">
    <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-xl">
      <Building size={40} class="text-white" />
    </div>
    
    <div class="mb-8">
      <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Each website type is designed for different goals. See exactly what yours could look like!
      </p>
    </div>
  </div>

  <!-- Website Type Grid -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {#each websiteTypes as type, i}
      <button
        class="website-type-card group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] text-left
               {selected === type.id 
                 ? `border-${type.color}-500 bg-${type.color}-50 shadow-xl shadow-${type.color}-100` 
                 : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'}
               focus:outline-none focus:ring-4 focus:ring-purple-200"
        on:click={() => selectType(type.id)}
        in:scale={{ duration: 300, delay: Math.min(i * 75, 500) }}
      >
        <!-- Selection indicator -->
        {#if selected === type.id}
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
               in:scale={{ duration: 200 }}>
            ✓
          </div>
        {/if}
        
        <!-- Website Mockup Preview -->
        <div class="website-preview bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
          <!-- Browser bar -->
          <div class="flex items-center gap-1 mb-2">
            <div class="w-2 h-2 bg-red-400 rounded-full"></div>
            <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="flex-1 bg-white rounded px-2 py-1 ml-2">
              <div class="w-full h-1 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <!-- Website content -->
          <div class="bg-white rounded border border-gray-200 p-2 text-xs">
            <!-- Header -->
            <div class="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
              <div class="font-semibold text-{type.color}-700 text-xs">
                {type.example.header}
              </div>
            </div>
            
            <!-- Navigation -->
            <div class="flex gap-2 mb-2 text-xs text-gray-500">
              {#each type.example.sections as section}
                <span class="text-xs">{section}</span>
              {/each}
            </div>
            
            <!-- Hero content -->
            <div class="text-center py-2">
              <div class="text-xs font-medium text-gray-800 mb-1">
                {type.example.content}
              </div>
              <div class="bg-{type.color}-500 text-white px-2 py-1 rounded text-xs inline-block">
                {type.example.cta}
              </div>
            </div>
            
            <!-- Feature boxes -->
            <div class="grid grid-cols-3 gap-1 mt-2">
              {#each Array(3) as _, j}
                <div class="bg-{type.color}-50 p-1 rounded">
                  <div class="w-full h-2 bg-{type.color}-200 rounded mb-1"></div>
                  <div class="w-2/3 h-1 bg-{type.color}-300 rounded"></div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Type info -->
        <div class="flex items-start gap-3 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                      {selected === type.id 
                        ? `bg-${type.color}-100` 
                        : `bg-${type.color}-50 group-hover:bg-${type.color}-100`}
                      transition-colors duration-200">
            <svelte:component this={type.icon} size={24} class="text-{type.color}-600" />
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-{type.color}-700 transition-colors">
              {type.name}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {type.description}
            </p>
          </div>
        </div>
        
        <!-- Key features -->
        <div class="space-y-1">
          <div class="text-xs font-medium text-gray-700 mb-2">Key Features:</div>
          {#each type.features as feature}
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <div class="w-1 h-1 bg-{type.color}-400 rounded-full"></div>
              <span>{feature}</span>
            </div>
          {/each}
        </div>
      </button>
    {/each}
  </div>

  <!-- Selected type preview -->
  {#if selectedType}
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-4xl mx-auto border border-blue-200"
         in:fade={{ duration: 300 }}>
      <h4 class="text-lg font-semibold text-gray-900 mb-4 text-center">
        🚀 Perfect choice! Here's what we'll build:
      </h4>
      
      <div class="grid md:grid-cols-2 gap-6 items-center">
        <!-- Enhanced preview -->
        <div class="website-mockup bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Browser bar -->
          <div class="bg-gray-100 px-3 py-2 flex items-center gap-2">
            <div class="flex gap-1">
              <div class="w-3 h-3 bg-red-400 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div class="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-600">
              yourcompany.com
            </div>
          </div>
          
          <!-- Enhanced website content -->
          <div class="p-4 bg-{selectedType.color}-50">
            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
              <div class="font-bold text-{selectedType.color}-700">
                {selectedType.example.header}
              </div>
              <div class="text-xs text-gray-600">Menu</div>
            </div>
            
            <!-- Navigation -->
            <div class="flex gap-3 mb-4 text-xs text-gray-600 border-b border-{selectedType.color}-200 pb-2">
              {#each selectedType.example.sections as section}
                <span>{section}</span>
              {/each}
            </div>
            
            <!-- Hero section -->
            <div class="text-center py-6 bg-white rounded-lg mb-4">
              <h2 class="font-bold text-{selectedType.color}-800 mb-2">
                {selectedType.example.content}
              </h2>
              <div class="bg-{selectedType.color}-500 text-white px-4 py-2 rounded inline-block text-sm font-medium">
                {selectedType.example.cta}
              </div>
            </div>
            
            <!-- Feature grid -->
            <div class="grid grid-cols-3 gap-2">
              {#each selectedType.features.slice(0, 3) as feature}
                <div class="bg-white p-2 rounded text-center">
                  <div class="w-6 h-6 bg-{selectedType.color}-200 rounded mx-auto mb-1"></div>
                  <div class="text-xs text-gray-700">{feature}</div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Features and benefits -->
        <div>
          <h5 class="font-semibold text-gray-900 mb-3">What you'll get:</h5>
          <div class="space-y-2">
            {#each selectedType.features as feature}
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 bg-{selectedType.color}-500 rounded-full flex items-center justify-center">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span class="text-gray-700">{feature}</span>
              </div>
            {/each}
          </div>
          
          <div class="mt-4 p-3 bg-{selectedType.color}-100 rounded-lg">
            <p class="text-sm text-{selectedType.color}-800">
              <strong>{selectedType.name}</strong> - {selectedType.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Continue button -->
  <div class="text-center pt-6">
    {#if selected}
      <button
        on:click={handleContinue}
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl 
               hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl
               focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        <Building size={20} />
        Perfect! Let's build your {selectedType.name.toLowerCase()}
      </button>
    {:else}
      <div class="space-y-3">
        <p class="text-gray-600">Choose a website type to continue</p>
        <p class="text-sm text-gray-500">💡 Each type is optimized for different business goals</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .website-type-card:hover .website-preview {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
</style>