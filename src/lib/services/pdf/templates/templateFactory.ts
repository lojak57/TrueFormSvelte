import type { ProposalDraft, PDFGenerationOptions } from '$lib/types/proposals';
import { DefaultTemplate } from './defaultTemplate';
import { ModernTemplate } from './modernTemplate';
import { MinimalTemplate } from './minimalTemplate';
import { CorporateTemplate } from './corporateTemplate';

/**
 * Template Factory
 * Delegates to specific template generators based on options
 */
export class TemplateFactory {
  private readonly defaultTemplate = new DefaultTemplate();
  private readonly modernTemplate = new ModernTemplate();
  private readonly minimalTemplate = new MinimalTemplate();
  private readonly corporateTemplate = new CorporateTemplate();

  /**
   * Generate HTML template based on options
   */
  generateTemplate(proposal: ProposalDraft, options: Partial<PDFGenerationOptions> = {}): string {
    const template = options.template || 'default';
    
    switch (template) {
      case 'modern':
        return this.modernTemplate.generate(proposal, options);
      case 'minimal':
        return this.minimalTemplate.generate(proposal, options);
      case 'corporate':
        return this.corporateTemplate.generate(proposal, options);
      default:
        return this.defaultTemplate.generate(proposal, options);
    }
  }
} 