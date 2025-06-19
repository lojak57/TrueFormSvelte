/**
 * Simple PDF Generator that creates clean, printable HTML
 */

export interface SimplePDFData {
  proposal: {
    id: string;
    title: string;
    line_items: Array<{
      name: string;
      description?: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    tax_rate: number;
    total: number;
    created_at: string;
  };
  company: {
    name: string;
    email?: string;
    phone?: string;
  };
  contact?: {
    first_name: string;
    last_name: string;
    email?: string;
    title?: string;
  };
}

export function generateSimplePDF(data: SimplePDFData): string {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal - ${data.proposal.title}</title>
  <style>
    @page {
      size: Letter;
      margin: 0.75in;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
      background: white;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    .header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
    }
    
    .proposal-info {
      text-align: right;
    }
    
    .proposal-number {
      font-size: 18px;
      font-weight: bold;
      color: #2563eb;
    }
    
    .proposal-date {
      color: #666;
      margin-top: 5px;
    }
    
    .title-section {
      margin-bottom: 30px;
    }
    
    .proposal-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #1a1a1a;
    }
    
    .client-info {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #2563eb;
    }
    
    .client-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .client-details {
      color: #666;
      line-height: 1.6;
    }
    
    .total-highlight {
      background: #2563eb;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    
    .total-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    
    .total-amount {
      font-size: 32px;
      font-weight: bold;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin: 30px 0 20px 0;
      color: #1a1a1a;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    
    .line-items {
      margin-bottom: 30px;
    }
    
    .line-item {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 12px;
      background: white;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .item-name {
      font-weight: 600;
      font-size: 16px;
    }
    
    .item-price {
      font-weight: bold;
      color: #2563eb;
      font-size: 16px;
    }
    
    .item-description {
      color: #666;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .item-meta {
      color: #888;
      font-size: 13px;
    }
    
    .breakdown {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
    
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .breakdown-row:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 18px;
      padding-top: 16px;
      border-top: 2px solid #2563eb;
      margin-top: 12px;
    }
    
    .terms {
      margin-top: 40px;
      padding: 20px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    
    .terms h3 {
      margin-top: 0;
      color: #2563eb;
    }
    
    .terms ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .terms li {
      margin-bottom: 8px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    
    @media print {
      body { 
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">TrueForm</div>
      <div class="proposal-info">
        <div class="proposal-number">Proposal #${data.proposal.id.slice(-8).toUpperCase()}</div>
        <div class="proposal-date">${formatDate(data.proposal.created_at)}</div>
      </div>
    </div>
    
    <!-- Title -->
    <div class="title-section">
      <h1 class="proposal-title">${data.proposal.title}</h1>
    </div>
    
    <!-- Client Info -->
    <div class="client-info">
      <div class="client-name">${data.company.name}</div>
      <div class="client-details">
        ${data.contact ? `${data.contact.first_name} ${data.contact.last_name}` : ''}
        ${data.contact?.title ? ` • ${data.contact.title}` : ''}
        ${data.contact?.email ? `<br>${data.contact.email}` : ''}
        ${data.company.phone ? `<br>${data.company.phone}` : ''}
      </div>
    </div>
    
    <!-- Total Highlight -->
    <div class="total-highlight">
      <div class="total-label">Total Investment</div>
      <div class="total-amount">${formatCurrency(data.proposal.total)}</div>
    </div>
    
    <!-- Line Items -->
    <h2 class="section-title">What's Included</h2>
    <div class="line-items">
      ${data.proposal.line_items.map(item => `
        <div class="line-item">
          <div class="item-header">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${formatCurrency(item.total)}</div>
          </div>
          ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
          <div class="item-meta">
            Quantity: ${item.quantity} × ${formatCurrency(item.unitPrice)} each
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- Breakdown -->
    <h2 class="section-title">Investment Breakdown</h2>
    <div class="breakdown">
      <div class="breakdown-row">
        <span>Subtotal</span>
        <span>${formatCurrency(data.proposal.subtotal)}</span>
      </div>
      <div class="breakdown-row">
        <span>Tax (${data.proposal.tax_rate}%)</span>
        <span>${formatCurrency(data.proposal.tax)}</span>
      </div>
      <div class="breakdown-row">
        <span>Total</span>
        <span>${formatCurrency(data.proposal.total)}</span>
      </div>
    </div>
    
    <!-- Terms -->
    <div class="terms">
      <h3>Terms & Conditions</h3>
      <ul>
        <li>50% deposit required to begin work</li>
        <li>Remaining 50% due upon project completion</li>
        <li>Timeline: 7-14 business days from deposit</li>
        <li>Includes one year of hosting and support</li>
        <li>Additional revisions available at $150/hour</li>
      </ul>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>This proposal is valid for 30 days from the date above.</p>
      <p>TrueForm • Professional Website Development • hello@true-form-apps.com</p>
    </div>
  </div>
</body>
</html>`;
}