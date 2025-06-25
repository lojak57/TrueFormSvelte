import type { TrueFormOpportunity } from "$lib/api/trueform";

export function getOpportunitiesByStatus(
  opportunities: TrueFormOpportunity[],
  status: string
): TrueFormOpportunity[] {
  return opportunities.filter((opp) => opp.status === status);
}

export function isRecentOpportunity(createdAt: string): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
}

export function calculateTotalValue(
  opportunities: TrueFormOpportunity[]
): number {
  return opportunities.reduce((total, opp) => total + (opp.value || 0), 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}
