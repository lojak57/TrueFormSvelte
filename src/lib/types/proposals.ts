/**
 * TrueForm Proposal System Types
 * Comprehensive type definitions for the proposal generator
 */

import type { Money, CurrencyCode } from '$lib/utils/money';

// ============================================================================
// BASE TYPES
// ============================================================================

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
export type LineItemType = 'development' | 'design' | 'consultation' | 'hosting' | 'maintenance' | 'other';
export type ComplexityLevel = 'simple' | 'medium' | 'complex';
export type UnitType = 'hours' | 'days' | 'each' | 'project';

// ============================================================================
// CLIENT INFORMATION
// ============================================================================

export interface ClientAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface ClientInfo {
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: ClientAddress;
  notes?: string;
}

// ============================================================================
// LINE ITEMS
// ============================================================================

export interface LineItemData {
  id?: string;
  itemType: LineItemType;
  title: string;
  description?: string;
  quantity: number;
  unitType: UnitType;
  unitPrice: number;
  totalPrice: number;
  estimatedHours?: number;
  complexityLevel?: ComplexityLevel;
  sortOrder: number;
  
  // AI assistance tracking
  llmGenerated?: boolean;
  llmVersion?: string;
  llmPromptHash?: string;
}

export interface LineItem extends LineItemData {
  id: string;
  proposalId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PROPOSALS
// ============================================================================

export interface ProposalData {
  // IDs and relationships
  id?: string;
  organizationId?: string;
  opportunityId?: string;
  proposalNumber?: string;
  
  // Client information
  clientCompany: string;
  clientContactName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: ClientAddress;
  
  // Proposal details
  title: string;
  description?: string;
  status: ProposalStatus;
  
  // Financial information
  currencyCode: CurrencyCode;
  subtotal: number;
  taxRate: number;
  taxJurisdiction?: string;
  taxAmount: number;
  totalAmount: number;
  
  // Terms and conditions
  paymentTerms: string;
  projectTimeline?: string;
  validUntil?: string; // ISO date string
  notes?: string;
  
  // Template information
  templateSnapshot?: ProposalTemplate;
  
