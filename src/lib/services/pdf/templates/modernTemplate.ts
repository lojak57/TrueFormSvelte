import type { ProposalDraft, PDFGenerationOptions } from '$lib/types/proposals';
import { DefaultTemplate } from './defaultTemplate';

/**
 * Modern PDF Template Generator
 * Clean, contemporary design with modern colors and typography
 */
export class ModernTemplate extends DefaultTemplate {
  /**
   * Generate modern template HTML
   */
  generate(proposal: ProposalDraft, options: Partial<PDFGenerationOptions> = {}): string {
    const html = super.generate(proposal, options);
    
    // Apply modern styling transformations
    return html
      .replace(/#007acc/g, '#6366f1')
      .replace(/Helvetica/g, 'Inter, -apple-system, BlinkMacSystemFont')
      .replace(/Arial/g, 'system-ui');
  }
} 