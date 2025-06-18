// Re-export from the Vercel-compatible PDF generator
export { 
  vercelPdfGenerator as pdfGenerator,
  type ProposalPDFData,
  type PDFGenerationOptions
} from './vercelPdfGenerator';

// Legacy class for backwards compatibility - delegates to Vercel generator
import { vercelPdfGenerator } from './vercelPdfGenerator';
import type { ProposalPDFData, PDFGenerationOptions } from './vercelPdfGenerator';

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
    // Delegate to the Vercel-compatible generator
    return vercelPdfGenerator.generatePDF(data, options);
  }

  async generateHTML(
    data: ProposalPDFData, 
    options: PDFGenerationOptions = {}
  ): Promise<string> {
    // Delegate to the Vercel-compatible generator
    return vercelPdfGenerator.generateHTML(data, options);
  }

  async destroy(): Promise<void> {
    // No-op for Vercel compatibility
  }
}