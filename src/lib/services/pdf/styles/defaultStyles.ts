/**
 * Default PDF Template Styles
 * Professional styling for business proposals
 */
export const defaultStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 12px;
    line-height: 1.6;
    color: #333;
    background: #fff;
  }

  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 72px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.1);
    z-index: -1;
    pointer-events: none;
  }

  .header {
    border-bottom: 2px solid #007acc;
    padding: 30px 0;
    margin-bottom: 40px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .logo {
    max-height: 60px;
    max-width: 200px;
  }

  .proposal-info {
    text-align: right;
  }

  .proposal-info h1 {
    font-size: 24px;
    color: #007acc;
    margin-bottom: 10px;
  }

  .proposal-meta div {
    margin-bottom: 5px;
    font-size: 11px;
    color: #666;
  }

  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .title-section {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #eee;
  }

  .project-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 15px;
  }

  .project-description {
    font-size: 14px;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }

  section {
    margin-bottom: 40px;
  }

  h2 {
    font-size: 18px;
    color: #007acc;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #007acc;
  }

  .client-info {
    display: flex;
    justify-content: space-between;
  }

  .client-primary h3 {
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
  }

  .client-primary p,
  .client-address p {
    margin-bottom: 5px;
    color: #666;
  }

  .client-address h4 {
    margin-bottom: 10px;
    color: #333;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .overview-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .overview-item strong {
    color: #333;
  }

  .overview-item span {
    color: #666;
  }

  .line-items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .line-items-table th {
    background: #f8f9fa;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #007acc;
    color: #333;
  }

  .line-items-table td {
    padding: 15px 12px;
    border-bottom: 1px solid #eee;
    vertical-align: top;
  }

  .item-title {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
  }

  .item-description {
    font-size: 11px;
    color: #666;
    margin-bottom: 8px;
  }

  .item-meta {
    font-size: 10px;
    color: #888;
  }

  .item-meta span {
    margin-right: 15px;
  }

  .item-quantity,
  .item-unit,
  .item-rate,
  .item-total {
    text-align: right;
    white-space: nowrap;
  }

  .pricing-summary {
    margin-left: auto;
    max-width: 300px;
    border: 1px solid #eee;
    padding: 20px;
    background: #f8f9fa;
  }

  .pricing-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 5px 0;
  }

  .total-row {
    border-top: 2px solid #007acc;
    font-weight: 600;
    font-size: 14px;
    color: #007acc;
    margin-top: 15px;
    padding-top: 15px;
  }

  .terms-item {
    margin-bottom: 20px;
  }

  .terms-item strong {
    display: block;
    margin-bottom: 8px;
    color: #333;
  }

  .terms-item p {
    color: #666;
    padding-left: 0;
  }

  .footer {
    margin-top: 60px;
    padding: 30px 0;
    border-top: 1px solid #eee;
    text-align: center;
    color: #888;
    font-size: 10px;
  }

  .footer-content p {
    margin-bottom: 5px;
  }

  @media print {
    body {
      font-size: 11px;
    }
    
    .header-content,
    .main-content {
      padding: 0 20px;
    }
    
    section {
      page-break-inside: avoid;
    }
    
    .line-items-table {
      page-break-inside: auto;
    }
    
    .line-item {
      page-break-inside: avoid;
    }
  }
`; 