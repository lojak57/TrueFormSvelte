// Re-export from the refactored PDF generator
export {
  refactoredPdfGenerator as pdfGenerator,
  type PDFGenerationOptions,
  type PDFGenerationResult,
  type ProposalPDFData,
} from "./refactoredPdfGenerator";

// Legacy class for backwards compatibility - delegates to refactored generator
import type {
  PDFGenerationOptions,
  ProposalPDFData,
} from "./refactoredPdfGenerator";
import { refactoredPdfGenerator } from "./refactoredPdfGenerator";

export class ProposalPDFGenerator {
  private static instance: ProposalPDFGenerator;

  private constructor() {}

  static getInstance(): ProposalPDFGenerator {
    if (!ProposalPDFGenerator.instance) {
      ProposalPDFGenerator.instance = new ProposalPDFGenerator();
    }
    return ProposalPDFGenerator.instance;
  }

  async generatePDF(
    data: ProposalPDFData,
    options: PDFGenerationOptions = {}
  ): Promise<Response> {
    // Delegate to the refactored generator
    return refactoredPdfGenerator.generatePDF(data, options);
  }

  async generateHTML(
    data: ProposalPDFData,
    options: PDFGenerationOptions = {}
  ): Promise<string> {
    // Delegate to the refactored generator
    return refactoredPdfGenerator.generateHTML(data, options);
  }

  async destroy(): Promise<void> {
    // No-op for compatibility
  }
}