  // Line items
  lineItems?: LineItemData[];
}

export interface Proposal extends Required<ProposalData> {
  id: string;
  organizationId: string;
  proposalNumber: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  pdfUrl?: string;
  pdfHtmlSnapshot?: string;
  sentAt?: string;
  acceptedAt?: string;
  version: number;
  lineItems: LineItem[];
}

// ============================================================================
// TEMPLATES
// ============================================================================

export interface TemplateLineItem {
  itemType: LineItemType;
  title: string;
  description?: string;
  quantity: number;
  unitType: UnitType;
  unitPrice: number;
  complexityLevel?: ComplexityLevel;
  estimatedHours?: number;
  sortOrder: number;
}

export interface TemplateData {
  lineItems: TemplateLineItem[];
  paymentTerms?: string;
  projectTimeline?: string;
  notes?: string;
  defaultCurrency?: CurrencyCode;
  defaultTaxRate?: number;
}

export interface ProposalTemplate {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  category: string;
  templateData: TemplateData;
  usageCount: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ============================================================================
// DRAFTS
// ============================================================================

export interface DraftData {
  wizardStep: number;
  proposalData: Partial<ProposalData>;
  lastSaved?: string;
}

export interface ProposalDraft {
  id: string;
  organizationId: string;
  userId: string;
  draftData: DraftData;
  wizardStep: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// WIZARD STEPS
// ============================================================================

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isValid: boolean;
  errors?: string[];
}

export interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  canGoBack: boolean;
  canGoNext: boolean;
  isDirty: boolean;
  isLoading: boolean;
  lastSaved?: Date;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// PDF GENERATION
// ============================================================================

export interface PDFGenerationOptions {
  template?: 'default' | 'modern' | 'minimal' | 'corporate';
  includeAttachments?: boolean;
  includeHtmlSnapshot: boolean;
  watermark?: string;
  branding?: {
    logoUrl?: string;
    companyName?: string;
    primaryColor?: string;
    fontFamily?: string;
  };
  orientation?: 'portrait' | 'landscape';
  format?: 'A4' | 'Letter' | 'Legal';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  headerFooter?: {
    displayHeader?: boolean;
    displayFooter?: boolean;
    customHeader?: string;
    customFooter?: string;
  };
}

export interface PDFGenerationResult {
  pdfBytes: Uint8Array;
  pdfUrl?: string;
  htmlSnapshot?: string;
  generatedAt: string;
}

// ============================================================================
// ANALYTICS & METRICS
// ============================================================================

export interface ProposalMetrics {
  month: string;
  organizationId: string;
  currencyCode: CurrencyCode;
  totalProposals: number;
  acceptedProposals: number;
  conversionRate: number;
  avgProposalValue: number;
  revenue: number;
  avgDaysToClose?: number;
  draftCount: number;
  sentCount: number;
  viewedCount: number;
}

export interface LineItemAnalytics {
  itemType: LineItemType;
  complexityLevel?: ComplexityLevel;
  organizationId: string;
  usageCount: number;
  avgUnitPrice: number;
  avgEstimatedHours?: number;
  acceptedCount: number;
  successRate: number;
  totalValue: number;
  acceptedValue: number;
}

export interface ClientAnalytics {
  clientCompany: string;
  clientEmail: string;
  organizationId: string;
  proposalCount: number;
  totalValue: number;
  lifetimeValue: number;
  lastProposalDate: string;
  firstProposalDate: string;
  proposalStatuses: ProposalStatus[];
  avgProposalValue: number;
  conversionRate: number;
}

export interface TemplateAnalytics {
  id: string;
  name: string;
  category: string;
  organizationId: string;
  usageCount: number;
  proposalsCreated: number;
  successfulProposals: number;
  templateSuccessRate: number;
  avgProposalValue: number;
  revenueGenerated: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

export interface ProposalSearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProposalStatus;
  clientCompany?: string;
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
  currencyCode?: CurrencyCode;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'clientCompany' | 'totalValue';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// FORM STATES
// ============================================================================

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// ============================================================================
// NOTIFICATIONS & EVENTS
// ============================================================================

export interface ProposalEvent {
  type: 'created' | 'updated' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  proposalId: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  emailOnProposalViewed: boolean;
  emailOnProposalAccepted: boolean;
  emailOnProposalDeclined: boolean;
  emailOnProposalExpired: boolean;
  reminderDaysBefore: number;
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface OpportunityIntegration {
  opportunityId: string;
  name: string;
  company: string;
  contactEmail: string;
  value?: number;
  stage: string;
  probability?: number;
  notes?: string;
}

export interface ContactIntegration {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
}

// ============================================================================
// SETTINGS & CONFIGURATION
// ============================================================================

export interface OrganizationProposalSettings {
  defaultCurrency: CurrencyCode;
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  defaultProjectTimeline: string;
  proposalValidityDays: number;
  requireApprovalForSending: boolean;
  autoSaveDraftInterval: number; // seconds
  brandingOptions: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

// API Request/Response Types
export interface CreateProposalRequest {
  title?: string;
  description?: string;
  clientCompany?: string;
  clientContactName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: ClientAddress;
  projectTimeline?: string;
  paymentTerms?: string;
  currencyCode?: CurrencyCode;
  taxRate?: number;
  taxJurisdiction?: string;
  validUntil?: string;
  notes?: string;
  lineItems?: LineItemData[];
  templateId?: string;
}

export interface UpdateProposalRequest extends Partial<CreateProposalRequest> {
  lastModified?: string;
  version?: number;
}

// Analytics Types
export interface ProposalAnalytics {
  totalProposals: number;
  totalValue: Money;
  averageValue: Money;
  acceptedProposals: number;
  rejectedProposals: number;
  pendingProposals: number;
  conversionRate: number;
  monthlyTrends: Array<{
    month: string;
    proposalCount: number;
    totalValue: Money;
    conversionRate: number;
  }>;
  topClients: Array<{
    clientCompany: string;
    proposalCount: number;
    totalValue: Money;
    conversionRate: number;
  }>;
  serviceBreakdown: Array<{
    itemType: LineItemType;
    count: number;
    totalValue: Money;
    averageValue: Money;
  }>;
  geographicDistribution: Array<{
    country: string;
    proposalCount: number;
    totalValue: Money;
  }>;
}

export interface TemplateAnalytics {
  templateId: string;
  templateName: string;
  usageCount: number;
  averageValue: Money;
  totalValue: Money;
  conversionRate: number;
  lastUsed: string;
  popularLineItems: Array<{
    title: string;
    usageCount: number;
    averagePrice: Money;
  }>;
} 