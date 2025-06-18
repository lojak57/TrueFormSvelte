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
  AuthResponse,
  // Leads & Opportunities
  BaseformLead,
  BaseformOpportunity,
  BrandKit,
  Contact,
  // Settings & Configuration
  CurrencyCode,
  // Utility Types
  DatabaseInsert,
  DatabaseUpdate,
  DraftData,

  // Billing & Payments
  Invoice,
  LoginCredentials,
  // Organization & Branding
  Organization,
  OrganizationProposalSettings,
  // Proposals
  Proposal,
  ProposalDraft,
  SupabaseListResponse,
  SupabaseResponse,
  TrueFormLead,
  // User & Authentication
  UserSession,
} from "./database.types";

// Export database constants
export { DATABASE_TABLES } from "./database.types";

// ============================================================================
// WIZARD TYPES
// ============================================================================
export type {
  BasicInfoData,
  ContentStructureData,
  DesignBrandingData,
  FieldValidationError,
  ProjectTypeData,
  ProjectVisionData,
  // Site Request Wizard
  SiteRequestFormData,
  StepValidationEvent,
  TechnicalRequirementsData,
  TimelineBudgetData,
  UserExperienceData,
  // Validation
  ValidationResult,
} from "./wizard.types";

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================
export type {
  AccessibilityProps,
  AlertProps,
  // Feedback & Status
  AlertType,
  BreadcrumbItem,
  BreakpointConfig,
  ButtonProps,
  ButtonSize,
  // Button
  ButtonVariant,
  CardProps,
  // Card
  CardVariant,
  // Event Handlers
  ClickHandler,
  FormSubmitHandler,
  IconProps,
  // Icon & Media
  IconSize,
  ImageProps,
  InputChangeHandler,
  InputProps,
  InputSize,
  InputState,
  // Form & Input
  InputType,
  KeyboardHandler,
  LoadingProps,
  ModalProps,
  // Layout & Navigation
  NavItem,
  PaginationProps,
  // Responsive & Accessibility
  ResponsiveValue,
  SelectOption,
  SelectProps,
  // Data Display
  TableColumn,
  TableProps,
  ThemeColors,
  // Theme & Styling
  ThemeMode,
  ToastProps,
  ToastType,
  TransitionProps,
  // Animation & Transition
  TransitionType,
} from "./ui.types";

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
export const isNotUndefined = <T>(value: T | undefined): value is T =>
  value !== undefined;
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
