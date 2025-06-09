import type { ProposalDraft, PDFGenerationOptions } from '$lib/types/proposals';
import { DefaultTemplate } from './defaultTemplate';

/**
 * Corporate PDF Template Generator
 * Professional design with corporate blue color scheme
 */
export class CorporateTemplate extends DefaultTemplate {
  /**
   * Generate corporate template HTML
   */
  generate(proposal: ProposalDraft, options: Partial<PDFGenerationOptions> = {}): string {
    const html = super.generate(proposal, options);
    
    // Apply corporate styling transformations
    return html.replace(/#007acc/g, '#1e40af');
  }
} 