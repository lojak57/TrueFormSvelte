/**
 * Proposal Data Store
 * Handles: Core proposal data, line items, calculations, templates
 * Part of Phase 3 refactor from monolithic proposalStore.ts
 */

import { writable, derived } from 'svelte/store';
import type { 
  ProposalData, 
  LineItemData, 
  ProposalTemplate,
  ClientInfo
} from '$lib/types/proposals';
import { ProposalCalculator } from '$lib/utils/money/proposalCalculator';

// ============================================================================
// INTERFACES
// ============================================================================

interface ProposalDataState {
  currentProposal: Partial<ProposalData> | null;
  selectedTemplate: ProposalTemplate | null;
  calculator: ProposalCalculator;
  isDirty: boolean;
  lastSaved: Date | null;
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

const initialState: ProposalDataState = {
  currentProposal: createInitialProposal(),
  selectedTemplate: null,
  calculator: new ProposalCalculator('USD'),
  isDirty: false,
  lastSaved: null
};

// ============================================================================
// STORE & DERIVED STORES
// ============================================================================

export const proposalDataStore = writable<ProposalDataState>(initialState);

export const currentProposal = derived(
  proposalDataStore,
  $store => $store.currentProposal
);

export const lineItems = derived(
  proposalDataStore,
  $store => $store.currentProposal?.lineItems || []
);

export const proposalTotals = derived(
  proposalDataStore,
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
  proposalDataStore,
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

export const proposalDataActions = {
  
  initialize: (proposal?: Partial<ProposalData>) => {
    proposalDataStore.update(state => ({
      ...state,
      currentProposal: proposal || createInitialProposal(),
      calculator: new ProposalCalculator(proposal?.currencyCode || 'USD'),
      isDirty: false,
      lastSaved: null
    }));
  },

  updateProposal: (updates: Partial<ProposalData>) => {
    proposalDataStore.update(state => {
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
        isDirty: true
      };
    });
  },

  updateClientInfo: (clientInfo: Partial<ClientInfo>) => {
    proposalDataActions.updateProposal({
      clientCompany: clientInfo.company,
      clientContactName: clientInfo.contactName,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address
    });
  },

  addLineItem: (lineItem: Omit<LineItemData, 'id' | 'sortOrder'>) => {
    proposalDataStore.update(state => {
      const currentItems = state.currentProposal?.lineItems || [];
      const newSortOrder = Math.max(...currentItems.map(item => item.sortOrder || 0), 0) + 1;
      
      const newLineItem: LineItemData = {
        ...lineItem,
        id: `temp-${Date.now()}`,
        sortOrder: newSortOrder,
        totalPrice: lineItem.unitPrice * lineItem.quantity
      };
      
      const updatedProposal = {
        ...state.currentProposal,
        lineItems: [...currentItems, newLineItem]
      };
      
      return {
        ...state,
        currentProposal: updatedProposal,
        isDirty: true
      };
    });
  },

  updateLineItem: (id: string, updates: Partial<LineItemData>) => {
    proposalDataStore.update(state => {
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
      
      return {
        ...state,
        currentProposal: { ...state.currentProposal, lineItems: updatedItems },
        isDirty: true
      };
    });
  },

  removeLineItem: (id: string) => {
    proposalDataStore.update(state => {
      const currentItems = state.currentProposal?.lineItems || [];
      
      return {
        ...state,
        currentProposal: {
          ...state.currentProposal,
          lineItems: currentItems.filter(item => item.id !== id)
        },
        isDirty: true
      };
    });
  },

  reorderLineItems: (newOrder: LineItemData[]) => {
    const reorderedItems = newOrder.map((item, index) => ({
      ...item,
      sortOrder: index + 1
    }));
    
    proposalDataActions.updateProposal({ lineItems: reorderedItems });
  },

  selectTemplate: (template: ProposalTemplate) => {
    proposalDataStore.update(state => ({
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

    proposalDataActions.updateProposal({
      lineItems,
      paymentTerms: templateData.paymentTerms || '50% upfront, 50% on completion',
      projectTimeline: templateData.projectTimeline || '',
      notes: templateData.notes || '',
      currencyCode: templateData.defaultCurrency || 'USD',
      taxRate: templateData.defaultTaxRate || 0,
      templateSnapshot: template
    });

    proposalDataActions.selectTemplate(template);
  },

  markSaved: () => {
    proposalDataStore.update(state => ({
      ...state,
      isDirty: false,
      lastSaved: new Date()
    }));
  },

  reset: () => {
    proposalDataStore.set(initialState);
  }
}; 