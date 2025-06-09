import type { ProposalDraft, PDFGenerationOptions } from '$lib/types/proposals';
import { DefaultTemplate } from './defaultTemplate';

/**
 * Minimal PDF Template Generator
 * Clean, stripped-down design with minimal styling
 */
export class MinimalTemplate extends DefaultTemplate {
  /**
   * Generate minimal template HTML
   */
  generate(proposal: ProposalDraft, options: Partial<PDFGenerationOptions> = {}): string {
    const html = super.generate(proposal, options);
    
    // Apply minimal styling transformations
    return html
      .replace(/#007acc/g, '#000000')
      .replace(/border-bottom: 2px solid #007acc/g, 'border-bottom: 1px solid #000000')
      .replace(/background: #f8f9fa/g, 'background: #ffffff');
  }
} 