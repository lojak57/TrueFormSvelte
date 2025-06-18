/**
 * Puppeteer-based PDF Generator
 * Generates actual PDF files (not HTML) from proposal data
 */

import puppeteer from 'puppeteer';
import type { ProposalPDFData, PDFGenerationOptions } from './types';
import { templateGenerator } from './templateGenerator';
import { templateProcessor } from './templateProcessor';
import { serviceEnhancer } from './serviceEnhancer';
import { PDFUtils } from './utils';
import type { TemplateData } from './types';
import fs from 'fs/promises';
import path from 'path';

export class PuppeteerPDFGenerator {
  private static instance: PuppeteerPDFGenerator;
  private browser: any = null;

  private constructor() {}

  static getInstance(): PuppeteerPDFGenerator {
    if (!PuppeteerPDFGenerator.instance) {
      PuppeteerPDFGenerator.instance = new PuppeteerPDFGenerator();
    }
    return PuppeteerPDFGenerator.instance;
  }

  /**
   * Main entry point for PDF generation
   */
  async generatePDF(
    data: ProposalPDFData,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    try {
      // Prepare template data
      const templateData = await this.prepareTemplateData(data, options);
      
      // Get template
      const template = await this.getTemplate();
      
      // Load styles
      const styles = await this.loadStyles();
      templateData.styles = styles;
      
      // Process template
      const html = templateProcessor.processTemplate(template, templateData);
      
      // Generate PDF from HTML
      const pdfBuffer = await this.htmlToPdf(html, options);
      
      return pdfBuffer;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert HTML to PDF using Puppeteer
   */
  private async htmlToPdf(html: string, options: PDFGenerationOptions): Promise<Buffer> {
    let page;

    try {
      // Launch browser if not already running
      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
          ],
        });
      }

