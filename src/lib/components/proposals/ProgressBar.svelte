<!-- Progress Bar Component -->
<script lang="ts">
  import type { WizardStep } from '$lib/types/proposals';

  // Props
  export let steps: WizardStep[];
  export let currentStep: number;

  // Calculate progress
  $: completedSteps = steps.filter(step => step.isComplete).length;
  $: progressPercentage = (completedSteps / steps.length) * 100;

  function getStepStatus(step: WizardStep) {
    if (step.isComplete) return 'complete';
    if (step.id === currentStep) return 'current';
    return 'pending';
  }
</script>

<!-- Progress Bar -->
<div class="progress-bar bg-white border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <!-- Progress Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm font-medium text-slate-900">
          Step {currentStep} of {steps.length}
        </p>
        <p class="text-xs text-slate-600">
          {completedSteps} completed • {steps.length - completedSteps} remaining
        </p>
      </div>
      
      <div class="text-sm text-slate-600">
        {Math.round(progressPercentage)}% complete
      </div>
    </div>
    
    <!-- Progress Track -->
    <div class="relative">
      <div class="flex items-center justify-between">
        {#each steps as step, index}
          {@const status = getStepStatus(step)}
          <div class="flex flex-col items-center relative z-10">
            <!-- Step Circle -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
              class:bg-green-500={status === 'complete'}
              class:bg-primary-500={status === 'current'}
              class:bg-slate-200={status === 'pending'}
              class:text-white={status === 'complete' || status === 'current'}
              class:text-slate-600={status === 'pending'}
            >
              {#if status === 'complete'}
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              {:else}
                {step.id}
              {/if}
            </div>
            
            <!-- Step Label (hidden on mobile) -->
            <span class="hidden sm:block text-xs text-slate-600 mt-2 max-w-20 text-center leading-tight">
              {step.title}
            </span>
          </div>
          
          <!-- Connecting Line -->
          {#if index < steps.length - 1}
            <div class="flex-1 h-0.5 mx-2 relative">
              <div class="absolute inset-0 bg-slate-200"></div>
              <div 
                class="absolute inset-0 bg-green-500 transition-all duration-500"
                class:w-full={step.isComplete}
                class:w-0={!step.isComplete}
              ></div>
            </div>
          {/if}
        {/each}
      </div>
      
      <!-- Overall Progress Bar (mobile-friendly) -->
      <div class="sm:hidden mt-4">
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div 
            class="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style="width: {progressPercentage}%"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .step-marker {
    position: relative;
  }

  .step-marker.completed {
    background-color: rgb(34, 197, 94);
    border-color: rgb(34, 197, 94);
    color: white;
  }

  .step-marker.current {
    background-color: rgb(59, 130, 246);
    border-color: rgb(59, 130, 246);
    color: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .step-marker.upcoming {
    background-color: white;
    border-color: rgb(203, 213, 225);
    color: rgb(75, 85, 99);
  }

  .step-marker:hover .step-tooltip {
    opacity: 1;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  @media (max-width: 768px) {
    .step-marker {
      width: 1rem;
      height: 1rem;
    }
    
    .step-marker svg {
      width: 0.5rem;
      height: 0.5rem;
    }
    
    .step-marker span {
      font-size: 0.75rem;
    }
  }
</style> 