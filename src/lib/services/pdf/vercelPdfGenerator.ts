import QRCode from 'qrcode';
import type { Proposal, Company, Contact } from '$lib/types';

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

export class VercelPDFGenerator {
  async generatePDF(
    data: ProposalPDFData, 
    options: PDFGenerationOptions = {}
  ): Promise<Response> {
    // For Vercel deployment, we'll generate HTML that can be converted to PDF
    // using external services or client-side PDF generation
    
    const html = await this.generateHTML(data, options);
    
    // Return HTML that can be processed by browser's print-to-PDF
    // or sent to external PDF service like htmlcsstoimage.com
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="proposal-${data.proposal.id.slice(-8)}.html"`
      }
    });
  }

  async generatePDFUrl(
    data: ProposalPDFData, 
    options: PDFGenerationOptions = {},
    baseUrl: string
  ): Promise<string> {
    // Generate URL that can be used with external PDF services
    // or browser print functionality
    const proposalId = data.proposal.id;
    return `${baseUrl}/api/proposals/${proposalId}/pdf?format=${options.format || 'Letter'}`;
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

    // Get template and styles
    const template = await this.getTemplate();
    const styles = await this.getStyles();

    // Prepare template data
    const templateData = {
      proposal,
      company,
      contact,
      logoUrl: options.logoUrl || '/trueform-logo.png',
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
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }

  private async getTemplate(): Promise<string> {
    // Simple inline template for Vercel compatibility
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposal {{proposalNumber}}</title>
    <style>{{styles}}</style>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
        }
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
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">Print to PDF</button>
    
    <div class="proposal-container">
        <header class="proposal-header">
            {{#if logoUrl}}
            <img src="{{logoUrl}}" alt="TrueForm Logo" class="logo" />
            {{/if}}
            <div class="header-info">
                <h1>Proposal #{{proposalNumber}}</h1>
                <p class="proposal-date">{{proposalDate}}</p>
                <p class="expiry-date">Valid until: {{expiryDate}}</p>
            </div>
        </header>

        <section class="client-info">
            <h2>Prepared For:</h2>
            <div class="client-details">
                <h3>{{company.name}}</h3>
                {{#if contact}}
                <p>{{contact.first_name}} {{contact.last_name}}</p>
                <p>{{contact.email}}</p>
                {{#if contact.phone}}<p>{{contact.phone}}</p>{{/if}}
                {{/if}}
                {{#if company.billing_street}}
                <div class="address">
                    <p>{{company.billing_street}}</p>
                    <p>{{company.billing_city}}, {{company.billing_state}} {{company.billing_zip}}</p>
                </div>
                {{/if}}
            </div>
        </section>

        <section class="line-items">
            <h2>Services</h2>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each proposal.line_items}}
                    <tr>
                        <td>
                            <strong>{{name}}</strong>
                            {{#if description}}<br><small>{{description}}</small>{{/if}}
                        </td>
                        <td>{{quantity}}</td>
                        <td>{{unitPrice}}</td>
                        <td>{{total}}</td>
                    </tr>
                    {{/each}}
                </tbody>
            </table>
        </section>

        <section class="totals">
            <div class="totals-table">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>{{subtotal}}</span>
                </div>
                {{#if tax}}
                <div class="total-row">
                    <span>Tax:</span>
                    <span>{{tax}}</span>
                </div>
                {{/if}}
                <div class="total-row final-total">
                    <span>Total:</span>
                    <span>{{totalAmount}}</span>
                </div>
            </div>
        </section>

        {{#if paymentQR}}
        <section class="qr-section">
            <h3>Quick Payment</h3>
            <img src="{{paymentQR}}" alt="Payment QR Code" class="qr-code" />
        </section>
        {{/if}}

        <footer class="proposal-footer">
            <p>This proposal is valid for 30 days from the date issued.</p>
            <p>Thank you for considering TrueForm for your project.</p>
        </footer>
    </div>

    <script>
        // Auto-print functionality for PDF generation
        if (window.location.search.includes('autoprint=true')) {
            window.onload = () => setTimeout(() => window.print(), 1000);
        }
    </script>
</body>
</html>`;
  }

  private async getStyles(): Promise<string> {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
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

        .proposal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .logo {
            max-height: 60px;
            max-width: 200px;
        }

        .header-info {
            text-align: right;
        }

        .header-info h1 {
            color: #3b82f6;
            font-size: 28px;
            margin-bottom: 5px;
        }

        .proposal-date, .expiry-date {
            color: #666;
            font-size: 14px;
        }

        .client-info {
            margin-bottom: 30px;
        }

        .client-info h2 {
            color: #374151;
            margin-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }

        .client-details h3 {
            color: #3b82f6;
            margin-bottom: 10px;
        }

        .line-items {
            margin-bottom: 30px;
        }

        .line-items h2 {
            color: #374151;
            margin-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th,
        .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        .items-table th {
            background-color: #f3f4f6;
            font-weight: 600;
            color: #374151;
        }

        .items-table td:last-child,
        .items-table th:last-child {
            text-align: right;
        }

        .totals {
            margin-bottom: 30px;
        }

        .totals-table {
            max-width: 300px;
            margin-left: auto;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .final-total {
            font-weight: bold;
            font-size: 18px;
            color: #3b82f6;
            border-bottom: 2px solid #3b82f6;
            margin-top: 10px;
            padding-top: 15px;
        }

        .qr-section {
            text-align: center;
            margin-bottom: 30px;
        }

        .qr-code {
            max-width: 150px;
            margin: 10px 0;
        }

        .proposal-footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

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
        }
    `;
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
}

// Export singleton instance
export const vercelPdfGenerator = new VercelPDFGenerator();