/**
 * Database Types - TrueForm Application
 *
 * Consolidated type definitions for all database entities.
 * These types should match the Supabase database schema.
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface UserSession {
  id: string;
  email: string;
  role?: string;
  organization_id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserSession | null;
  error: string | null;
}

// ============================================================================
// ORGANIZATION & BRANDING TYPES
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  org_type: string;
  created_at: string;
}

export interface BrandKit {
  id: string;
  organization_id: string;
  name: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
}

// ============================================================================
// LEAD & OPPORTUNITY TYPES
// ============================================================================

export interface BaseformLead {
  id: string;
  organization_id: string;
  company_name: string;
  contact_email: string;
  contact_name: string;
  project_description?: string;
  budget_range?: string;
  timeline?: string;
  created_at: string;
}

export interface BaseformOpportunity {
  id: string;
  lead_id: string;
  stage:
    | "discovery"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TrueFormLead {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  projectDescription: string;
  websiteType: string;
  features: string[];
  colorPreferences?: string;
  stylePreference: string;
  brandAssets: boolean;
  timeline: string;
  budgetRange: string;
  planType: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company: string;
  org_id: string;
}

// ============================================================================
// PROPOSAL TYPES
// ============================================================================

export interface Proposal {
  id: string;
  opportunity_id: string;
  title: string;
  content: any; // JSON content
  status: string;
  created_at: string;
  updated_at: string;
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

// Placeholder for DraftData - will be defined in Phase 3
export interface DraftData {
  // TODO: Define in Phase 3 wizard refactor
  [key: string]: any;
}

// ============================================================================
// BILLING & PAYMENT TYPES
// ============================================================================

export interface Invoice {
  id: string;
  organization_id: string;
  stripe_session_id?: string;
  amount: number;
  status: string;
  plan_type: "starter" | "standard" | "pro";
  created_at: string;
  paid_at?: string;
}

// ============================================================================
// SETTINGS & CONFIGURATION TYPES
// ============================================================================

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

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

// ============================================================================
// DATABASE TABLE NAMES (for type-safe queries)
// ============================================================================

export const DATABASE_TABLES = {
  USERS: "users",
  ORGANIZATIONS: "organizations",
  BRAND_KITS: "brand_kits",
  BASEFORM_LEADS: "baseform_leads",
  BASEFORM_OPPORTUNITIES: "baseform_opportunities",
  PROPOSALS: "proposals",
  PROPOSAL_DRAFTS: "proposal_drafts",
  INVOICES: "invoices",
  CONTACTS: "contacts",
} as const;

// ============================================================================
// UTILITY TYPES FOR DATABASE OPERATIONS
// ============================================================================

export type DatabaseInsert<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type DatabaseUpdate<T> = Partial<Omit<T, "id" | "created_at">>;

// ============================================================================
// SUPABASE RESPONSE TYPES
// ============================================================================

export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export interface SupabaseListResponse<T> {
  data: T[] | null;
  error: any;
  count?: number;
}
