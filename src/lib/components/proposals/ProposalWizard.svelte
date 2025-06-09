<!-- TrueForm Proposal Creation Wizard -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { 
    proposalStore, 
    proposalActions, 
    wizardState, 
    currentStep, 
    currentStepData,
    canProceed,
    proposalTotals,
    totalEstimatedHours
  } from '$lib/stores/proposalStore';
  import ProjectTypeStep from './steps/ProjectTypeStep.svelte';
  import ClientInfoStep from './steps/ClientInfoStep.svelte';
  import ProjectDetailsStep from './steps/ProjectDetailsStep.svelte';
  import LineItemsStep from './steps/LineItemsStep.svelte';
  import TermsPricingStep from './steps/TermsPricingStep.svelte';
  import ReviewStep from './steps/ReviewStep.svelte';
  import SaveDraftButton from './SaveDraftButton.svelte';
  import ConflictDialog from './ConflictDialog.svelte';
  import WizardNavigation from './WizardNavigation.svelte';
  import ProgressBar from './ProgressBar.svelte';

  // Props
  export let proposalId: string | null = null;
  export let templateId: string | null = null;
  export let opportunityId: string | null = null;

  // Local state
  let isInitialized = false;
  let showConflictDialog = false;

  // Reactive statements
  $: step = parseInt($page.url.searchParams.get('step') || '1');
  $: if (step !== $currentStep && isInitialized) {
    handleStepChange(step);
  }

  onMount(async () => {
    try {
      // Initialize the wizard
      await initializeWizard();
      isInitialized = true;
      
      // Set initial step from URL
      if (step && step !== $currentStep) {
        proposalActions.setStep(step);
      }

      // Auto-save interval setup (handled by store)
      
    } catch (error) {
      console.error('Failed to initialize proposal wizard:', error);
      // Handle error - maybe redirect to proposals list
    }
  });

  onDestroy(() => {
    proposalActions.cleanup();
  });

  async function initializeWizard() {
    if (proposalId) {
      // Load existing proposal
      await loadExistingProposal(proposalId);
    } else {
      // Initialize new proposal
      proposalActions.initialize();
      
      // Load draft if available
      await proposalActions.loadDraft();
      
      // Apply template if specified
      if (templateId) {
        await applyTemplate(templateId);
      }
      
      // Set opportunity if specified
      if (opportunityId) {
        await linkOpportunity(opportunityId);
      }
    }
  }

  async function loadExistingProposal(id: string) {
    // This will be implemented with actual API call
    console.log('Loading proposal:', id);
  }

  async function applyTemplate(id: string) {
    // This will be implemented with actual API call
    console.log('Applying template:', id);
  }

  async function linkOpportunity(id: string) {
    // This will be implemented with actual API call
    console.log('Linking opportunity:', id);
  }

  function handleStepChange(newStep: number) {
    if (newStep >= 1 && newStep <= 6) {
      proposalActions.setStep(newStep);
      updateURL(newStep);
    }
  }

  function updateURL(step: number) {
    const url = new URL($page.url);
    url.searchParams.set('step', step.toString());
    goto(url.toString(), { replaceState: true, noScroll: true });
  }

  async function handleNext() {
    // Validate current step
    const isValid = await proposalActions.validateCurrentStep();
    
    if (isValid) {
      proposalActions.nextStep();
      updateURL($currentStep + 1);
    }
  }

  function handlePrevious() {
    proposalActions.previousStep();
    updateURL($currentStep - 1);
  }

  function handleStepClick(stepNumber: number) {
    // Allow clicking on completed steps or current step
    const targetStep = $wizardState.steps.find(s => s.id === stepNumber);
    if (targetStep && (targetStep.isComplete || stepNumber <= $currentStep)) {
      handleStepChange(stepNumber);
    }
  }

  // Handle conflict detection
  $: if ($proposalStore.conflictDetected) {
    showConflictDialog = true;
  }

  function handleConflictResolution(strategy: 'local' | 'remote' | 'merge') {
    proposalActions.resolveConflict(strategy);
    showConflictDialog = false;
  }
</script>

