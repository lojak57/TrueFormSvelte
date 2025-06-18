// Site Request Wizard Types
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

// Individual step data types for better type safety
export interface BasicInfoData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  companySize: string;
}

export interface ProjectVisionData {
  projectDescription: string;
  primaryGoals: string[];
  targetAudience: string;
  successMetrics: string[];
  competitorExamples: string;
}

export interface ProjectTypeData {
  websiteType: string;
  platformType: string;
  coreFeatures: string[];
  advancedFeatures: string[];
  integrations: string[];
}

export interface DesignBrandingData {
  designMood: string[];
  colorPalette: string;
  typography: string;
  visualStyle: string;
  hasLogo: boolean;
  hasBrandGuidelines: boolean;
  logoFile: File | null;
  brandFiles: File[];
  inspirationFiles: File[];
}

export interface ContentStructureData {
  pageStructure: string[];
  contentSections: string[];
  copywriting: string;
  mediaRequirements: string[];
}

export interface UserExperienceData {
  userJourney: string;
  keyInteractions: string[];
  responsiveRequirements: string[];
  performanceRequirements: string[];
}

export interface TechnicalRequirementsData {
  hostingPreference: string;
  domainStatus: string;
  analyticsRequirements: string[];
  securityRequirements: string[];
}

export interface TimelineBudgetData {
  timeline: string;
  budgetRange: string;
  launchDate: string;
  additionalRequirements: string;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: FieldValidationError[];
}

export interface FieldValidationError {
  field: keyof SiteRequestFormData;
  message: string;
  value?: unknown;
}

// Step component event types
export interface StepValidationEvent {
  isValid: boolean;
  errors?: FieldValidationError[];
}
