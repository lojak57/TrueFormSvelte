<script lang="ts">
  import type { WizardStep } from '$lib/types/proposals';
  import { Check, ChevronRight } from 'lucide-svelte';
  
  export let steps: WizardStep[];
  export let currentStep: number;
  export let onStepClick: (stepNumber: number) => void;
  
  function handleStepClick(step: WizardStep) {
    if (step.isComplete || step.id <= currentStep) {
      onStepClick(step.id);
    }
  }
  
  function getStepStatus(step: WizardStep) {
    if (step.isComplete) return 'complete';
    if (step.id === currentStep) return 'current';
    if (step.id < currentStep) return 'accessible';
    return 'locked';
  }
</script>

<nav class="wizard-navigation">
  <ol class="space-y-2">
    {#each steps as step}
      {@const status = getStepStatus(step)}
      <li>
        <button
          type="button"
          class="w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3"
          class:bg-primary-50={status === 'current'}
          class:border-primary-200={status === 'current'}
          class:text-primary-700={status === 'current'}
          class:bg-green-50={status === 'complete'}
          class:text-green-700={status === 'complete'}
          class:text-slate-900={status === 'accessible'}
          class:text-slate-400={status === 'locked'}
          class:hover:bg-slate-50={status === 'accessible' || status === 'complete'}
          class:cursor-not-allowed={status === 'locked'}
          class:cursor-pointer={status !== 'locked'}
          disabled={status === 'locked'}
          on:click={() => handleStepClick(step)}
        >
          <!-- Step indicator -->
          <div class="flex-shrink-0">
            {#if status === 'complete'}
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={14} class="text-green-600" />
              </div>
            {:else if status === 'current'}
              <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-semibold text-primary-600">{step.id}</span>
              </div>
            {:else}
              <div class="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-slate-600">{step.id}</span>
              </div>
            {/if}
          </div>
          
          <!-- Step content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{step.title}</p>
            {#if step.description}
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{step.description}</p>
            {/if}
          </div>
          
          <!-- Navigation arrow for accessible steps -->
          {#if status === 'accessible' || status === 'complete'}
            <ChevronRight size={16} class="text-slate-400" />
          {/if}
        </button>
      </li>
    {/each}
  </ol>
</nav>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 