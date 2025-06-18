/**
 * TrueForm Money Class
 * Core money operations with precision handling
 */

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";

export class Money {
  private readonly amount: number;
  private readonly currency: CurrencyCode;
  private readonly decimalPlaces: number;

  constructor(
    amount: number,
    currency: CurrencyCode = "USD",
    decimalPlaces?: number
  ) {
    this.currency = currency;
    this.decimalPlaces = decimalPlaces ?? this.getDecimalPlaces(currency);
    // Round to prevent floating point precision issues
    this.amount = this.roundToPrecision(amount, this.decimalPlaces);
  }

  // ============================================================================
  // CORE OPERATIONS
  // ============================================================================

  add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(
      this.amount + other.amount,
      this.currency,
      this.decimalPlaces
    );
  }

  subtract(other: Money): Money {
    this.validateCurrency(other);
    return new Money(
      this.amount - other.amount,
      this.currency,
      this.decimalPlaces
    );
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency, this.decimalPlaces);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error("Cannot divide by zero");
    }
    return new Money(this.amount / divisor, this.currency, this.decimalPlaces);
  }

  // ============================================================================
  // TAX CALCULATIONS
  // ============================================================================

  calculateTax(rate: number): Money {
    if (rate < 0 || rate > 1) {
      throw new Error("Tax rate must be between 0 and 1");
    }
    return new Money(this.amount * rate, this.currency, this.decimalPlaces);
  }

  addTax(rate: number): Money {
    return this.add(this.calculateTax(rate));
  }

  // ============================================================================
  // COMPARISON OPERATIONS
  // ============================================================================

  equals(other: Money): boolean {
    this.validateCurrency(other);
    return Math.abs(this.amount - other.amount) < Number.EPSILON;
  }

  greaterThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amount > other.amount;
  }

  lessThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amount < other.amount;
  }

  isZero(): boolean {
    return Math.abs(this.amount) < Number.EPSILON;
  }

  isPositive(): boolean {
    return this.amount > Number.EPSILON;
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  get value(): number {
    return this.amount;
  }

  get currencyCode(): CurrencyCode {
    return this.currency;
  }

  get cents(): number {
    return Math.round(this.amount * Math.pow(10, this.decimalPlaces));
  }

  // ============================================================================
  // STATIC FACTORY METHODS
  // ============================================================================

  static fromCents(cents: number, currency: CurrencyCode = "USD"): Money {
    const decimalPlaces = Money.prototype.getDecimalPlaces(currency);
    const amount = cents / Math.pow(10, decimalPlaces);
    return new Money(amount, currency, decimalPlaces);
  }

  static fromString(value: string, currency: CurrencyCode = "USD"): Money {
    const cleanValue = value.replace(/[^\d.-]/g, "");
    const amount = parseFloat(cleanValue);

    if (isNaN(amount)) {
      throw new Error(`Invalid money string: ${value}`);
    }

    return new Money(amount, currency);
  }

  static zero(currency: CurrencyCode = "USD"): Money {
    return new Money(0, currency);
  }

  static sum(amounts: Money[]): Money {
    if (amounts.length === 0) {
      return Money.zero();
    }

    return amounts.reduce((total, amount) => total.add(amount));
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private validateCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Currency mismatch: cannot operate on ${this.currency} and ${other.currency}`
      );
    }
  }

  private roundToPrecision(value: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  }

  private getDecimalPlaces(currency: CurrencyCode): number {
    // JPY typically has 0 decimal places, others have 2
    switch (currency) {
      case "JPY":
        return 0;
      default:
        return 2;
    }
  }
}

// Default export
export default Money;
