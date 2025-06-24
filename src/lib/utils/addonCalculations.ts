// Addon calculation utilities for conversational wizard

export interface Addon {
  id: string;
  title: string;
  price: number;
  description: string;
  icon: any;
  imageBg: string;
  iconColor: string;
  benefits: string[];
  popular?: boolean;
}

export interface PriceCalculation {
  basePrice: number;
  addonTotal: number;
  estimatedTotal: number;
  selectedAddons: Addon[];
}

/**
 * Calculate the total price including base price and selected addons
 */
export function calculateTotalPrice(
  basePrice: number,
  selectedAddons: Addon[]
): PriceCalculation {
  const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const estimatedTotal = basePrice + addonTotal;

  return {
    basePrice,
    addonTotal,
    estimatedTotal,
    selectedAddons: [...selectedAddons],
  };
}

/**
 * Format price as currency
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Toggle addon selection in array
 */
export function toggleAddonSelection(
  currentSelection: Addon[],
  addonToToggle: Addon
): Addon[] {
  const isSelected = currentSelection.some((addon) => addon.id === addonToToggle.id);

  if (isSelected) {
    return currentSelection.filter((addon) => addon.id !== addonToToggle.id);
  } else {
    return [...currentSelection, addonToToggle];
  }
}

/**
 * Check if addon is currently selected
 */
export function isAddonSelected(selection: Addon[], addonId: string): boolean {
  return selection.some((addon) => addon.id === addonId);
}

/**
 * Get savings information for package deals
 */
export function calculateSavings(
  estimatedTotal: number,
  marketRate: number = 2.5
): {
  marketValue: number;
  savings: number;
  savingsPercentage: number;
} {
  const marketValue = estimatedTotal * marketRate;
  const savings = marketValue - estimatedTotal;
  const savingsPercentage = Math.round((savings / marketValue) * 100);

  return {
    marketValue,
    savings,
    savingsPercentage,
  };
}

/**
 * Validate addon selection rules
 */
export function validateAddonSelection(selectedAddons: Addon[]): {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check for conflicting addons
  const hasEcommerce = selectedAddons.some((addon) => addon.id === "ecommerce");
  const hasBooking = selectedAddons.some((addon) => addon.id === "booking");

  if (hasEcommerce && hasBooking) {
    warnings.push("E-commerce and booking systems may have integration complexities");
  }

  // Check for recommended combinations
  const hasCRM = selectedAddons.some((addon) => addon.id === "crm");
  const hasEmail = selectedAddons.some((addon) => addon.id === "email");

  if (hasCRM && !hasEmail) {
    recommendations.push("Email marketing pairs well with CRM for lead nurturing");
  }

  if (hasEcommerce && !hasCRM) {
    recommendations.push("CRM integration helps track e-commerce customers");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations,
  };
}