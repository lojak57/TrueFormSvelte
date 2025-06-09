import type { ProposalDraft, PDFGenerationOptions } from '$lib/types/proposals';
import { defaultStyles } from '../styles/defaultStyles';

/**
 * Default PDF Template Generator
 * Clean, professional template suitable for most business proposals
 */
export class DefaultTemplate {
  /**
   * Generate complete HTML document
   */
  generate(proposal: ProposalDraft, options: Partial<PDFGenerationOptions> = {}): string {
    const data = proposal.draftData.proposalData;
    const logoSection = options.branding?.logoUrl ? 
      `<img src="${options.branding.logoUrl}" alt="Logo" class="logo" />` : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal - ${data.title || 'Untitled'}</title>
  <style>${defaultStyles}</style>
</head>
<body>
  ${options.watermark ? `<div class="watermark">${options.watermark}</div>` : ''}
  
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      ${logoSection}
      <div class="proposal-info">
        <h1>PROPOSAL</h1>
        <div class="proposal-meta">
          <div>Proposal #: ${data.proposalNumber || 'DRAFT'}</div>
          <div>Date: ${new Date().toLocaleDateString()}</div>
          ${data.validUntil ? `<div>Valid Until: ${new Date(data.validUntil).toLocaleDateString()}</div>` : ''}
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Title Section -->
    <section class="title-section">
      <h1 class="project-title">${data.title || 'Untitled Proposal'}</h1>
      ${data.description ? `<p class="project-description">${data.description}</p>` : ''}
    </section>

    <!-- Client Information -->
    <section class="client-section">
      <h2>Prepared For</h2>
      <div class="client-info">
        <div class="client-primary">
          <h3>${data.clientCompany || 'Client Company'}</h3>
          <p>${data.clientContactName || ''}</p>
          <p>${data.clientEmail || ''}</p>
          ${data.clientPhone ? `<p>${data.clientPhone}</p>` : ''}
        </div>
        ${this.formatClientAddress(data)}
      </div>
    </section>

    <!-- Project Overview -->
    <section class="overview-section">
      <h2>Project Overview</h2>
      <div class="overview-grid">
        ${data.projectTimeline ? `
          <div class="overview-item">
            <strong>Timeline:</strong>
            <span>${data.projectTimeline}</span>
          </div>
        ` : ''}
        <div class="overview-item">
          <strong>Currency:</strong>
          <span>${data.currencyCode || 'USD'}</span>
        </div>
        ${data.paymentTerms ? `
          <div class="overview-item">
            <strong>Payment Terms:</strong>
            <span>${data.paymentTerms}</span>
          </div>
        ` : ''}
      </div>
    </section>

    <!-- Line Items -->
    ${this.generateLineItemsSection(data)}

    <!-- Pricing Summary -->
    ${this.generatePricingSummary(data)}

    <!-- Terms & Conditions -->
    ${this.generateTermsSection(data)}

    ${data.notes ? `
      <section class="notes-section">
        <h2>Additional Notes</h2>
        <p>${data.notes}</p>
      </section>
    ` : ''}
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      ${options.branding?.companyName ? `<p>&copy; ${new Date().getFullYear()} ${options.branding.companyName}</p>` : ''}
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
  </footer>
</body>
</html>`;
  }

  /**
   * Generate line items section
   */
  private generateLineItemsSection(data: Partial<import('$lib/types/proposals').ProposalData>): string {
    if (!data.lineItems || data.lineItems.length === 0) {
      return '';
    }

    const itemsHTML = data.lineItems.map(item => `
      <tr class="line-item">
        <td class="item-details">
          <div class="item-title">${item.title}</div>
          ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
          <div class="item-meta">
            <span class="item-type">${item.itemType}</span>
            ${item.estimatedHours ? `<span class="item-hours">${item.estimatedHours}h estimated</span>` : ''}
          </div>
        </td>
        <td class="item-quantity">${item.quantity}</td>
        <td class="item-unit">${item.unitType}</td>
        <td class="item-rate">${this.formatCurrency(item.unitPrice, data.currencyCode)}</td>
        <td class="item-total">${this.formatCurrency(item.totalPrice, data.currencyCode)}</td>
      </tr>
    `).join('');

    return `
      <section class="line-items-section">
        <h2>Services & Deliverables</h2>
        <table class="line-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </section>
    `;
  }

  /**
   * Generate pricing summary
   */
  private generatePricingSummary(data: Partial<import('$lib/types/proposals').ProposalData>): string {
    if (!data.lineItems || data.lineItems.length === 0) {
      return '';
    }

    const subtotal = data.lineItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const taxAmount = subtotal * (data.taxRate || 0);
    const total = subtotal + taxAmount;

    return `
      <section class="pricing-section">
        <div class="pricing-summary">
          <div class="pricing-row">
            <span>Subtotal:</span>
            <span>${this.formatCurrency(subtotal, data.currencyCode)}</span>
          </div>
          ${data.taxRate && data.taxRate > 0 ? `
            <div class="pricing-row">
              <span>Tax (${(data.taxRate * 100).toFixed(2)}%):</span>
              <span>${this.formatCurrency(taxAmount, data.currencyCode)}</span>
            </div>
          ` : ''}
          <div class="pricing-row total-row">
            <span>Total:</span>
            <span>${this.formatCurrency(total, data.currencyCode)}</span>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generate terms section
   */
  private generateTermsSection(data: Partial<import('$lib/types/proposals').ProposalData>): string {
    if (!data.paymentTerms && !data.notes) {
      return '';
    }

    return `
      <section class="terms-section">
        <h2>Terms & Conditions</h2>
        ${data.paymentTerms ? `
          <div class="terms-item">
            <strong>Payment Terms:</strong>
            <p>${data.paymentTerms}</p>
          </div>
        ` : ''}
        ${data.validUntil ? `
          <div class="terms-item">
            <strong>Proposal Valid Until:</strong>
            <p>${new Date(data.validUntil).toLocaleDateString()}</p>
          </div>
        ` : ''}
      </section>
    `;
  }

  /**
   * Format client address
   */
  private formatClientAddress(data: Partial<import('$lib/types/proposals').ProposalData>): string {
    if (!data.clientAddress || 
        (!data.clientAddress.street && !data.clientAddress.city)) {
      return '';
    }

    const address = data.clientAddress;
    return `
      <div class="client-address">
        <h4>Address</h4>
        ${address.street ? `<p>${address.street}</p>` : ''}
        <p>
          ${address.city || ''}${address.city && address.state ? ', ' : ''}${address.state || ''} ${address.zip || ''}
        </p>
        ${address.country ? `<p>${address.country}</p>` : ''}
      </div>
    `;
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
} 