<!-- Main Wizard Container -->
<div class="proposal-wizard min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  <!-- Header -->
  <div class="bg-white border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-4">
          <img src="/logo.svg" alt="TrueForm" class="h-8 w-auto" />
          <div>
            <h1 class="text-xl font-semibold text-slate-900">Proposal Builder</h1>
            <p class="text-sm text-slate-500">Create professional proposals in minutes</p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <SaveDraftButton />
          
          {#if $proposalStore.lastSaved}
            <span class="text-sm text-slate-500">
              Last saved {$proposalStore.lastSaved.toLocaleTimeString()}
            </span>
          {/if}
          
          <button 
            type="button"
            class="text-slate-400 hover:text-slate-600 transition-colors"
            on:click={() => goto('/admin/proposals')}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Progress Bar -->
  <ProgressBar steps={$wizardState.steps} currentStep={$currentStep} />

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- Sidebar - Step Navigation -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div class="p-6">
            <h2 class="text-lg font-medium text-slate-900 mb-4">Steps</h2>
            <WizardNavigation 
              steps={$wizardState.steps}
              currentStep={$currentStep}
              onStepClick={handleStepClick}
            />
          </div>
          
          <!-- Quick Stats -->
          {#if $proposalStore.currentProposal?.lineItems && $proposalStore.currentProposal.lineItems.length > 0}
            <div class="border-t border-slate-200 p-6">
              <h3 class="text-sm font-medium text-slate-900 mb-3">Quick Stats</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-500">Line Items:</span>
                  <span class="text-slate-900">{$proposalStore.currentProposal.lineItems.length}</span>
                </div>
                
                {#if $proposalTotals}
                  <div class="flex justify-between">
                    <span class="text-slate-500">Subtotal:</span>
                    <span class="text-slate-900">{$proposalTotals.subtotal.format()}</span>
                  </div>
                  
                  <div class="flex justify-between">
                    <span class="text-slate-500">Total:</span>
                    <span class="font-semibold text-slate-900">{$proposalTotals.total.format()}</span>
                  </div>
                {/if}
                
                {#if $totalEstimatedHours && $totalEstimatedHours > 0}
                  <div class="flex justify-between">
                    <span class="text-slate-500">Est. Hours:</span>
                    <span class="text-slate-900">{$totalEstimatedHours}h</span>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200">
          <!-- Step Header -->
          <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">
                  {$currentStepData?.title || `Step ${$currentStep}`}
                </h2>
                <p class="text-slate-600 mt-1">
                  {$currentStepData?.description || ''}
                </p>
              </div>
              
              <div class="text-sm text-slate-500">
                Step {$currentStep} of {$wizardState.steps.length}
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="p-6">
            {#if $currentStep === 1}
              <ProjectTypeStep />
            {:else if $currentStep === 2}
              <ClientInfoStep />
            {:else if $currentStep === 3}
              <ProjectDetailsStep />
            {:else if $currentStep === 4}
              <LineItemsStep />
            {:else if $currentStep === 5}
              <TermsPricingStep />
            {:else if $currentStep === 6}
              <ReviewStep />
            {/if}
          </div>

          <!-- Navigation Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-primary-500 flex items-center space-x-2"
              class:opacity-50={!$wizardState.canGoBack}
              disabled={!$wizardState.canGoBack}
              on:click={handlePrevious}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <div class="flex items-center space-x-3">
              <!-- Save Draft for current step -->
              <SaveDraftButton size="sm" />
              
              {#if $currentStep < 6}
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 flex items-center space-x-2"
                  class:opacity-50={!$canProceed}
                  disabled={!$canProceed}
                  on:click={handleNext}
                >
                  <span>Next</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              {:else}
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 flex items-center space-x-2"
                  class:opacity-50={!$canProceed}
                  disabled={!$canProceed}
                  on:click={() => {/* Handle final submission */}}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Generate Proposal</span>
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Conflict Resolution Dialog -->
{#if showConflictDialog}
  <ConflictDialog 
    onResolve={handleConflictResolution}
    onCancel={() => showConflictDialog = false}
  />
{/if}

<!-- Loading Overlay -->
{#if $proposalStore.isLoading}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-slate-900">Loading proposal...</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .wizard-container {
    display: flex;
    max-width: 100%;
    margin: 0 auto;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .wizard-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 85vh;
  }

  .wizard-main {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .wizard-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid rgb(229, 231, 235);
    background-color: rgb(249, 250, 251);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .btn-primary {
    background-color: rgb(37, 99, 235);
    color: white;
  }

  .btn-primary:hover {
    background-color: rgb(29, 78, 216);
  }

  .btn-secondary {
    background-color: white;
    color: rgb(55, 65, 81);
    border: 1px solid rgb(209, 213, 219);
  }

  .btn-secondary:hover {
    background-color: rgb(249, 250, 251);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn.loading {
    opacity: 0.75;
  }

  .wizard-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgb(17, 24, 39);
    margin-bottom: 0.5rem;
  }

  .wizard-subtitle {
    color: rgb(107, 114, 128);
    margin-bottom: 2rem;
  }

  .error-message {
    background-color: rgb(254, 242, 242);
    border: 1px solid rgb(252, 165, 165);
    color: rgb(220, 38, 38);
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .wizard-container {
      flex-direction: column;
    }
    
    .wizard-main {
      padding: 1rem;
    }
    
    .wizard-footer {
      padding: 1rem;
    }
  }
</style> 