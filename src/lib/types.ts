export interface Project {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  status: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  status: string;
  vertical_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyDTO {
  name: string;
  website?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  status?: string;
  vertical_id?: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  website?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  status?: string;
  vertical_id?: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  notes?: string;
  company_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

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

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  isActive?: boolean;
}

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  company_id: string;
  status?: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
}

// Simple proposal types
export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proposal {
  id: string;
  title: string;
  company_id: string;
  contact_id?: string;
  line_items: LineItem[];
  subtotal: number;
  tax: number;
  tax_rate: number;
  total: number;
  notes?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface CreateProposalDTO {
  title: string;
  company_id: string;
  contact_id?: string;
  line_items: Omit<LineItem, "id" | "total">[];
  tax_rate?: number;
  notes?: string;
}
