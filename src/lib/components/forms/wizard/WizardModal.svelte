<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { wizardStore, wizardProgress, currentStep, WIZARD_STEPS, sectionProgress } from './stores/wizardStore';
  import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import PricingMeter from './components/PricingMeter.svelte';

  let isClosing = false;

  function handleClose() {
    if ($wizardStore.completedSteps.size > 0) {
      if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
        closeWizard();
      }
    } else {
      closeWizard();
    }
  }

  function closeWizard() {
    isClosing = true;
    setTimeout(() => {
      wizardStore.close();
      isClosing = false;
    }, 300);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  onMount(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  });

  $: canGoBack = $wizardStore.currentStepIndex > 0;
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $wizardStore.isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 300 }}
    on:click={handleClose}
  />

  <!-- Modal Container -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
    <div 
      class="relative w-full max-w-2xl h-[700px] bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col"
      in:fly={{ y: 30, duration: 500, easing: cubicOut }}
      out:fly={{ y: 30, duration: 300, easing: cubicOut }}
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="relative px-6 pt-6 pb-4 border-b border-gray-100">
        <!-- Progress Bar -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div 
            class="h-full bg-gradient-to-r from-accent-500 to-accent-600 transition-all duration-700 ease-out"
            style="width: {$wizardProgress}%"
          />
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            {#if $wizardStore.currentStepIndex > 0}
              <button
                on:click={() => wizardStore.prevStep()}
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>
            {/if}
            
            <div>
              <p class="text-sm text-gray-500">
                Step {$wizardStore.currentStepIndex + 1} of {WIZARD_STEPS.length}
              </p>
              <p class="text-xs text-gray-400 capitalize">
                {$currentStep.section.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          </div>

          <button
            on:click={handleClose}
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close wizard"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-8 min-h-[480px] flex flex-col">
          <!-- Step Title -->
          {#if $currentStep.title}
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              {$currentStep.title}
            </h2>
          {/if}
          
          {#if $currentStep.subtitle}
            <p class="text-gray-600 mb-6">
              {$currentStep.subtitle}
            </p>
          {/if}

          <!-- Dynamic Step Content -->
          <div class="mt-8 flex-1 flex flex-col justify-center">
            <slot />
          </div>
        </div>
      </div>

      <!-- Footer (if needed for consistent actions) -->
      <div class="px-8 py-4 border-t border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>✨ Building something amazing together</span>
          <span>Typically takes 5-7 minutes</span>
        </div>
      </div>
      
      <!-- Pricing Meter -->
      <PricingMeter />
    </div>
  </div>
{/if}

<style>
  /* Ensure modal is always on top */
  :global(body.wizard-open) {
    overflow: hidden;
  }
</style> 