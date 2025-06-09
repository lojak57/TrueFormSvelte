import type { ProposalDraft, PDFGenerationOptions } from '$lib/types/proposals';
import { TemplateFactory } from './templates/templateFactory';

/**
 * Enterprise PDF Generation Service
 * Handles API orchestration and job management
 * Template generation delegated to specialized modules
 */
export class PDFGenerator {
  private readonly apiBase = '/api/v1/pdf';
  private readonly templateFactory = new TemplateFactory();

  /**
   * Generate PDF from proposal data
   */
  async generateProposalPDF(
    proposal: ProposalDraft,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<{
    url: string;
    filename: string;
    jobId: string;
  }> {
    const response = await fetch(`${this.apiBase}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proposal,
        options: {
          template: options.template || 'default',
          includeAttachments: options.includeAttachments || false,
          includeHtmlSnapshot: options.includeHtmlSnapshot || true,
          watermark: options.watermark,
          branding: options.branding,
          ...options
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Check PDF generation status
   */
  async getGenerationStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    url?: string;
    error?: string;
  }> {
    const response = await fetch(`${this.apiBase}/status/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get PDF status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate proposal preview HTML (for browser preview)
   */
  generatePreviewHTML(proposal: ProposalDraft, options: Partial<PDFGenerationOptions> = {}): string {
    return this.templateFactory.generateTemplate(proposal, options);
  }

  /**
   * Download generated PDF
   */
  async downloadPDF(url: string, filename: string): Promise<void> {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Export singleton instance
export const pdfGenerator = new PDFGenerator(); 