/**
 * PDF Services - Clean Exports
 *
 * This file provides clean exports for all PDF-related functionality.
 * Import what you need from this single entry point.
 */

// Main PDF Generator
export {
  RefactoredPDFGenerator,
  refactoredPdfGenerator as pdfGenerator,
} from "./refactoredPdfGenerator";

// Legacy Support
export { ProposalPDFGenerator } from "./pdfGenerator";

// Utilities
export { ServiceEnhancer, serviceEnhancer } from "./serviceEnhancer";
export { TemplateGenerator, templateGenerator } from "./templateGenerator";
export { TemplateProcessor, templateProcessor } from "./templateProcessor";
export { PDFUtils } from "./utils";

// Types
export type {
  EnhancedLineItem,
  EnhancedProposal,
  PDFGenerationOptions,
  PDFGenerationResult,
  ProjectOverview,
  ProposalPDFData,
  QRCodeOptions,
  StylesConfig,
  TechnicalSpecs,
  TemplateData,
  TemplateValidationResult,
} from "./types";

// Re-export service enhancement interfaces for external use
export type { ServiceEnhancement } from "./serviceEnhancer";
