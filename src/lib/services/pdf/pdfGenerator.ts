import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import type { Proposal, LineItem, Company, Contact } from '$lib/types';

export interface ProposalPDFData {
  proposal: Proposal;
  company: Company;
  contact?: Contact;
  paymentLink?: string;
  acceptanceLink?: string;
}

export interface PDFGenerationOptions {
  includePaymentQR?: boolean;
  includeAcceptanceQR?: boolean;
  logoUrl?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

export class ProposalPDFGenerator {
  private static instance: ProposalPDFGenerator;
  private browserPromise: Promise<puppeteer.Browser> | null = null;

  private constructor() {}

  static getInstance(): ProposalPDFGenerator {
    if (!ProposalPDFGenerator.instance) {
      ProposalPDFGenerator.instance = new ProposalPDFGenerator();
    }
    return ProposalPDFGenerator.instance;
  }

  private async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });
    }
    return this.browserPromise;
  }

  async generatePDF(
    data: ProposalPDFData, 
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // Generate the HTML content
      const html = await this.generateHTML(data, options);
      
      // Set content and wait for it to load
      await page.setContent(html, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 30000 
      });

      // Configure PDF options
      const pdfOptions: puppeteer.PDFOptions = {
        format: options.format || 'Letter',
        printBackground: true,
        margin: {
          top: '0.3in',
          right: '0.3in',
          bottom: '0.3in',
          left: '0.3in'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false
      };

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      
      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  async generateHTML(
    data: ProposalPDFData, 
    options: PDFGenerationOptions = {}
  ): Promise<string> {
    const { proposal, company, contact } = data;
    
    // Generate QR codes if needed
    const paymentQR = options.includePaymentQR && data.paymentLink 
      ? await this.generateQRCode(data.paymentLink)
      : null;
    
    const acceptanceQR = options.includeAcceptanceQR && data.acceptanceLink
      ? await this.generateQRCode(data.acceptanceLink)
      : null;

    // Format currency
    const formatCurrency = (amount: number) => 
      new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(amount);

    // Format date
    const formatDate = (date: string) => 
      new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

    // Calculate proposal expiry (30 days from creation)
    const expiryDate = new Date(proposal.created_at);
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Read template and styles
    const template = await this.getTemplate();
    const styles = await this.getStyles();

    // Prepare template data
    const templateData = {
      proposal,
      company,
      contact,
      logoUrl: options.logoUrl,
      proposalNumber: proposal.id.slice(-8),
      proposalDate: formatDate(proposal.created_at),
      totalAmount: formatCurrency(proposal.total),
      subtotal: formatCurrency(proposal.subtotal),
      tax: formatCurrency(proposal.tax),
      expiryDate: formatDate(expiryDate.toISOString()),
      paymentQR,
      acceptanceQR,
      styles
    };

    // Process line items with formatted currency
    templateData.proposal.line_items = proposal.line_items.map(item => ({
      ...item,
      total: formatCurrency(item.total),
      unitPrice: formatCurrency(item.unitPrice)
    }));

    return this.processTemplate(template, templateData);
  }

  private async generateQRCode(data: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        type: 'png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 200
      });
      
      // Remove the data:image/png;base64, prefix
      return qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }

  private async getTemplate(): Promise<string> {
    // Import the template as a string using Vite's ?raw suffix
    try {
      const template = await import('./template.html?raw');
      return template.default;
    } catch (error) {
      console.error('Error loading template file:', error);
      throw new Error('Failed to load PDF template');
    }
  }

  private async getStyles(): Promise<string> {
    // Import the styles as a string using Vite's ?raw suffix
    try {
      const styles = await import('./styles.css?raw');
      return styles.default;
    } catch (error) {
      console.error('Error loading styles file:', error);
      throw new Error('Failed to load PDF styles');
    }
  }

  private processTemplate(template: string, data: any): string {
    let html = template;
    
    // Replace simple variables
    html = html.replace(/{{(\w+(?:\.\w+)*)}}/g, (match, path) => {
      const value = this.getNestedValue(data, path);
      return value !== undefined ? String(value) : '';
    });
    
    // Handle conditionals {{#if variable}}
    html = html.replace(/{{#if\s+(\w+(?:\.\w+)*)}}/g, (match, path) => {
      const value = this.getNestedValue(data, path);
      return value ? '' : '<!--IF_FALSE-->';
    });
    
    html = html.replace(/{{\/if}}/g, (match) => {
      return '<!--END_IF-->';
    });
    
    // Remove false conditional blocks
    html = html.replace(/<!--IF_FALSE-->[\s\S]*?<!--END_IF-->/g, '');
    html = html.replace(/<!--END_IF-->/g, '');
    
    // Handle loops {{#each array}}
    html = html.replace(/{{#each\s+(\w+(?:\.\w+)*)}}/g, (match, path) => {
      return `<!--EACH_START:${path}-->`;
    });
    
    html = html.replace(/{{\/each}}/g, '<!--EACH_END-->');
    
    // Process each loops
    html = html.replace(/<!--EACH_START:(\w+(?:\.\w+)*)-->[\s\S]*?<!--EACH_END-->/g, (match, path) => {
      const array = this.getNestedValue(data, path);
      if (!Array.isArray(array)) return '';
      
      const template = match.replace(`<!--EACH_START:${path}-->`, '').replace('<!--EACH_END-->', '');
      
      return array.map(item => {
        let itemHtml = template;
        // Replace variables within the loop
        itemHtml = itemHtml.replace(/{{(\w+)}}/g, (itemMatch, prop) => {
          return item[prop] !== undefined ? String(item[prop]) : '';
        });
        return itemHtml;
      }).join('');
    });
    
    return html;
  }
  
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }


  async destroy(): Promise<void> {
    if (this.browserPromise) {
      const browser = await this.browserPromise;
      await browser.close();
      this.browserPromise = null;
    }
  }
}

// Export singleton instance
export const pdfGenerator = ProposalPDFGenerator.getInstance();