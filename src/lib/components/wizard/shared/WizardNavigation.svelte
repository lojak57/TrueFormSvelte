<script lang="ts">
  import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
  import Button from '../../ui/Button.svelte';
  
  export let currentStep: number;
  export let totalSteps: number;
  export let canGoBack: boolean = true;
  export let canGoNext: boolean = true;
  export let isLoading: boolean = false;
  export let isSubmitting: boolean = false;
  export let onPrevious: (() => void) | null = null;
  export let onNext: (() => void) | null = null;
  export let onSubmit: (() => void) | null = null;
  
  $: isLastStep = currentStep === totalSteps;
  $: showPrevious = currentStep > 1 && canGoBack && onPrevious;
  $: showNext = !isLastStep && canGoNext && onNext;
  $: showSubmit = isLastStep && onSubmit;
  
  function handlePrevious() {
    if (onPrevious && !isLoading) {
      onPrevious();
    }
  }
  
  function handleNext() {
    if (onNext && !isLoading) {
      onNext();
    }
  }
  
  function handleSubmit() {
    if (onSubmit && !isSubmitting) {
      onSubmit();
    }
  }
</script>

<div class="wizard-navigation">
  <div class="nav-left">
    {#if showPrevious}
      <Button 
        variant="outline" 
        on:click={handlePrevious} 
        disabled={isLoading || isSubmitting}
        class="flex items-center gap-2"
      >
        <ChevronLeft size={20} />
        Back
      </Button>
    {/if}
  </div>

  <div class="nav-center">
    <span class="step-counter">
      {currentStep} of {totalSteps}
    </span>
  </div>

  <div class="nav-right">
    {#if showNext}
      <Button 
        variant="accent" 
        on:click={handleNext}
        disabled={!canGoNext || isLoading}
        class="flex items-center gap-2"
      >
        {#if isLoading}
          <Loader2 size={20} class="animate-spin" />
          Validating...
        {:else}
          Next Step
          <ChevronRight size={20} />
        {/if}
      </Button>
    {:else if showSubmit}
      <Button 
        variant="accent" 
        on:click={handleSubmit}
        disabled={!canGoNext || isSubmitting}
        class="px-8 flex items-center gap-2"
      >
        {#if isSubmitting}
          <Loader2 size={20} class="animate-spin" />
          Creating Your Request...
        {:else}
          Submit Request
        {/if}
      </Button>
    {/if}
  </div>
</div>

<style>
  .wizard-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgb(229, 231, 235);
  }
  
  .nav-left,
  .nav-right {
    flex: 1;
  }
  
  .nav-left {
    display: flex;
    justify-content: flex-start;
  }
  
  .nav-center {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
  }
  
  .nav-right {
    display: flex;
    justify-content: flex-end;
  }
  
  .step-counter {
    font-size: 0.875rem;
    color: rgb(107, 114, 128);
    font-weight: 500;
  }
  
  @media (max-width: 640px) {
    .wizard-navigation {
      flex-direction: column;
      gap: 1rem;
    }
    
    .nav-left,
    .nav-center,
    .nav-right {
      flex: none;
      width: 100%;
    }
    
    .nav-left,
    .nav-right {
      justify-content: center;
    }
  }
</style> 