/**
 * Proposal UI Store  
 * Handles: Wizard navigation, validation, loading states, auto-save, drafts
 * Part of Phase 3 refactor from monolithic proposalStore.ts
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  WizardState, 
  WizardStep,
  ValidationError,
  DraftData
} from '$lib/types/proposals';
import { proposalDataStore, proposalDataActions } from './proposalDataStore';

// ============================================================================
// INTERFACES
// ============================================================================

interface ProposalUIState {
  // Wizard state
  wizardState: WizardState;
  
  // Form validation
  validationErrors: Record<string, ValidationError[]>;
  
  // Auto-save and conflict detection
  isAutoSaving: boolean;
  conflictDetected: boolean;
  conflictData: any;
  
  // Loading states
  isLoading: boolean;
  isSavingDraft: boolean;
  isGeneratingPDF: boolean;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const createWizardSteps = (): WizardStep[] => [
  {
    id: 1,
    title: 'Project Type',
    description: 'Choose your project type and template',
    isComplete: false,
    isValid: false
  },
  {
    id: 2,
    title: 'Client Information', 
    description: 'Enter client details and contact information',
    isComplete: false,
    isValid: false
  },
  {
    id: 3,
    title: 'Project Details',
    description: 'Define project scope and requirements',
    isComplete: false,
    isValid: false
  },
  {
    id: 4,
    title: 'Line Items',
    description: 'Build your detailed service breakdown',
    isComplete: false,
    isValid: false
  },
  {
    id: 5,
    title: 'Terms & Pricing',
    description: 'Set payment terms and final pricing',
    isComplete: false,
    isValid: false
  },
  {
    id: 6,
    title: 'Review & Generate',
    description: 'Review and generate your proposal',
    isComplete: false,
    isValid: false
  }
];

const initialState: ProposalUIState = {
  wizardState: {
    currentStep: 1,
    steps: createWizardSteps(),
    canGoBack: false,
    canGoNext: false,
    isDirty: false,
    isLoading: false
  },
  validationErrors: {},
  isAutoSaving: false,
  conflictDetected: false,
  conflictData: null,
  isLoading: false,
  isSavingDraft: false,
  isGeneratingPDF: false
};

// ============================================================================
// STORE & DERIVED STORES
// ============================================================================

export const proposalUIStore = writable<ProposalUIState>(initialState);

export const wizardState = derived(
  proposalUIStore,
  $store => $store.wizardState
);

export const currentStep = derived(
  proposalUIStore,
  $store => $store.wizardState.currentStep
);

export const currentStepData = derived(
  proposalUIStore,
  $store => $store.wizardState.steps.find(s => s.id === $store.wizardState.currentStep)
);

export const isFormValid = derived(
  proposalUIStore,
  $store => Object.keys($store.validationErrors).length === 0
);

export const canProceed = derived(
  [proposalUIStore, isFormValid],
  ([$store, $isValid]) => $isValid && !$store.isLoading
);

// ============================================================================
// ACTIONS
// ============================================================================

export const proposalUIActions = {
  
  setStep: (step: number) => {
    proposalUIStore.update(state => {
      const steps = state.wizardState.steps;
      const canGoBack = step > 1;
      const canGoNext = step < steps.length && steps[step - 1]?.isValid;
      
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          currentStep: step,
          canGoBack,
          canGoNext
        }
      };
    });
  },

  nextStep: () => {
    const state = get(proposalUIStore);
    const currentStep = state.wizardState.currentStep;
    const maxStep = state.wizardState.steps.length;
    
    if (currentStep < maxStep && state.wizardState.canGoNext) {
      proposalUIActions.setStep(currentStep + 1);
    }
  },

  previousStep: () => {
    const state = get(proposalUIStore);
    const currentStep = state.wizardState.currentStep;
    
    if (currentStep > 1) {
      proposalUIActions.setStep(currentStep - 1);
    }
  },

  markStepComplete: (stepId: number, isValid: boolean = true) => {
    proposalUIStore.update(state => ({
      ...state,
      wizardState: {
        ...state.wizardState,
        steps: state.wizardState.steps.map(step => 
          step.id === stepId 
            ? { ...step, isComplete: true, isValid }
            : step
        )
      }
    }));
  },

  setValidationErrors: (field: string, errors: ValidationError[]) => {
    proposalUIStore.update(state => ({
      ...state,
      validationErrors: {
        ...state.validationErrors,
        [field]: errors
      }
    }));
  },

  clearValidationErrors: (field?: string) => {
    proposalUIStore.update(state => {
      if (field) {
        const { [field]: removed, ...rest } = state.validationErrors;
        return { ...state, validationErrors: rest };
      }
      return { ...state, validationErrors: {} };
    });
  },

  validateCurrentStep: async (): Promise<boolean> => {
    const uiState = get(proposalUIStore);
    const dataState = get(proposalDataStore);
    const currentStep = uiState.wizardState.currentStep;
    
    // Clear existing errors
    proposalUIActions.clearValidationErrors();
    
    let isValid = true;
    const errors: Record<string, ValidationError[]> = {};
    
    switch (currentStep) {
      case 1: // Project Type
        // Validation will be added based on requirements
        break;
        
      case 2: // Client Information
        if (!dataState.currentProposal?.clientCompany?.trim()) {
          errors.clientCompany = [{ field: 'clientCompany', message: 'Company name is required' }];
          isValid = false;
        }
        
        if (!dataState.currentProposal?.clientContactName?.trim()) {
          errors.clientContactName = [{ field: 'clientContactName', message: 'Contact name is required' }];
          isValid = false;
        }
        
        if (!dataState.currentProposal?.clientEmail?.trim()) {
          errors.clientEmail = [{ field: 'clientEmail', message: 'Email is required' }];
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataState.currentProposal.clientEmail)) {
          errors.clientEmail = [{ field: 'clientEmail', message: 'Please enter a valid email address' }];
          isValid = false;
        }
        break;
        
      case 3: // Project Details
        if (!dataState.currentProposal?.title?.trim()) {
          errors.title = [{ field: 'title', message: 'Proposal title is required' }];
          isValid = false;
        }
        break;
        
      case 4: // Line Items
        if (!dataState.currentProposal?.lineItems?.length) {
          errors.lineItems = [{ field: 'lineItems', message: 'At least one line item is required' }];
          isValid = false;
        }
        break;
        
      case 5: // Terms & Pricing
        if (!dataState.currentProposal?.paymentTerms?.trim()) {
          errors.paymentTerms = [{ field: 'paymentTerms', message: 'Payment terms are required' }];
          isValid = false;
        }
        break;
    }
    
    // Set validation errors
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      proposalUIActions.setValidationErrors(field, fieldErrors);
    });
    
    // Mark step as complete if valid
    if (isValid) {
      proposalUIActions.markStepComplete(currentStep, true);
    }
    
    return isValid;
  },

  setLoading: (loading: boolean) => {
    proposalUIStore.update(state => ({
      ...state,
      isLoading: loading
    }));
  },

  setSavingDraft: (saving: boolean) => {
    proposalUIStore.update(state => ({
      ...state,
      isSavingDraft: saving
    }));
  },

  setGeneratingPDF: (generating: boolean) => {
    proposalUIStore.update(state => ({
      ...state,
      isGeneratingPDF: generating
    }));
  },

  detectConflict: (conflictData: any) => {
    proposalUIStore.update(state => ({
      ...state,
      conflictDetected: true,
      conflictData
    }));
  },

  resolveConflict: (strategy: 'local' | 'remote' | 'merge') => {
    const state = get(proposalUIStore);
    
    if (!state.conflictData) return;
    
    switch (strategy) {
      case 'local':
        // Keep local data, just clear conflict
        break;
        
      case 'remote':
        // Use remote data
        proposalDataActions.updateProposal(state.conflictData);
        break;
        
      case 'merge':
        // Implement merge logic here
        proposalDataActions.updateProposal(state.conflictData);
        break;
    }
    
    proposalUIStore.update(s => ({
      ...s,
      conflictDetected: false,
      conflictData: null
    }));
  },

  reset: () => {
    proposalUIStore.set(initialState);
  }
};

// ============================================================================
// AUTO-SAVE FUNCTIONALITY
// ============================================================================

let autoSaveTimeout: NodeJS.Timeout | null = null;

export const debouncedAutoSave = () => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(async () => {
    try {
      await saveDraft();
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 30000); // 30 seconds
};

// ============================================================================
// DRAFT MANAGEMENT
// ============================================================================

export const saveDraft = async (): Promise<void> => {
  const uiState = get(proposalUIStore);
  const dataState = get(proposalDataStore);
  
  if (!dataState.isDirty) return;
  
  proposalUIActions.setSavingDraft(true);
  
  try {
    const draftData: DraftData = {
      wizardStep: uiState.wizardState.currentStep,
      proposalData: dataState.currentProposal || {},
      lastSaved: new Date().toISOString()
    };
    
    // API call would go here
    await saveDraftAPI(draftData);
    
    proposalDataActions.markSaved();
    proposalUIActions.setSavingDraft(false);
    
  } catch (error) {
    console.error('Failed to save draft:', error);
    proposalUIActions.setSavingDraft(false);
    throw error;
  }
};

export const loadDraft = async (): Promise<void> => {
  proposalUIActions.setLoading(true);
  
  try {
    // API call would go here
    const draftData = await loadDraftAPI();
    
    if (draftData) {
      proposalDataActions.initialize(draftData.proposalData);
      proposalUIActions.setStep(draftData.wizardStep);
    }
    
  } catch (error) {
    console.error('Failed to load draft:', error);
  } finally {
    proposalUIActions.setLoading(false);
  }
};

export const clearDraft = async (): Promise<void> => {
  try {
    // API call would go here
    await clearDraftAPI();
    
    proposalDataActions.reset();
    proposalUIActions.reset();
    
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

// ============================================================================
// API PLACEHOLDERS
// ============================================================================

async function saveDraftAPI(draftData: DraftData): Promise<void> {
  // This will be implemented with actual API calls
  console.log('Saving draft:', draftData);
}

async function loadDraftAPI(): Promise<DraftData | null> {
  // This will be implemented with actual API calls
  console.log('Loading draft');
  return null;
}

async function clearDraftAPI(): Promise<void> {
  // This will be implemented with actual API calls
  console.log('Clearing draft');
} 