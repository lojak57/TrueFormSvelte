<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { conversationalWizard, wizardProgress, WIZARD_STEPS } from './conversationalWizardStore';
  import TrustBanner from './reassurance/TrustBanner.svelte';
  import TrustBreaker from './reassurance/TrustBreaker.svelte';
  import Step1Identity from './steps/Step1Identity.svelte';
  import Step2Problem from './steps/Step2Problem.svelte';
  import Step3Current from './steps/Step3Current.svelte';
  import Step4Vision from './steps/Step4Vision.svelte';
  import Step5Vibe from './steps/Step5Vibe.svelte';
  import Step6Relationship from './steps/Step6Relationship.svelte';
  import Step7Scoping from './steps/Step7Scoping.svelte';
  import Step8Submission from './steps/Step8Submission.svelte';
  
  let showTrustBreaker = false;
  
  // Start the wizard on mount
  onMount(() => {
    conversationalWizard.start();
  });
  
  // Show trust breaker after scoping, before final submission step
  $: if ($conversationalWizard.currentStep === 7 && !$conversationalWizard.trustAcknowledged) {
    showTrustBreaker = true;
  } else {
    showTrustBreaker = false;
  }
  
  function handleTrustContinue() {
    conversationalWizard.acknowledgeTrust();
    showTrustBreaker = false;
    conversationalWizard.nextStep();
  }
</script>

<div class="wizard-container">
  <!-- Trust Banner -->
  <TrustBanner />
  
  <!-- Progress Indicator -->
  <div class="progress-container" in:fade={{ duration: 300, delay: 200 }}>
    <div class="progress-bar">
      <div 
        class="progress-fill"
        style="width: {$wizardProgress.percentage}%"
      />
    </div>
    <span class="progress-text">
      {$wizardProgress.currentStep} of {$wizardProgress.totalSteps}
    </span>
  </div>
  
  <!-- Main Content -->
  <main class="wizard-content">
    {#if showTrustBreaker}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600 }} out:fade={{ duration: 300 }}>
        <TrustBreaker 
          on:continue={handleTrustContinue}
        />
      </div>
    {:else if $conversationalWizard.currentStep === 0}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step1Identity />
      </div>
    {:else if $conversationalWizard.currentStep === 1}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step2Problem />
      </div>
    {:else if $conversationalWizard.currentStep === 2}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step3Current />
      </div>
    {:else if $conversationalWizard.currentStep === 3}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step4Vision />
      </div>
    {:else if $conversationalWizard.currentStep === 4}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step5Vibe />
      </div>
    {:else if $conversationalWizard.currentStep === 5}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step6Relationship />
      </div>
    {:else if $conversationalWizard.currentStep === 6}
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step7Scoping />
      </div>
    {:else if $conversationalWizard.currentStep === 7 && $conversationalWizard.trustAcknowledged}
      <!-- Step8Submission -->
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step8Submission />
      </div>
    {:else if $conversationalWizard.currentStep === 8}
      <!-- Step8Submission (fallback) -->
      <div class="step-wrapper" in:fly={{ y: 30, duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
        <Step8Submission />
      </div>
    {/if}
  </main>
</div>

<style>
  .wizard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    display: flex;
    flex-direction: column;
  }
  
  .progress-container {
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .progress-bar {
    flex: 1;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
    transition: width 0.5s ease;
  }
  
  .progress-text {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    min-width: fit-content;
  }
  
  .wizard-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    width: 100%;
  }
  
  .step-wrapper {
    width: 100%;
    min-height: 400px;
  }
  
  @media (max-width: 640px) {
    .progress-container {
      padding: 0.75rem 1rem;
    }
    
    .wizard-content {
      padding: 1rem;
    }
    
    .review-content {
      padding: 1rem;
    }
  }
</style>