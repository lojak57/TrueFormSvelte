/**
 * TrueForm Types - Barrel Export
 * 
 * Centralized export for all type definitions.
 * Import types from this single location: `import type { UserSession } from '$lib/types'`
 */

// ============================================================================
// DATABASE TYPES
// ============================================================================
export type {
  // User & Authentication
  UserSession,
  LoginCredentials,
  AuthResponse,
  
  // Organization & Branding
  Organization,
  BrandKit,
  
  // Leads & Opportunities
  BaseformLead,
  BaseformOpportunity,
  TrueFormLead,
  Contact,
  
  // Proposals
  Proposal,
  ProposalDraft,
  DraftData,
  
  // Billing & Payments
  Invoice,
  
  // Settings & Configuration
  CurrencyCode,
  OrganizationProposalSettings,
  
  // Utility Types
  DatabaseInsert,
  DatabaseUpdate,
  SupabaseResponse,
  SupabaseListResponse,
} from './database.types';

// Export database constants
export { DATABASE_TABLES } from './database.types';

// ============================================================================
// WIZARD TYPES
// ============================================================================
export type {
  // Wizard Steps
  WizardStepId,
  WizardStep,
  
  // Form Data
  WizardFormData,
  
  // Features
  WizardFeature,
  FeatureCategory,
  
  // UI State
  WizardUIState,
  
  // Validation
  WizardValidationResult,
  WizardStepValidation,
  
  // Actions & Events
  WizardAction,
  
  // Configuration
  WizardConfiguration,
  WizardPricingConfig,
  
  // Store
  WizardStore,
} from './wizard.types';

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================
export type {
  // Button
  ButtonVariant,
  ButtonSize,
  ButtonProps,
  
  // Card
  CardVariant,
  CardProps,
  
  // Form & Input
  InputType,
  InputSize,
  InputState,
  InputProps,
  SelectOption,
  SelectProps,
  
  // Layout & Navigation
  NavItem,
  BreadcrumbItem,
  ModalProps,
  
  // Data Display
  TableColumn,
  TableProps,
  PaginationProps,
  
  // Feedback & Status
  AlertType,
  ToastType,
  AlertProps,
  ToastProps,
  LoadingProps,
  
  // Theme & Styling
  ThemeMode,
  ThemeColors,
  BreakpointConfig,
  
  // Animation & Transition
  TransitionType,
  TransitionProps,
  
  // Icon & Media
  IconSize,
  IconProps,
  ImageProps,
  
  // Event Handlers
  ClickHandler,
  KeyboardHandler,
  FormSubmitHandler,
  InputChangeHandler,
  
  // Responsive & Accessibility
  ResponsiveValue,
  AccessibilityProps,
} from './ui.types';

// ============================================================================
// RE-EXPORT COMMON UTILITY TYPES
// ============================================================================

// Common utility types that are frequently used
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

// API Response wrapper types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// TYPE GUARDS & UTILITIES
// ============================================================================

// Type guard utilities
export const isNotNull = <T>(value: T | null): value is T => value !== null;
export const isNotUndefined = <T>(value: T | undefined): value is T => value !== undefined;
export const isDefined = <T>(value: T | null | undefined): value is T => 
  value !== null && value !== undefined;

// ============================================================================
// VALIDATION SCHEMA TYPES (for Phase 2.2)
// ============================================================================

// Placeholder for validation schema types that will be defined in Phase 2.2
export interface ValidationSchema<T = any> {
  schema: any; // Will be properly typed when Zod schemas are implemented
  parse: (data: unknown) => T;
  safeParse: (data: unknown) => { success: boolean; data?: T; error?: any };
} 