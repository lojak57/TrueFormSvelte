/**
 * TrueForm Proposal Store
 * Centralized state management for proposal creation wizard
 * Features: Auto-save, conflict detection, wizard flow, validation
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  ProposalData, 
  LineItemData, 
  WizardState, 
  WizardStep,
  ValidationError,
  DraftData,
  ProposalTemplate,
  ClientInfo
} from '$lib/types/proposals';
import type { CurrencyCode } from '$lib/utils/money';
import { ProposalCalculator } from '$lib/utils/money';

// ============================================================================
// STORE INTERFACES
// ============================================================================

interface ProposalStoreState {
  // Core proposal data
  currentProposal: Partial<ProposalData> | null;
  selectedTemplate: ProposalTemplate | null;
  
  // Wizard state
  wizardState: WizardState;
  
  // Form validation
  validationErrors: Record<string, ValidationError[]>;
  
  // Auto-save and conflict detection
  isDirty: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  conflictDetected: boolean;
  conflictData: Partial<ProposalData> | null;
  
  // Loading states
  isLoading: boolean;
  isSavingDraft: boolean;
  isGeneratingPDF: boolean;
  
  // Currency and calculations
  calculator: ProposalCalculator;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialProposal = (): Partial<ProposalData> => ({
  clientCompany: '',
  clientContactName: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: {},
  title: '',
  description: '',
  status: 'draft',
  currencyCode: 'USD',
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  totalAmount: 0,
  paymentTerms: '50% upfront, 50% on completion',
  projectTimeline: '',
  notes: '',
  lineItems: []
});

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

const initialState: ProposalStoreState = {
  currentProposal: createInitialProposal(),
  selectedTemplate: null,
  wizardState: {
    currentStep: 1,
    steps: createWizardSteps(),
    canGoBack: false,
    canGoNext: false,
    isDirty: false,
    isLoading: false
  },
  validationErrors: {},
  isDirty: false,
  isAutoSaving: false,
  lastSaved: null,
  conflictDetected: false,
  conflictData: null,
  isLoading: false,
  isSavingDraft: false,
  isGeneratingPDF: false,
  calculator: new ProposalCalculator('USD')
};

// ============================================================================
// MAIN STORE
// ============================================================================

export const proposalStore = writable<ProposalStoreState>(initialState);

// ============================================================================
// DERIVED STORES
// ============================================================================

export const currentProposal = derived(
  proposalStore,
  $store => $store.currentProposal
);

export const wizardState = derived(
  proposalStore,
  $store => $store.wizardState
);

export const currentStep = derived(
  proposalStore,
  $store => $store.wizardState.currentStep
);

export const currentStepData = derived(
  proposalStore,
  $store => $store.wizardState.steps.find(s => s.id === $store.wizardState.currentStep)
);

export const isFormValid = derived(
  proposalStore,
  $store => Object.keys($store.validationErrors).length === 0
);

export const canProceed = derived(
  [proposalStore, isFormValid],
  ([$store, $isValid]) => $isValid && !$store.isLoading
);

export const proposalTotals = derived(
  proposalStore,
  $store => {
    if (!$store.currentProposal?.lineItems?.length) {
      return null;
    }
    
    return $store.calculator.calculateProposalTotals(
      $store.currentProposal.lineItems.map(item => ({
        unitPrice: item.unitPrice,
        quantity: item.quantity
      })),
      $store.currentProposal.taxRate || 0
    );
  }
);

export const totalEstimatedHours = derived(
  proposalStore,
  $store => {
    if (!$store.currentProposal?.lineItems?.length) {
      return 0;
    }
    
    return $store.calculator.calculateTotalHours(
      $store.currentProposal.lineItems.map(item => ({
        estimatedHours: item.estimatedHours,
        quantity: item.quantity
      }))
    );
  }
);

// ============================================================================
// ACTIONS
// ============================================================================

export const proposalActions = {
  
  // ========================================
  // INITIALIZATION
  // ========================================
  
  initialize: (proposal?: Partial<ProposalData>) => {
    proposalStore.update(state => ({
      ...state,
      currentProposal: proposal || createInitialProposal(),
      wizardState: {
        ...state.wizardState,
        currentStep: 1,
        steps: createWizardSteps()
      },
      calculator: new ProposalCalculator(proposal?.currencyCode || 'USD'),
      validationErrors: {},
      isDirty: false,
      lastSaved: null
    }));
  },

  // ========================================
  // WIZARD NAVIGATION
  // ========================================
  
  setStep: (step: number) => {
    proposalStore.update(state => {
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
    const state = get(proposalStore);
    const currentStep = state.wizardState.currentStep;
    const maxStep = state.wizardState.steps.length;
    
    if (currentStep < maxStep && state.wizardState.canGoNext) {
      proposalActions.setStep(currentStep + 1);
    }
  },

  previousStep: () => {
    const state = get(proposalStore);
    const currentStep = state.wizardState.currentStep;
    
    if (currentStep > 1) {
      proposalActions.setStep(currentStep - 1);
    }
  },

  markStepComplete: (stepId: number, isValid: boolean = true) => {
    proposalStore.update(state => ({
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

  // ========================================
  // PROPOSAL DATA UPDATES
  // ========================================
  
  updateProposal: (updates: Partial<ProposalData>) => {
    proposalStore.update(state => {
      const updatedProposal = { ...state.currentProposal, ...updates };
      
      // Update calculator if currency changed
      let calculator = state.calculator;
      if (updates.currencyCode && updates.currencyCode !== state.currentProposal?.currencyCode) {
        calculator = new ProposalCalculator(updates.currencyCode);
      }
      
      return {
        ...state,
        currentProposal: updatedProposal,
        calculator,
        isDirty: true,
        wizardState: {
          ...state.wizardState,
          isDirty: true
        }
      };
    });
    
    // Trigger auto-save
    debouncedAutoSave();
  },

  updateClientInfo: (clientInfo: Partial<ClientInfo>) => {
    proposalActions.updateProposal({
      clientCompany: clientInfo.company,
      clientContactName: clientInfo.contactName,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address
    });
  },

  addLineItem: (lineItem: Omit<LineItemData, 'id' | 'sortOrder'>) => {
    const state = get(proposalStore);
    const currentItems = state.currentProposal?.lineItems || [];
    const newSortOrder = Math.max(...currentItems.map(item => item.sortOrder || 0), 0) + 1;
    
    const newLineItem: LineItemData = {
      ...lineItem,
      id: `temp-${Date.now()}`,
      sortOrder: newSortOrder,
      totalPrice: lineItem.unitPrice * lineItem.quantity
    };
    
    proposalActions.updateProposal({
      lineItems: [...currentItems, newLineItem]
    });
  },

  updateLineItem: (id: string, updates: Partial<LineItemData>) => {
    const state = get(proposalStore);
    const currentItems = state.currentProposal?.lineItems || [];
    
    const updatedItems = currentItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        // Recalculate total price
        updated.totalPrice = updated.unitPrice * updated.quantity;
        return updated;
      }
      return item;
    });
    
    proposalActions.updateProposal({ lineItems: updatedItems });
  },

  removeLineItem: (id: string) => {
    const state = get(proposalStore);
    const currentItems = state.currentProposal?.lineItems || [];
    
    proposalActions.updateProposal({
      lineItems: currentItems.filter(item => item.id !== id)
    });
  },

  reorderLineItems: (newOrder: LineItemData[]) => {
    const reorderedItems = newOrder.map((item, index) => ({
      ...item,
      sortOrder: index + 1
    }));
    
    proposalActions.updateProposal({ lineItems: reorderedItems });
  },

  // ========================================
  // TEMPLATE OPERATIONS
  // ========================================
  
  selectTemplate: (template: ProposalTemplate) => {
    proposalStore.update(state => ({
      ...state,
      selectedTemplate: template
    }));
  },

  applyTemplate: (template: ProposalTemplate) => {
    const templateData = template.templateData;
    
    // Convert template line items to proposal line items
    const lineItems: LineItemData[] = templateData.lineItems.map((item, index) => ({
      id: `template-${index}`,
      itemType: item.itemType,
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unitType: item.unitType,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      estimatedHours: item.estimatedHours,
      complexityLevel: item.complexityLevel,
      sortOrder: item.sortOrder
    }));

    proposalActions.updateProposal({
      lineItems,
      paymentTerms: templateData.paymentTerms || '50% upfront, 50% on completion',
      projectTimeline: templateData.projectTimeline || '',
      notes: templateData.notes || '',
      currencyCode: templateData.defaultCurrency || 'USD',
      taxRate: templateData.defaultTaxRate || 0,
      templateSnapshot: template
    });

    proposalActions.selectTemplate(template);
  },

  // ========================================
  // VALIDATION
  // ========================================
  
  setValidationErrors: (field: string, errors: ValidationError[]) => {
    proposalStore.update(state => ({
      ...state,
      validationErrors: {
        ...state.validationErrors,
        [field]: errors
      }
    }));
  },

  clearValidationErrors: (field?: string) => {
    proposalStore.update(state => {
      if (field) {
        const { [field]: removed, ...rest } = state.validationErrors;
        return { ...state, validationErrors: rest };
      }
      return { ...state, validationErrors: {} };
    });
  },

  validateCurrentStep: async (): Promise<boolean> => {
    const state = get(proposalStore);
    const currentStep = state.wizardState.currentStep;
    
    // Clear existing errors
    proposalActions.clearValidationErrors();
    
    let isValid = true;
    const errors: Record<string, ValidationError[]> = {};
    
    switch (currentStep) {
      case 1: // Project Type
        // Validation will be added based on requirements
        break;
        
      case 2: // Client Information
        if (!state.currentProposal?.clientCompany?.trim()) {
          errors.clientCompany = [{ field: 'clientCompany', message: 'Company name is required' }];
          isValid = false;
        }
        
        if (!state.currentProposal?.clientContactName?.trim()) {
          errors.clientContactName = [{ field: 'clientContactName', message: 'Contact name is required' }];
          isValid = false;
        }
        
        if (!state.currentProposal?.clientEmail?.trim()) {
          errors.clientEmail = [{ field: 'clientEmail', message: 'Email is required' }];
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.currentProposal.clientEmail)) {
          errors.clientEmail = [{ field: 'clientEmail', message: 'Please enter a valid email address' }];
          isValid = false;
        }
        break;
        
      case 3: // Project Details
        if (!state.currentProposal?.title?.trim()) {
          errors.title = [{ field: 'title', message: 'Proposal title is required' }];
          isValid = false;
        }
        break;
        
      case 4: // Line Items
        if (!state.currentProposal?.lineItems?.length) {
          errors.lineItems = [{ field: 'lineItems', message: 'At least one line item is required' }];
          isValid = false;
        }
        break;
        
      case 5: // Terms & Pricing
        if (!state.currentProposal?.paymentTerms?.trim()) {
          errors.paymentTerms = [{ field: 'paymentTerms', message: 'Payment terms are required' }];
          isValid = false;
        }
        break;
    }
    
    // Set validation errors
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      proposalActions.setValidationErrors(field, fieldErrors);
    });
    
    // Mark step as complete if valid
    if (isValid) {
      proposalActions.markStepComplete(currentStep, true);
    }
    
    return isValid;
  },

  // ========================================
  // DRAFT MANAGEMENT
  // ========================================
  
  saveDraft: async (): Promise<void> => {
    const state = get(proposalStore);
    
    if (!state.isDirty) return;
    
    proposalStore.update(s => ({ ...s, isSavingDraft: true }));
    
    try {
      const draftData: DraftData = {
        wizardStep: state.wizardState.currentStep,
        proposalData: state.currentProposal || {},
        lastSaved: new Date().toISOString()
      };
      
      // API call would go here
      await saveDraftAPI(draftData);
      
      proposalStore.update(s => ({
        ...s,
        isDirty: false,
        lastSaved: new Date(),
        isSavingDraft: false,
        wizardState: { ...s.wizardState, isDirty: false }
      }));
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      proposalStore.update(s => ({ ...s, isSavingDraft: false }));
      throw error;
    }
  },

  loadDraft: async (): Promise<void> => {
    proposalStore.update(s => ({ ...s, isLoading: true }));
    
    try {
      // API call would go here
      const draftData = await loadDraftAPI();
      
      if (draftData) {
        proposalActions.initialize(draftData.proposalData);
        proposalActions.setStep(draftData.wizardStep);
      }
      
    } catch (error) {
      console.error('Failed to load draft:', error);
    } finally {
      proposalStore.update(s => ({ ...s, isLoading: false }));
    }
  },

  clearDraft: async (): Promise<void> => {
    try {
      // API call would go here
      await clearDraftAPI();
      
      proposalActions.initialize();
      
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  },

  // ========================================
  // CONFLICT RESOLUTION
  // ========================================
  
  detectConflict: (remoteData: Partial<ProposalData>) => {
    proposalStore.update(state => ({
      ...state,
      conflictDetected: true,
      conflictData: remoteData
    }));
  },

  resolveConflict: (strategy: 'local' | 'remote' | 'merge') => {
    const state = get(proposalStore);
    
    if (!state.conflictData) return;
    
    switch (strategy) {
      case 'local':
        // Keep local data, just clear conflict
        break;
        
      case 'remote':
        // Use remote data
        proposalActions.updateProposal(state.conflictData);
        break;
        
      case 'merge':
        // Implement merge logic here
        // For now, just use remote data
        proposalActions.updateProposal(state.conflictData);
        break;
    }
    
    proposalStore.update(s => ({
      ...s,
      conflictDetected: false,
      conflictData: null
    }));
  },

  // ========================================
  // RESET & CLEANUP
  // ========================================
  
  reset: () => {
    proposalStore.set(initialState);
  },

  cleanup: () => {
    // Cancel any pending auto-saves
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = null;
    }
  }
};

// ============================================================================
// AUTO-SAVE FUNCTIONALITY
// ============================================================================

let autoSaveTimeout: NodeJS.Timeout | null = null;

const debouncedAutoSave = () => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(async () => {
    try {
      await proposalActions.saveDraft();
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 30000); // 30 seconds
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

// Default export
export default proposalStore; 