      page = await this.browser.newPage();

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Configure PDF options
      const pdfOptions = {
        format: (options.format || 'Letter') as 'Letter' | 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
        preferCSSPageSize: false,
        displayHeaderFooter: false,
      };

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      return pdfBuffer;
    } finally {
      if (page) {
        await page.close();
      }
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
    const enhancedLineItems = proposal.line_items.map((item) => ({
      ...item,
      ...serviceEnhancer.enhanceService(item),
      total: PDFUtils.formatCurrency(item.total),
      unitPrice: PDFUtils.formatCurrency(item.unitPrice),
    }));

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
      styles: "",
      projectOverview: serviceEnhancer.getProjectOverview(proposal),
      technicalSpecs: serviceEnhancer.getTechnicalSpecs(),
    };
  }

  /**
   * Gets the HTML template
   */
  private async getTemplate(): Promise<string> {
    const externalTemplate = await templateGenerator.getExternalTemplate();
    
    if (externalTemplate) {
      return externalTemplate;
    }

    return templateGenerator.generateTemplate();
  }

  /**
   * Loads CSS styles optimized for PDF generation
   */
  private async loadStyles(): Promise<string> {
    try {
      const currentDir = path.dirname(new URL(import.meta.url).pathname);
      const cssPath = path.join(currentDir, "pdfStyles.css");
      
      try {
        const externalCSS = await fs.readFile(cssPath, "utf-8");
        return externalCSS;
      } catch {
        // Fall back to inline styles
        return this.getPdfOptimizedStyles();
      }
    } catch (error) {
      console.warn("Failed to load PDF styles, using inline fallback");
      return this.getPdfOptimizedStyles();
    }
  }

  /**
   * PDF-optimized inline styles (no interactive elements, proper page breaks)
   */
  private getPdfOptimizedStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      @page {
        size: Letter;
        margin: 0.5in;
      }

      body {
        font-family: "Helvetica", Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        color: #1a1a1a;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        position: relative;
      }

      /* Watermark */
      .watermark {
        position: fixed;
        bottom: 100px;
        right: -100px;
        z-index: 1;
        opacity: 0.03;
        transform: rotate(-45deg);
        pointer-events: none;
      }

      .watermark-logo {
        width: 400px;
        height: auto;
      }

      .page {
        width: 100%;
        min-height: 100vh;
        page-break-after: always;
        background: #ffffff;
        position: relative;
        padding: 20px 0;
        z-index: 2;
      }

      .page:last-child {
        page-break-after: avoid;
      }

      .page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: #d97706;
        z-index: 10;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #1a1a1a;
        line-height: 1.1;
        page-break-after: avoid;
      }

      h2 {
        font-size: 16px;
        margin-bottom: 16px;
        padding: 10px 14px;
        background: #1a1a1a;
        color: #ffffff;
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

      .card, .header-card, .client-card, .service-card, .breakdown-card, .payment-card, .steps-card, .contact-card {
        background: #ffffff;
        border: 2px solid #1a1a1a;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 4px 4px 0px #1a1a1a;
        position: relative;
        page-break-inside: avoid;
      }

      .header-card {
        border-top: 8px solid #d97706;
        margin-bottom: 16px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo-large {
        height: 80px;
        width: auto;
      }

      .proposal-meta {
        text-align: right;
      }

      .proposal-number {
        font-size: 24px;
        font-weight: 900;
        color: #d97706;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .proposal-date {
        font-size: 12px;
        color: #666;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 4px;
      }

      /* Hero Section */
      .hero-section {
        margin-bottom: 24px;
      }

      .proposal-title-card {
        background: #ffffff;
        border: 2px solid #1a1a1a;
        padding: 24px;
        box-shadow: 4px 4px 0px #1a1a1a;
        border-left: 8px solid #d97706;
      }

      .proposal-title {
        font-size: 28px;
        font-weight: 900;
        color: #1a1a1a;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1.0;
      }

      .client-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .company-section {
        flex: 1;
      }

      .company-name {
        font-size: 20px;
        font-weight: 800;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }

      .contact-details {
        font-size: 14px;
        color: #666;
        font-weight: 600;
      }

      .total-investment {
        text-align: right;
        padding: 16px 20px;
        background: #f8f9fa;
        border: 2px solid #1a1a1a;
        box-shadow: 2px 2px 0px #1a1a1a;
      }

      .investment-label {
        font-size: 12px;
        color: #666;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 4px;
      }

      .investment-amount {
        font-size: 32px;
        font-weight: 900;
        color: #d97706;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .services-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 20px;
      }

      .service-card {
        page-break-inside: avoid;
      }

      .service-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .service-name {
        font-size: 14px;
        font-weight: 800;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .service-price {
        font-size: 16px;
        font-weight: 900;
        color: #d97706;
      }

      .service-description {
        font-size: 12px;
        color: #666;
        margin-bottom: 12px;
        line-height: 1.3;
      }

      .service-deliverables h4 {
        font-size: 11px;
        color: #1a1a1a;
        margin-bottom: 8px;
        font-weight: 800;
      }

      .deliverables-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .deliverables-list li {
        font-size: 11px;
        color: #666;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
      }

      .deliverables-list li::before {
        content: "•";
        color: #d97706;
        font-weight: 900;
        position: absolute;
        left: 0;
      }

      .breakdown-card {
        page-break-inside: avoid;
      }

      .breakdown-item,
      .breakdown-subtotal,
      .breakdown-tax,
      .breakdown-total {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e5e5e5;
      }

      .breakdown-total {
        font-weight: 800;
        font-size: 16px;
        border-bottom: 3px solid #1a1a1a;
        margin-top: 8px;
        padding-top: 12px;
      }

      /* Overview Grid - Card Style */
      .overview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 20px;
      }

      .overview-card {
        background: #ffffff;
        border: 2px solid #1a1a1a;
        padding: 16px;
        box-shadow: 3px 3px 0px #1a1a1a;
        page-break-inside: avoid;
      }

      .overview-card h4 {
        font-size: 12px;
        color: #1a1a1a;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 800;
      }

      .overview-card p {
        font-size: 11px;
        color: #666;
        line-height: 1.4;
      }

      .payment-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 20px;
      }

      .payment-card.primary {
        border-left: 6px solid #d97706;
      }

      .payment-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .payment-title {
        font-size: 14px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .payment-description {
        font-size: 12px;
        color: #666;
        margin-bottom: 12px;
      }

      .qr-container {
        text-align: center;
        margin-top: 12px;
      }

      .qr-code {
        width: 80px;
        height: 80px;
        margin-bottom: 6px;
      }

      .qr-label {
        font-size: 10px;
        color: #666;
        font-weight: 600;
      }

      .steps-card {
        border-left: 6px solid #059669;
      }

      .steps-content {
        margin-top: 12px;
      }

      .step {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .step-number {
        background: #1a1a1a;
        color: #ffffff;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        flex-shrink: 0;
      }

      .step-text {
        font-size: 12px;
        color: #666;
        font-weight: 600;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 16px;
      }

      .contact-item {
        text-align: center;
      }

      .contact-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #666;
        margin-bottom: 4px;
      }

      .contact-value {
        font-size: 12px;
        font-weight: 600;
        color: #1a1a1a;
      }

      .contact-value a {
        color: #1a1a1a;
        text-decoration: none;
      }

      .validity-notice {
        text-align: center;
        font-size: 10px;
        color: #666;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e5e5e5;
      }

      .no-print, .print-button {
        display: none;
      }

      /* Accent borders */
      .accent-orange {
        border-left: 4px solid #d97706 !important;
      }

      .accent-green {
        border-left: 4px solid #059669 !important;
      }

      .accent-top-orange {
        border-top: 4px solid #d97706 !important;
      }
    `;
  }

  /**
   * Clean up resources
   */
  async destroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Export singleton instance
export const puppeteerPdfGenerator = PuppeteerPDFGenerator.getInstance(); 