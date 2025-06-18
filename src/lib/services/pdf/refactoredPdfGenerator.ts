/**
 * Refactored PDF Generator - Clean, Modular, Maintainable
 *
 * This is the main orchestrator that uses specialized modules to generate PDFs.
 * Each module has a single responsibility, making the code easy to understand and maintain.
 */

import { serviceEnhancer } from "./serviceEnhancer";
import { templateGenerator } from "./templateGenerator";
import { templateProcessor } from "./templateProcessor";
import type {
  EnhancedLineItem,
  PDFGenerationOptions,
  PDFGenerationResult,
  ProposalPDFData,
  TemplateData,
} from "./types";
import { PDFUtils } from "./utils";

export class RefactoredPDFGenerator {
  /**
   * Main entry point for PDF generation
   */
  async generatePDF(
    data: ProposalPDFData,
    options: PDFGenerationOptions = {}
  ): Promise<Response> {
    try {
      const result = await this.generatePDFInternal(data, options);

      if (!result.success || !result.html) {
        throw new Error(result.error || "Failed to generate PDF");
      }

      return new Response(result.html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `inline; filename="${result.filename}"`,
        },
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw error;
    }
  }

  /**
   * Generates HTML content for PDF
   */
  async generateHTML(
    data: ProposalPDFData,
    options: PDFGenerationOptions = {}
  ): Promise<string> {
    const result = await this.generatePDFInternal(data, options);

    if (!result.success || !result.html) {
      throw new Error(result.error || "Failed to generate HTML");
    }

    return result.html;
  }

  /**
   * Internal PDF generation logic
   */
  private async generatePDFInternal(
    data: ProposalPDFData,
    options: PDFGenerationOptions
  ): Promise<PDFGenerationResult> {
    try {
      // Step 1: Prepare template data
      const templateData = await this.prepareTemplateData(data, options);

      // Step 2: Get template
      const template = await this.getTemplate();

      // Step 3: Load styles
      const styles = await this.loadStyles();

      // Step 4: Add styles to template data
      templateData.styles = styles;

      // Step 5: Process template
      const html = templateProcessor.processTemplate(template, templateData);

      // Step 6: Generate filename
      const filename = PDFUtils.generateFilename(
        data.company.name,
        data.proposal.id
      );

      return {
        success: true,
        html,
        filename,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Prepares all data needed for template processing
   */
  private async prepareTemplateData(
    data: ProposalPDFData,
    options: PDFGenerationOptions
  ): Promise<TemplateData> {
    const { proposal, company, contact } = data;

    // Enhance line items
    const enhancedLineItems: EnhancedLineItem[] = proposal.line_items.map(
      (item) => ({
        ...item,
        ...serviceEnhancer.enhanceService(item),
        total: PDFUtils.formatCurrency(item.total),
        unitPrice: PDFUtils.formatCurrency(item.unitPrice),
      })
    );

    // Generate QR codes if needed
    const paymentQR =
      options.includePaymentQR && data.paymentLink
        ? await PDFUtils.generateQRCode(data.paymentLink)
        : undefined;

    const acceptanceQR =
      options.includeAcceptanceQR && data.acceptanceLink
        ? await PDFUtils.generateQRCode(data.acceptanceLink)
        : undefined;

    // Calculate dates
    const expiryDate = PDFUtils.calculateExpiryDate(proposal.created_at);

    return {
      proposal: {
        ...proposal,
        line_items: enhancedLineItems,
        formattedTitle: proposal.title || "Website Development Proposal",
      },
      company,
      contact,
      logoUrl: options.logoUrl || "/logo.svg",
      proposalNumber: PDFUtils.generateProposalNumber(proposal.id),
      proposalDate: PDFUtils.formatDate(proposal.created_at),
      totalAmount: PDFUtils.formatCurrency(proposal.total),
      subtotal: PDFUtils.formatCurrency(proposal.subtotal),
      tax: PDFUtils.formatCurrency(proposal.tax),
      taxRate: proposal.tax_rate,
      expiryDate: PDFUtils.formatDate(expiryDate.toISOString()),
      paymentQR,
      acceptanceQR,
      styles: "", // Will be filled later
      projectOverview: serviceEnhancer.getProjectOverview(proposal),
      technicalSpecs: serviceEnhancer.getTechnicalSpecs(),
    };
  }

  /**
   * Gets the HTML template (external file or generated)
   */
  private async getTemplate(): Promise<string> {
    // Try to load external template first
    const externalTemplate = await templateGenerator.getExternalTemplate();

    if (externalTemplate) {
      return externalTemplate;
    }

    // Fall back to generated template
    return templateGenerator.generateTemplate();
  }

  /**
   * Loads and combines CSS styles
   */
  private async loadStyles(): Promise<string> {
    try {
      // Load the brutalist design CSS directly
      const fs = await import("fs/promises");
      const path = await import("path");
      const currentDir = import.meta.url.replace("file://", "");
      const cssPath = path.join(path.dirname(currentDir), "styles.css");
      
      const externalCSS = await fs.readFile(cssPath, "utf-8");
      if (externalCSS) {
        return externalCSS;
      }

      // Fall back to inline styles
      return this.getInlineStyles();
    } catch (error) {
      console.warn("Failed to load external CSS, using inline styles");
      return this.getInlineStyles();
    }
  }

  /**
   * Brutalist design inline styles (fallback for external CSS)
   */
  private getInlineStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        font-size: 15px;
        line-height: 1.4;
        color: #1a1a1a;
        background-color: #f5f5f5;
        background-image: 
          linear-gradient(#e5e5e5 1px, transparent 1px),
          linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
        background-size: 20px 20px;
        padding: 20px;
      }

      .proposal-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      /* Header Styles */
      .proposal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #3b82f6;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      .header-card {
        background: white;
        border-radius: 0.8rem;
        padding: 1.2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        margin-bottom: 1.2rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        height: 65px;
        width: auto;
        max-height: 65px;
        max-width: 200px;
      }

      .tagline {
        color: #6b7280;
        font-size: 14px;
        font-style: italic;
        margin-top: 8px;
      }

      .proposal-meta {
        text-align: right;
      }

      .proposal-number {
        font-size: 1.25rem;
        font-weight: 700;
        color: #3b82f6;
        margin-bottom: 0.4rem;
      }

      .proposal-date {
        font-size: 1rem;
        color: #64748b;
        font-weight: 500;
      }

      /* Hero Section */
      .hero-section {
        margin-bottom: 1.2rem;
      }

      .proposal-title {
        font-size: 2.1rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 1.2rem;
        line-height: 1.1;
      }

      .client-card {
        background: white;
        border-radius: 0.8rem;
        padding: 1.2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.2rem;
      }

      .company-name {
        font-size: 1.45rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.4rem;
      }

      .contact-details {
        font-size: 1.05rem;
        color: #475569;
        margin-bottom: 0.2rem;
      }

      .contact-email {
        font-size: 1rem;
        color: #64748b;
      }

      .total-investment {
        text-align: right;
      }

      .investment-label {
        font-size: 1rem;
        color: #64748b;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .investment-amount {
        font-size: 1.9rem;
        font-weight: 800;
        color: #3b82f6;
      }

      /* Brutalist Typography */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #1a1a1a;
        line-height: 1.1;
      }

      h2 {
        font-size: 18px;
        margin-bottom: 20px;
        padding: 12px 16px;
        background: #1a1a1a;
        color: #ffffff;
        border: none;
        position: relative;
      }

      h2::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 60px;
        height: 4px;
        background: #d97706;
      }

