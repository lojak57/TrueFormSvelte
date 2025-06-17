<script lang="ts">
  import { onMount } from 'svelte';
  import Hero from '$lib/components/sections/Hero.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ConversationalWizard from '$lib/components/forms/wizard/ConversationalWizard.svelte';
  import { wizardStore } from '$lib/components/forms/wizard/stores/wizardStore';
  import { Sparkles, Clock, Shield, Zap } from 'lucide-svelte';

  // Auto-open wizard on mount if coming from a CTA
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('start') === 'true') {
      wizardStore.open();
    }
  });
</script>

<svelte:head>
  <title>Start Your Project - TrueForm</title>
  <meta name="description" content="Begin your website journey with TrueForm's guided project wizard" />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-accent-900 text-white overflow-hidden">
  <!-- Background Effects -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-900/20 via-transparent to-transparent"></div>
  <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
  
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
    <div class="text-center">
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
        Ready to Build Something
        <span class="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent">
          Amazing?
        </span>
      </h1>
      
      <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
        Our guided wizard makes it easy to share your vision. No technical knowledge required.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="accent" 
          size="lg"
          on:click={() => wizardStore.open()}
          class="group px-8 py-4 text-lg shadow-2xl hover:shadow-accent-500/25 transition-all duration-300 hover:scale-105"
        >
          <Sparkles size={20} class="mr-2 group-hover:rotate-12 transition-transform" />
          Start Your Project
        </Button>
      </div>
    </div>
  </div>
  
  <!-- Bottom Wave -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" class="w-full h-12 md:h-20 fill-gray-50">
      <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
    </svg>
  </div>
</section>

<!-- Benefits Section -->
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
            <Clock size={32} class="text-accent-600" />
          </div>
          <h3 class="text-lg font-semibold mb-2">5-7 Minutes</h3>
          <p class="text-gray-600">Quick and easy process with guided prompts</p>
        </div>
        
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
            <Shield size={32} class="text-accent-600" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Save & Resume</h3>
          <p class="text-gray-600">Your progress is saved automatically</p>
        </div>
        
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
            <Zap size={32} class="text-accent-600" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Instant Quote</h3>
          <p class="text-gray-600">Get pricing and timeline immediately</p>
        </div>
      </div>

      <!-- What Happens Next -->
      <div class="bg-gray-50 rounded-2xl p-8">
        <h2 class="text-2xl font-bold mb-6 text-center">What Happens After You Submit?</h2>
        
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h4 class="font-semibold mb-1">Instant Confirmation</h4>
              <p class="text-gray-600">You'll receive an email with your project details and next steps</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h4 class="font-semibold mb-1">Expert Review</h4>
              <p class="text-gray-600">Our team reviews your requirements and prepares a custom proposal</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h4 class="font-semibold mb-1">Personalized Demo</h4>
              <p class="text-gray-600">See a preview of your website design and functionality</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h4 class="font-semibold mb-1">Start Building</h4>
              <p class="text-gray-600">Once approved, we begin bringing your vision to life</p>
            </div>
          </div>
        </div>
        
        <div class="mt-8 text-center">
          <Button 
            variant="accent" 
            size="lg"
            on:click={() => wizardStore.open()}
          >
            <Sparkles size={20} class="mr-2" />
            Start Your Project Now
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Add the wizard component -->
<ConversationalWizard />

<style>
  .bg-grid-white\/\[0\.02\] {
    background-image: radial-gradient(circle, white 1px, transparent 1px);
  }
</style> 