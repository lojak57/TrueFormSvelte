/**
 * TypeScript interfaces for PDF generation
 */

import type { Company, Contact, Proposal } from "$lib/types";

export interface ProposalPDFData {
  proposal: Proposal;
  company: Company;
  contact?: Contact;
  paymentLink?: string;
  acceptanceLink?: string;
}

export interface PDFGenerationOptions {
  includePaymentQR?: boolean;
  includeAcceptanceQR?: boolean;
  logoUrl?: string;
  format?: "A4" | "Letter";
  orientation?: "portrait" | "landscape";
}

export interface EnhancedLineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  enhancedDescription: string;
  deliverables: string[];
  timeline: string;
}

export interface EnhancedProposal extends Proposal {
  line_items: EnhancedLineItem[];
  formattedTitle: string;
}

export interface TemplateData {
  proposal: EnhancedProposal;
  company: Company;
  contact?: Contact;
  logoUrl: string;
  proposalNumber: string;
  proposalDate: string;
  totalAmount: string;
  subtotal: string;
  tax: string;
  taxRate: number;
  expiryDate: string;
  paymentQR?: string;
  acceptanceQR?: string;
  styles: string;
  projectOverview: ProjectOverview;
  technicalSpecs: TechnicalSpecs;
}

export interface ProjectOverview {
  scope: string;
  methodology: string;
  support: string;
  hosting: string;
  maintenance: string;
}

export interface TechnicalSpecs {
  performance: string;
  security: string;
  seo: string;
  analytics: string;
  browsers: string;
}

export interface QRCodeOptions {
  type: "png" | "svg";
  quality: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
}

export interface StylesConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoMaxHeight: string;
  borderRadius: string;
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface PDFGenerationResult {
  success: boolean;
  html?: string;
  response?: Response;
  error?: string;
  filename?: string;
}
