import type { Company, Contact, Proposal } from "$lib/types";

// TODO: Re-enable when Stripe is integrated (next week)
// Temporarily disabled for deployment since Stripe isn't integrated yet

export interface PaymentLinkOptions {
  proposal: Proposal;
  company: Company;
  contact?: Contact;
  successUrl?: string;
  cancelUrl?: string;
  allowPromotionCodes?: boolean;
  paymentMethodTypes?: any[];
}

// Temporary placeholder service for deployment
export const stripeService = {
  createPaymentLink: async (): Promise<string> => {
    throw new Error("Stripe not integrated yet - available next week");
  },
  createACHPaymentLink: async (): Promise<string> => {
    throw new Error("Stripe not integrated yet - available next week");
  },
  createInstallmentPlan: async (): Promise<string[]> => {
    throw new Error("Stripe not integrated yet - available next week");
  },
  verifyPayment: async () => ({ success: false }),
  refundPayment: async () => false,
  createCustomer: async (): Promise<string> => {
    throw new Error("Stripe not integrated yet - available next week");
  },
};

/* 
TODO: Uncomment when ready to integrate Stripe (next week)

import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

export class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  }

  async createPaymentLink(options: PaymentLinkOptions): Promise<string> {
    const { proposal, company, contact, successUrl, cancelUrl } = options;

    try {
      // Create line items for Stripe
      const lineItems = proposal.line_items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || `Service for ${company.name}`,
            metadata: {
              proposal_id: proposal.id,
              company_id: company.id,
              service_type: 'professional_service'
            }
          },
          unit_amount: Math.round(item.unitPrice * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      // Add tax as a separate line item if applicable
      if (proposal.tax > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tax (${proposal.tax_rate}%)`,
              description: 'Applicable taxes',
              metadata: {
                proposal_id: proposal.id,
                item_type: 'tax'
              }
            },
            unit_amount: Math.round(proposal.tax * 100),
          },
          quantity: 1,
        });
      }

      // Create checkout session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: options.paymentMethodTypes || ['card', 'us_bank_account'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl || `${process.env.PUBLIC_SITE_URL}/proposals/${proposal.id}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.PUBLIC_SITE_URL}/proposals/${proposal.id}/payment-cancelled`,
        customer_email: contact?.email,
        allow_promotion_codes: options.allowPromotionCodes || false,
        metadata: {
          proposal_id: proposal.id,
          company_id: company.id,
          contact_id: contact?.id || '',
          total_amount: proposal.total.toString()
        },
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA']
        },
        payment_intent_data: {
          description: `Payment for ${proposal.title} - ${company.name}`,
          metadata: {
            proposal_id: proposal.id,
            company_name: company.name,
            proposal_title: proposal.title
          }
        },
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: `Invoice for ${proposal.title}`,
            metadata: {
              proposal_id: proposal.id,
              company_id: company.id
            },
            footer: 'Thank you for choosing TrueForm Digital Solutions!'
          }
        }
      });

      return session.url || '';
    } catch (error) {
      console.error('Error creating Stripe payment link:', error);
      throw new Error('Failed to create payment link');
    }
  }

  async createACHPaymentLink(options: PaymentLinkOptions): Promise<string> {
    // ACH-only payment link (saves 3% processing fee)
    return this.createPaymentLink({
      ...options,
      paymentMethodTypes: ['us_bank_account']
    });
  }

  async createInstallmentPlan(
    options: PaymentLinkOptions,
    installments: number = 3
  ): Promise<string[]> {
    const { proposal } = options;
    const installmentAmount = Math.round((proposal.total / installments) * 100); // Convert to cents
    
    const paymentLinks: string[] = [];

    for (let i = 0; i < installments; i++) {
      const isFirstPayment = i === 0;
      const paymentNumber = i + 1;
      
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${proposal.title} - Payment ${paymentNumber} of ${installments}`,
              description: isFirstPayment 
                ? `First installment for ${proposal.title}`
                : `Installment ${paymentNumber} for ${proposal.title}`,
              metadata: {
                proposal_id: proposal.id,
                installment_number: paymentNumber.toString(),
                total_installments: installments.toString()
              }
            },
            unit_amount: installmentAmount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.PUBLIC_SITE_URL}/proposals/${proposal.id}/installment-success?payment=${paymentNumber}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.PUBLIC_SITE_URL}/proposals/${proposal.id}/payment-cancelled`,
        customer_email: options.contact?.email,
        metadata: {
          proposal_id: proposal.id,
          company_id: options.company.id,
          installment_number: paymentNumber.toString(),
          total_installments: installments.toString(),
          installment_amount: (installmentAmount / 100).toString()
        }
      });

      if (session.url) {
        paymentLinks.push(session.url);
      }
    }

    return paymentLinks;
  }

  async verifyPayment(sessionId: string): Promise<{
    success: boolean;
    proposalId?: string;
    amount?: number;
    customerEmail?: string;
  }> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        success: session.payment_status === 'paid',
        proposalId: session.metadata?.proposal_id,
        amount: session.amount_total ? session.amount_total / 100 : undefined,
        customerEmail: session.customer_email || undefined
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false };
    }
  }

  async refundPayment(sessionId: string, reason?: string): Promise<boolean> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_intent && typeof session.payment_intent === 'string') {
        await this.stripe.refunds.create({
          payment_intent: session.payment_intent,
          reason: reason === 'requested_by_customer' ? 'requested_by_customer' : 'duplicate'
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }

  async createCustomer(company: Company, contact?: Contact): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        name: company.name,
        email: contact?.email,
        phone: contact?.phone,
        address: {
          line1: company.billing_street || '',
          city: company.billing_city || '',
          state: company.billing_state || '',
          postal_code: company.billing_zip || '',
          country: company.billing_country || 'US'
        },
        metadata: {
          company_id: company.id,
          contact_id: contact?.id || '',
          source: 'proposal_system'
        }
      });

      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }
}

// Export singleton instance
export const stripeService = new StripePaymentService();
*/
