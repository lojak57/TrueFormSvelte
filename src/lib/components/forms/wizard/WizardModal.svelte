<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { wizardStore, wizardProgress, currentStep, WIZARD_STEPS, sectionProgress } from './stores/wizardStore';
  import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import PricingMeter from './components/PricingMeter.svelte';
  import ProgressEstimator from './components/ProgressEstimator.svelte';

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
    class="fixed inset-0 bg-black/50 z-50"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
    on:click={handleClose}
  />

  <!-- Modal Container -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
    <div 
      class="modern-wizard-modal"
      in:fly={{ y: 20, duration: 300, easing: cubicOut }}
      out:fly={{ y: 20, duration: 200, easing: cubicOut }}
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="wizard-header">
        <!-- Progress Bar -->
        <div class="progress-track">
          <div 
            class="progress-fill"
            style="width: {$wizardProgress}%"
          />
        </div>

        <!-- Navigation -->
        <div class="wizard-nav">
          <div class="nav-left">
            {#if $wizardStore.currentStepIndex > 0}
              <button
                on:click={() => wizardStore.prevStep()}
                class="nav-button back-button"
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>
            {/if}
            
            <div class="step-info">
              <div class="step-number">
                Step {$wizardStore.currentStepIndex + 1} of {WIZARD_STEPS.length}
              </div>
              <div class="step-section">
                {$currentStep.section.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          </div>

          <button
            on:click={handleClose}
            class="nav-button close-button"
            aria-label="Close wizard"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="wizard-content">
        <div class="content-container">
          <!-- Progress Estimator -->
          <ProgressEstimator />
          
          <!-- Step Title -->
          {#if $currentStep.title}
            <h2 class="step-title">
              {$currentStep.title}
            </h2>
          {/if}
          
          {#if $currentStep.subtitle}
            <p class="step-subtitle">
              {$currentStep.subtitle}
            </p>
          {/if}

          <!-- Dynamic Step Content -->
          <div class="step-content">
            <slot />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="wizard-footer">
        <div class="footer-content">
          <div class="branding">
            <span class="brand-text">TrueForm</span>
            <span class="brand-tagline">Professional Website Development</span>
          </div>
          <div class="progress-info">
            <div class="status-indicator consultation">
              <span class="status-dot"></span>
              <span class="status-text">
                {#if $wizardStore.currentStepIndex >= 10}
                  Wrapping up your vision! - {Math.round($wizardProgress)}% complete
                {:else if $wizardStore.currentStepIndex >= 7}
                  Bringing it all together - {Math.round($wizardProgress)}% complete
                {:else if $wizardStore.currentStepIndex >= 4}
                  Exploring your design style - {Math.round($wizardProgress)}% complete
                {:else if $wizardStore.currentStepIndex >= 2}
                  Getting to know your brand - {Math.round($wizardProgress)}% complete
                {:else}
                  Starting your design journey - About 8-10 minutes
                {/if}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pricing Meter -->
      <PricingMeter />
    </div>
  </div>
{/if}

<style>
  .modern-wizard-modal {
    position: relative;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
    pointer-events: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .wizard-header {
    position: relative;
    padding: 24px 32px 20px;
    border-bottom: 1px solid rgb(243, 244, 246);
    background: linear-gradient(135deg, rgb(249, 250, 251) 0%, white 100%);
  }

  .progress-track {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgb(243, 244, 246);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, rgb(59, 130, 246), rgb(37, 99, 235));
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
  }

  .wizard-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background: white;
    color: rgb(107, 114, 128);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .nav-button:hover {
    background: rgb(249, 250, 251);
    color: rgb(59, 130, 246);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .close-button:hover {
    background: rgb(254, 226, 226);
    color: rgb(220, 38, 38);
  }

  .step-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .step-number {
    font-size: 16px;
    font-weight: 600;
    color: rgb(17, 24, 39);
  }

  .step-section {
    font-size: 12px;
    color: rgb(107, 114, 128);
    text-transform: capitalize;
    font-weight: 500;
  }

  .wizard-content {
    flex: 1;
    overflow-y: auto;
    background: linear-gradient(180deg, white 0%, rgb(249, 250, 251) 100%);
  }

  .content-container {
    padding: 32px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
  }

  .step-title {
    font-size: 28px;
    font-weight: 700;
    color: rgb(17, 24, 39);
    margin: 16px 0 8px 0;
    line-height: 1.2;
  }

  .step-subtitle {
    font-size: 16px;
    color: rgb(107, 114, 128);
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 16px;
  }

  .wizard-footer {
    padding: 20px 32px;
    border-top: 1px solid rgb(243, 244, 246);
    background: white;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .branding {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-text {
    font-size: 14px;
    font-weight: 700;
    color: rgb(59, 130, 246);
  }

  .brand-tagline {
    font-size: 11px;
    color: rgb(107, 114, 128);
    font-weight: 500;
  }

  .progress-info {
    display: flex;
    align-items: center;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-indicator.express .status-dot {
    background: rgb(34, 197, 94);
  }

  .status-indicator.custom .status-dot {
    background: rgb(59, 130, 246);
  }

  .status-indicator.streamlined .status-dot {
    background: rgb(16, 185, 129);
  }

  .status-indicator.consultation .status-dot {
    background: linear-gradient(45deg, rgb(168, 85, 247), rgb(236, 72, 153));
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .status-text {
    font-size: 12px;
    color: rgb(107, 114, 128);
    font-weight: 500;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .modern-wizard-modal {
      max-width: 95vw;
      max-height: 95vh;
      margin: 12px;
    }

    .wizard-header {
      padding: 20px 24px 16px;
    }

    .content-container {
      padding: 24px;
      min-height: 400px;
    }

    .step-title {
      font-size: 24px;
    }

    .wizard-footer {
      padding: 16px 24px;
    }

    .footer-content {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .nav-left {
      gap: 12px;
    }

    .step-info {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .step-title {
      font-size: 20px;
    }

    .content-container {
      padding: 20px;
    }

    .wizard-header {
      padding: 16px 20px 12px;
    }

    .wizard-footer {
      padding: 12px 20px;
    }
  }

  /* Dark mode support */
  :global(.dark) .modern-wizard-modal {
    background: rgb(17, 24, 39);
    color: rgb(243, 244, 246);
  }

  :global(.dark) .wizard-header {
    border-color: rgb(55, 65, 81);
    background: linear-gradient(135deg, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%);
  }

  :global(.dark) .wizard-content {
    background: linear-gradient(180deg, rgb(17, 24, 39) 0%, rgb(31, 41, 55) 100%);
  }

  :global(.dark) .wizard-footer {
    border-color: rgb(55, 65, 81);
    background: rgb(17, 24, 39);
  }

  :global(.dark) .nav-button {
    background: rgb(31, 41, 55);
    color: rgb(156, 163, 175);
  }

  :global(.dark) .nav-button:hover {
    background: rgb(55, 65, 81);
    color: rgb(59, 130, 246);
  }

  :global(.dark) .step-title {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .step-subtitle {
    color: rgb(156, 163, 175);
  }

  /* Ensure modal is always on top */
  :global(body.wizard-open) {
    overflow: hidden;
  }

  /* Smooth animations */
  @media (prefers-reduced-motion: reduce) {
    .progress-fill,
    .nav-button {
      transition: none;
    }
  }
</style> 