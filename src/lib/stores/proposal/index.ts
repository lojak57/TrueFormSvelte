/**
 * Proposal Store Barrel Export
 * Maintains backward compatibility while exposing the new modular architecture
 * Part of Phase 3 refactor - split monolithic store into data + UI stores
 */

// Export individual stores for granular access
export * from './proposalDataStore';
export * from './proposalUIStore';

// Combined exports for backward compatibility
import { 
  proposalDataStore, 
  proposalDataActions,
  currentProposal,
  lineItems,
  proposalTotals,
  totalEstimatedHours
} from './proposalDataStore';

import {
  proposalUIStore,
  proposalUIActions,
  wizardState,
  currentStep,
  currentStepData,
  isFormValid,
  canProceed,
  debouncedAutoSave,
  saveDraft,
  loadDraft,
  clearDraft
} from './proposalUIStore';

// Legacy compatibility - combined actions
export const proposalActions = {
  ...proposalDataActions,
  ...proposalUIActions,
  
  // Connect auto-save to data updates
  updateProposal: (updates: any) => {
    proposalDataActions.updateProposal(updates);
    debouncedAutoSave(); // Trigger auto-save
  },
  
  // Unified save draft with both stores
  saveDraft,
  loadDraft,
  clearDraft,
  
  // Combined reset
  reset: () => {
    proposalDataActions.reset();
    proposalUIActions.reset();
  }
};

// Export derived stores
export {
  // Data-related
  currentProposal,
  lineItems,
  proposalTotals,
  totalEstimatedHours,
  
  // UI-related
  wizardState,
  currentStep,
  currentStepData,
  isFormValid,
  canProceed,
  
  // Utilities
  debouncedAutoSave
};

// Legacy main store export - combines both stores for backward compatibility
// Note: This is a derived store that merges both data and UI state
import { derived } from 'svelte/store';

export const proposalStore = derived(
  [proposalDataStore, proposalUIStore],
  ([$dataStore, $uiStore]) => ({
    // Merge data store state
    ...$dataStore,
    
    // Merge UI store state  
    ...$uiStore,
    
    // Legacy compatibility fields
    validationErrors: $uiStore.validationErrors,
    conflictDetected: $uiStore.conflictDetected,
    conflictData: $uiStore.conflictData
  })
); 