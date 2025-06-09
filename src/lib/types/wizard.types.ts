/**
 * Wizard Types - Enhanced for SiteRequestWizard
 * Part of Phase 3 refactor - centralized wizard type definitions
 */

// ============================================================================
// WIZARD STEP TYPES
// ============================================================================

export type WizardStepId = 
  | 'introduction' 
  | 'basic-info' 
  | 'features' 
  | 'design' 
  | 'timeline' 
  | 'budget' 
  | 'summary';

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isValid: boolean;
  isOptional?: boolean;
}

// ============================================================================
// WIZARD FORM DATA STRUCTURE
// ============================================================================

export interface SiteRequestFormData {
  // Step 1: Basic Information
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  companySize: string;
  
  // Step 2: Project Vision & Goals
  projectDescription: string;
  primaryGoals: string[];
  targetAudience: string;
  successMetrics: string[];
  competitorExamples: string;
  
  // Step 3: Website Type & Features
  websiteType: string;
  platformType: string;
  coreFeatures: string[];
  advancedFeatures: string[];
  integrations: string[];
  
  // Step 4: Design & Branding
  designMood: string[];
  colorPalette: string;
  typography: string;
  visualStyle: string;
  hasLogo: boolean;
  hasBrandGuidelines: boolean;
  logoFile: File | null;
  brandFiles: File[];
  
  // Step 5: Content & Structure
  pageStructure: string[];
  contentSections: string[];
  copywriting: string;
  mediaRequirements: string[];
  
  // Step 6: Functionality & User Experience
  userJourney: string;
  keyInteractions: string[];
  responsiveRequirements: string[];
  performanceRequirements: string[];
  
  // Step 7: Technical Requirements
  hostingPreference: string;
  domainStatus: string;
  analyticsRequirements: string[];
  securityRequirements: string[];
  
  // Step 8: Timeline & Additional Info
  timeline: string;
  budgetRange: string;
  launchDate: string;
  additionalRequirements: string;
  inspirationFiles: File[];
}

// ============================================================================
// FEATURE SELECTION TYPES
// ============================================================================

export interface WizardFeature {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'enterprise';
  included: boolean;
  addOnCost?: number;
  icon?: string;
  isEnterprise?: boolean;
}

export type FeatureCategory = 'basic' | 'advanced' | 'enterprise';

// ============================================================================
// WIZARD UI STATE TYPES
// ============================================================================

export interface WizardUIState {
  isLoading: boolean;
  isDirty: boolean;
  validationErrors: Record<string, string[]>;
  showAdvancedOptions: boolean;
  autoSaveEnabled: boolean;
  lastAutoSaveAt?: string;
}

// ============================================================================
// WIZARD VALIDATION TYPES
// ============================================================================

export interface WizardValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

export interface WizardStepValidator {
  validate(data: Partial<SiteRequestFormData>): WizardValidationResult;
  getRequiredFields(): string[];
}

// ============================================================================
// WIZARD EVENTS & ACTIONS
// ============================================================================

export type WizardAction = 
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GOTO_STEP'; stepId: WizardStepId }
  | { type: 'UPDATE_FIELD'; field: string; value: any }
  | { type: 'TOGGLE_FEATURE'; featureId: string }
  | { type: 'SAVE_DRAFT' }
  | { type: 'LOAD_DRAFT'; draftId: string }
  | { type: 'SUBMIT_WIZARD' }
  | { type: 'RESET_WIZARD' };

// ============================================================================
// WIZARD CONFIGURATION
// ============================================================================

export interface WizardConfiguration {
  steps: WizardStep[];
  features: WizardFeature[];
  pricing: WizardPricingConfig;
  validation: WizardStepValidator[];
  ui: {
    theme: 'light' | 'dark';
    showProgressBar: boolean;
    enableKeyboardNavigation: boolean;
    autoSaveInterval: number; // milliseconds
  };
}

export interface WizardPricingConfig {
  basePrices: Record<string, number>;
  featureAddOns: Record<string, number>;
  discounts: Record<string, number>;
  taxRate: number;
}

// ============================================================================
// WIZARD STORE TYPES (for Svelte stores)
// ============================================================================

export interface WizardStore {
  formData: SiteRequestFormData;
  uiState: WizardUIState;
  configuration: WizardConfiguration;
}

// ============================================================================
// SiteRequestWizard specific types
// ============================================================================

export interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  canGoBack: boolean;
  canGoNext: boolean;
  isDirty: boolean;
  isLoading: boolean;
}

// Option interfaces for form choices
export interface WizardOption {
  name: string;
  icon?: string;
  description: string;
  category?: string;
  premium?: boolean;
  color?: string;
  complexity?: string;
  timeframe?: string;
}

export interface WizardIconOption {
  name: string;
  icon: any; // Lucide icon component
  description: string;
  color?: string;
}

// Step-specific interfaces
export interface BasicInfoStep {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  companySize: string;
}

export interface ProjectVisionStep {
  projectDescription: string;
  primaryGoals: string[];
  targetAudience: string;
  successMetrics: string[];
  competitorExamples: string;
}

export interface WebsiteTypeStep {
  websiteType: string;
  platformType: string;
  coreFeatures: string[];
  advancedFeatures: string[];
  integrations: string[];
}

export interface DesignBrandingStep {
  designMood: string[];
  colorPalette: string;
  typography: string;
  visualStyle: string;
  hasLogo: boolean;
  hasBrandGuidelines: boolean;
  logoFile: File | null;
  brandFiles: File[];
}

export interface ContentStructureStep {
  pageStructure: string[];
  contentSections: string[];
  copywriting: string;
  mediaRequirements: string[];
}

export interface UserExperienceStep {
  userJourney: string;
  keyInteractions: string[];
  responsiveRequirements: string[];
  performanceRequirements: string[];
}

export interface TechnicalRequirementsStep {
  hostingPreference: string;
  domainStatus: string;
  analyticsRequirements: string[];
  securityRequirements: string[];
}

export interface TimelineBudgetStep {
  timeline: string;
  budgetRange: string;
  launchDate: string;
  additionalRequirements: string;
  inspirationFiles: File[];
}

// Wizard event types
export interface WizardStepChangeEvent {
  step: number;
  direction: 'next' | 'previous';
  data: Partial<SiteRequestFormData>;
}

export interface WizardSubmitEvent {
  formData: SiteRequestFormData;
  opportunity?: any;
  contact?: any;
}

// File upload types
export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error?: string;
  preview?: string;
}

export interface WizardFileUpload {
  type: 'logo' | 'brand' | 'inspiration';
  files: File[];
  state: FileUploadState;
} 