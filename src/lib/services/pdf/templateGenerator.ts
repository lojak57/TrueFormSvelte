/**
 * PDF Template Generator
 * Handles the generation of HTML templates for PDF proposals
 */

export class TemplateGenerator {
  /**
   * Generates the main PDF template with all sections
   */
  generateTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposal {{proposalNumber}} - TrueForm</title>
    <style>{{styles}}</style>
</head>
<body>
    <!-- Watermark -->
    <div class="watermark">
        {{#if logoUrl}}
            <img src="{{logoUrl}}" alt="TrueForm" class="watermark-logo">
        {{/if}}
    </div>

    <!-- Page 1: Cover & Overview -->
    <div class="page">
        ${this.getHeaderSection()}
        ${this.getHeroSection()}
        ${this.getServicesSection()}
        ${this.getProjectOverviewSection()}
        ${this.getPricingBreakdownSection()}
    </div>

    <!-- Page 2: Payment & Next Steps -->
    <div class="page">
        ${this.getPageTwoHeader()}
        ${this.getPaymentMethodsSection()}
        ${this.getNextStepsSection()}
        ${this.getFooterContactSection()}
    </div>
</body>
</html>`;
  }

  private getHeaderSection(): string {
    return `
        <div class="header-card">
            <div class="header-content">
                <div class="logo-section">
                    {{#if logoUrl}}
                        <img src="{{logoUrl}}" alt="TrueForm" class="logo-large">
                    {{/if}}
                </div>
                <div class="proposal-meta">
                    <div class="proposal-number">{{proposalNumber}}</div>
                    <div class="proposal-date">{{proposalDate}}</div>
                </div>
            </div>
        </div>`;
  }

  private getHeroSection(): string {
    return `
        <div class="hero-section">
            <div class="proposal-title-card">
                <h1 class="proposal-title">{{proposal.formattedTitle}}</h1>
                <div class="client-info">
                    <div class="company-section">
                        <div class="company-name">{{company.name}}</div>
                        {{#if contact}}
                            <div class="contact-details">{{contact.name}} • {{contact.email}}</div>
                        {{/if}}
                    </div>
                    <div class="total-investment">
                        <div class="investment-label">Total Investment</div>
                        <div class="investment-amount">{{totalAmount}}</div>
                    </div>
                </div>
            </div>
        </div>`;
  }

  private getServicesSection(): string {
    return `
        <div class="services-overview completed-section">
            <h2>What's Included</h2>
            <div class="services-grid">
                {{#each proposal.line_items}}
                    <div class="service-card accent-orange">
                        <div class="service-header">
                            <div class="service-name">{{name}}</div>
                            <div class="service-price">{{total}}</div>
                        </div>
                        <div class="service-description">{{enhancedDescription}}</div>
                        <div class="service-deliverables">
                            <h4>You Get:</h4>
                            <ul class="deliverables-list">
                                {{#each deliverables}}
                                <li>{{this}}</li>
                                {{/each}}
                            </ul>
                        </div>
                        <div class="service-meta">
                            <span class="timeline">{{timeline}}</span>
                        </div>
                    </div>
                {{/each}}
            </div>
        </div>`;
  }

  private getProjectOverviewSection(): string {
    return `
        <div class="project-overview">
            <h2>How We Work</h2>
            <div class="overview-grid">
                <div class="overview-card accent-orange">
                    <h4>Our Approach</h4>
                    <p>{{projectOverview.methodology}}</p>
                </div>
                <div class="overview-card accent-green">
                    <h4>Your Involvement</h4>
                    <p>Quick feedback rounds. You approve, we deliver.</p>
                </div>
                <div class="overview-card accent-orange">
                    <h4>After Launch</h4>
                    <p>{{projectOverview.support}}</p>
                </div>
                <div class="overview-card accent-green">
                    <h4>Technical Excellence</h4>
                    <p>{{technicalSpecs.performance}} with modern, scalable architecture.</p>
                </div>
            </div>
        </div>`;
  }

  private getPricingBreakdownSection(): string {
    return `
        <div class="pricing-breakdown">
            <h2>The Numbers</h2>
            <div class="breakdown-card accent-green">
                {{#each proposal.line_items}}
                    <div class="breakdown-item">
                        <span class="item-name">{{name}}</span>
                        <span class="item-total">{{total}}</span>
                    </div>
                {{/each}}
                <div class="breakdown-subtotal">
                    <span>Subtotal</span>
                    <span>{{subtotal}}</span>
                </div>
                <div class="breakdown-tax">
                    <span>Tax ({{proposal.tax_rate}}%)</span>
                    <span>{{tax}}</span>
                </div>
                <div class="breakdown-total">
                    <span>Total Investment</span>
                    <span>{{totalAmount}}</span>
                </div>
            </div>
        </div>`;
  }

  private getPageTwoHeader(): string {
    return `
        <div class="header-minimal">
            <div class="logo-small">
                {{#if logoUrl}}
                    <img src="{{logoUrl}}" alt="TrueForm" class="logo-sm">
                {{/if}}
            </div>
            <div class="page-title">How to Pay</div>
        </div>`;
  }

  private getPaymentMethodsSection(): string {
    return `
        <div class="payment-methods">
            <h2>Pick One</h2>
            <div class="payment-grid">
                <div class="payment-card primary accent-top-orange">
                    <div class="payment-header">
                        <div class="payment-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                        </div>
                        <div class="payment-title">Pay Now</div>
                    </div>
                    <div class="payment-description">Credit card. Quick & secure.</div>
                    {{#if paymentQR}}
                        <div class="qr-container">
                            <img src="{{paymentQR}}" alt="Payment QR" class="qr-code">
                            <div class="qr-label">Scan → Pay {{totalAmount}}</div>
                        </div>
                    {{/if}}
                </div>
                
                <div class="payment-card">
                    <div class="payment-header">
                        <div class="payment-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M12 3v18"/>
                            </svg>
                        </div>
                        <div class="payment-title">Wire Transfer</div>
                    </div>
                    <div class="payment-description">Save 3% processing fee.</div>
                    <div class="payment-note">Email us for wire details</div>
                </div>
            </div>
        </div>`;
  }

  private getNextStepsSection(): string {
    return `
        <div class="next-steps-section">
            <h2>Next Steps</h2>
            <div class="steps-card accent-green">
                {{#if acceptanceQR}}
                    <div class="acceptance-qr">
                        <img src="{{acceptanceQR}}" alt="Accept Proposal" class="qr-code">
                        <div class="qr-label">Scan to Accept</div>
                    </div>
                {{/if}}
                <div class="steps-content">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-text">Read this. Ask questions.</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-text">Pick payment method above.</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-text">We'll email you project kickoff details.</div>
                    </div>
                </div>
            </div>
        </div>`;
  }

  private getFooterContactSection(): string {
    return `
        <div class="footer-contact">
            <div class="contact-card">
                <div class="contact-header">
                    <h3>Questions?</h3>
                </div>
                <div class="contact-grid">
                    <div class="contact-item">
                        <div class="contact-label">Email</div>
                        <div class="contact-value"><a href="mailto:mitch.mechelay@true-form-apps.com">mitch.mechelay@true-form-apps.com</a></div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-label">Phone</div>
                        <div class="contact-value"><a href="tel:+17209936562">(720) 993-6562</a></div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-label">Web</div>
                        <div class="contact-value"><a href="https://true-form-apps.com" target="_blank">true-form-apps.com</a></div>
                    </div>
                </div>
                <div class="validity-notice">
                    Valid until {{expiryDate}} • No surprises
                </div>
            </div>
        </div>`;
  }

  /**
   * Gets the external template file if available
   */
  async getExternalTemplate(): Promise<string | null> {
    try {
      const templatePath = new URL("./template.html", import.meta.url).pathname;
      const fs = await import("fs/promises");
      return await fs.readFile(templatePath, "utf-8");
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const templateGenerator = new TemplateGenerator();
