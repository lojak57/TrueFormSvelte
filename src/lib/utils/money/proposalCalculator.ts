import Money, { type CurrencyCode } from './money';

/**
 * Proposal Calculator
 * Business-specific money calculations for proposals
 */

export interface LineItemCalculation {
  unitPrice: Money;
  quantity: number;
  total: Money;
}

export interface ProposalTotals {
  subtotal: Money;
  taxAmount: Money;
  total: Money;
  taxRate: number;
}

export class ProposalCalculator {
  private readonly currency: CurrencyCode;

  constructor(currency: CurrencyCode = 'USD') {
    this.currency = currency;
  }

  /**
   * Calculate line item total
   */
  calculateLineItem(unitPrice: number, quantity: number): LineItemCalculation {
    const price = new Money(unitPrice, this.currency);
    const total = price.multiply(quantity);

    return {
      unitPrice: price,
      quantity,
      total
    };
  }

  /**
   * Calculate proposal totals from line items
   */
  calculateProposalTotals(
    lineItems: Array<{ unitPrice: number; quantity: number }>,
    taxRate: number = 0
  ): ProposalTotals {
    const lineItemTotals = lineItems.map(item => 
      this.calculateLineItem(item.unitPrice, item.quantity).total
    );

    const subtotal = Money.sum(lineItemTotals);
    const taxAmount = subtotal.calculateTax(taxRate);
    const total = subtotal.add(taxAmount);

    return {
      subtotal,
      taxAmount,
      total,
      taxRate
    };
  }

  /**
   * Calculate estimated hours total
   */
  calculateTotalHours(
    lineItems: Array<{ estimatedHours?: number; quantity: number }>
  ): number {
    return lineItems.reduce((total, item) => {
      const hours = item.estimatedHours || 0;
      return total + (hours * item.quantity);
    }, 0);
  }

  /**
   * Calculate average hourly rate from proposal
   */
  calculateAverageHourlyRate(
    totalAmount: Money,
    totalHours: number
  ): Money | null {
    if (totalHours <= 0) {
      return null;
    }
    return totalAmount.divide(totalHours);
  }

  /**
   * Apply discount to money amount
   */
  applyDiscount(amount: Money, percentage: number): Money {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    const discountRate = percentage / 100;
    return amount.multiply(1 - discountRate);
  }
} 