      /* Services Section */
      .services-overview {
        margin-bottom: 1.6rem;
        position: relative;
      }

      .services-overview::after {
        content: "";
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #1e40af);
        border-radius: 2px;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 0.8rem;
      }

      .service-card {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        transition: all 0.2s ease;
        border-left: 3px solid #3b82f6;
      }

      .service-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.6rem;
      }

      .service-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: #0f172a;
        flex: 1;
        margin-right: 0.8rem;
      }

      .service-price {
        font-size: 1.05rem;
        font-weight: 700;
        color: #3b82f6;
      }

      .service-description {
        color: #4b5563;
        font-size: 14px;
        line-height: 1.6;
        margin: 12px 0 16px 0;
      }

      .service-deliverables h4 {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .deliverables-list {
        list-style: none;
        padding: 0;
        margin: 0 0 12px 0;
      }

      .deliverables-list li {
        position: relative;
        padding-left: 20px;
        margin-bottom: 6px;
        color: #4b5563;
        font-size: 13px;
        line-height: 1.4;
      }

      .deliverables-list li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
        font-size: 12px;
      }

      .service-meta {
        color: #64748b;
        font-size: 0.7rem;
        display: flex;
        gap: 0.4rem;
        align-items: center;
      }

      .timeline {
        background: #dbeafe;
        color: #1e40af;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }

      /* Project overview section */
      .project-overview {
        margin-bottom: 40px;
        position: relative;
      }

      .project-overview::after {
        content: "";
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #1e40af);
        border-radius: 2px;
      }

      .overview-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }

      .overview-item {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 8px;
        padding: 20px;
      }

      .overview-item h4 {
        font-size: 16px;
        font-weight: 600;
        color: #059669;
        margin-bottom: 8px;
      }

      .overview-item p {
        color: #065f46;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
      }

      /* Pricing Breakdown */
      .pricing-breakdown {
        margin-bottom: 1.6rem;
        position: relative;
      }

      .breakdown-card {
        background: white;
        border-radius: 0.8rem;
        padding: 1.2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      .breakdown-item,
      .breakdown-subtotal,
      .breakdown-tax {
        display: flex;
        justify-content: space-between;
        padding: 0.6rem 0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 0.9rem;
      }

      .breakdown-subtotal,
      .breakdown-tax {
        font-weight: 600;
        color: #475569;
      }

      .breakdown-total {
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 0 0;
        font-size: 1.05rem;
        font-weight: 800;
        color: #3b82f6;
        border-top: 2px solid #3b82f6;
        margin-top: 0.6rem;
      }

      /* Payment Section */
      .payment-icon {
        width: 48px;
        height: 48px;
        background: #dbeafe;
        color: #1e40af;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }

      .payment-icon svg {
        width: 24px;
        height: 24px;
      }

      .qr-code {
        max-width: 120px;
        margin: 15px auto;
        display: block;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 8px;
        background: white;
      }

      /* Page 2 Layout */
      .page {
        min-height: 100vh;
        padding: 40px;
        margin-bottom: 40px;
      }

      .header-minimal {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 20px;
        margin-bottom: 40px;
      }

      .logo-sm {
        height: 40px;
        width: auto;
      }

      .page-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
      }

      /* Payment Methods Section */
      .payment-methods {
        margin-bottom: 40px;
      }

      .payment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-top: 24px;
      }

      .payment-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s ease;
        position: relative;
      }

      .payment-card.primary {
        border-color: #3b82f6;
        background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
      }

      .payment-card:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .payment-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .payment-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #0f172a;
      }

      .payment-description {
        color: #64748b;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .payment-note {
        color: #94a3b8;
        font-size: 12px;
        font-style: italic;
      }

      .qr-container {
        text-align: center;
        margin-top: 20px;
      }

      .qr-label {
        color: #64748b;
        font-size: 12px;
        margin-top: 8px;
        font-weight: 500;
      }

      /* Next Steps Section */
      .next-steps-section {
        margin-bottom: 40px;
      }

      .steps-card {
        background: white;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        gap: 32px;
        align-items: flex-start;
      }

      .acceptance-qr {
        text-align: center;
        flex-shrink: 0;
      }

      .steps-content {
        flex: 1;
      }

      .step {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        border-left: 4px solid #3b82f6;
      }

      .step:last-child {
        margin-bottom: 0;
      }

      .step-number {
        background: #3b82f6;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
        flex-shrink: 0;
      }

      .step-text {
        color: #334155;
        font-size: 14px;
        font-weight: 500;
      }

      /* Footer Contact Section */
      .footer-contact {
        margin-top: 60px;
      }

      .contact-card {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        border-radius: 16px;
        padding: 32px;
        text-align: center;
      }

      .contact-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 24px;
        color: white;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
      }

      .contact-item {
        text-align: center;
      }

      .contact-label {
        color: #94a3b8;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .contact-value {
        color: white;
        font-size: 14px;
        font-weight: 500;
      }

      .contact-value a {
        color: #60a5fa;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .contact-value a:hover {
        color: #93c5fd;
        text-decoration: underline;
      }

      .validity-notice {
        color: #cbd5e1;
        font-size: 12px;
        font-style: italic;
        border-top: 1px solid #334155;
        padding-top: 16px;
        margin-top: 24px;
      }

      /* Print Styles */
      @media print {
        body {
          background: white;
          padding: 0;
        }
        
        .proposal-container {
          box-shadow: none;
          border-radius: 0;
          padding: 20px;
        }
        
        .no-print {
          display: none !important;
        }
      }

      /* Print button */
      .print-button {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        z-index: 1000;
      }

      .print-button:hover {
        background: #2563eb;
      }
    `;
  }

  /**
   * Validates proposal data before generation
   */
  validateProposalData(data: ProposalPDFData): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.proposal) {
      errors.push("Proposal data is required");
    } else {
      if (!data.proposal.id) errors.push("Proposal ID is required");
      if (!data.proposal.title) errors.push("Proposal title is required");
      if (!data.proposal.line_items || data.proposal.line_items.length === 0) {
        errors.push("At least one line item is required");
      }
      if (typeof data.proposal.total !== "number") {
        errors.push("Proposal total must be a number");
      }
    }

    if (!data.company) {
      errors.push("Company data is required");
    } else {
      if (!data.company.name) errors.push("Company name is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets the PDF generation URL for a proposal
   */
  generatePDFUrl(
    proposalId: string,
    baseUrl: string,
    options: PDFGenerationOptions = {}
  ): string {
    const url = new URL(`${baseUrl}/api/proposals/${proposalId}/pdf`);

    if (options.includePaymentQR) {
      url.searchParams.set("payment_qr", "true");
    }

    if (options.includeAcceptanceQR) {
      url.searchParams.set("acceptance_qr", "true");
    }

    if (options.format) {
      url.searchParams.set("format", options.format);
    }

    return url.toString();
  }
}

// Export singleton instance
export const refactoredPdfGenerator = new RefactoredPDFGenerator();

// Re-export types for convenience
export type {
  PDFGenerationOptions,
  PDFGenerationResult,
  ProposalPDFData,
} from "./types";
