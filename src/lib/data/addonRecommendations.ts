// Service requirements - these add-ons are automatically included
export const serviceRequirements: Record<string, string[]> = {
  marketing: ["crm"],
  ecommerce: ["ecommerce"],
  booking: ["booking"],
  membership: ["membership"],
  realestate: ["domain-email"],
  education: ["domain-email"],
};

// Service-specific recommendations
export const serviceRecommendations: Record<string, string[]> = {
  marketing: ["crm", "copywriting"],
  ecommerce: ["crm", "seo"],
  booking: ["crm", "domain-email"],
  membership: ["social-media", "domain-email"],
  realestate: ["social-media", "seo", "domain-email"],
  education: ["social-media", "copywriting"],
};
