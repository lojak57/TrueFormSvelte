// Preloaded service and product templates for proposals
export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | "web-development"
    | "design"
    | "marketing"
    | "consulting"
    | "maintenance"
    | "hosting";
  basePrice: number;
  unit: "project" | "hour" | "month" | "year" | "page" | "feature";
  popular?: boolean;
  tags: string[];
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  // Web Development - TrueForm New Pricing Model
  {
    id: "web-marketing",
    name: "Marketing Website",
    description:
      "Professional marketing website with conversion optimization and mobile design",
    category: "web-development",
    basePrice: 999,
    unit: "project",
    popular: true,
    tags: ["conversion-focused", "mobile-first", "seo-optimized"],
  },
  {
    id: "web-ecommerce-lite",
    name: "E-commerce Store",
    description:
      "Professional e-commerce store with product catalog and secure payments",
    category: "web-development",
    basePrice: 1199,
    unit: "project",
    popular: true,
    tags: ["product-catalog", "secure-payments", "mobile-optimized"],
  },
  {
    id: "web-booking",
    name: "Booking System Website",
    description:
      "Professional website with automated appointment booking and scheduling",
    category: "web-development",
    basePrice: 1199,
    unit: "project",
    tags: ["booking-system", "automated-scheduling", "calendar-integration"],
  },
  {
    id: "web-membership",
    name: "Membership Site",
    description:
      "Professional membership platform with user management and gated content",
    category: "web-development",
    basePrice: 1499,
    unit: "project",
    tags: ["membership", "user-management", "gated-content", "crm-included"],
  },
  {
    id: "web-realestate",
    name: "Real Estate Platform",
    description:
      "Professional real estate website with property showcases and lead management",
    category: "web-development",
    basePrice: 1899,
    unit: "project",
    tags: ["property-showcase", "lead-management", "crm-included"],
  },
  {
    id: "web-education",
    name: "Educational Platform",
    description:
      "Professional educational platform with course delivery and student management",
    category: "web-development",
    basePrice: 1499,
    unit: "project",
    tags: ["course-delivery", "student-management", "crm-included"],
  },
  {
    id: "crm-integration",
    name: "CRM Integration",
    description:
      "Custom-branded CRM integration with your website for lead and customer management",
    category: "web-development",
    basePrice: 200,
    unit: "project",
    popular: true,
    tags: ["crm", "lead-management", "customer-tracking", "integration"],
  },
  {
    id: "web-ecommerce-full",
    name: "Advanced E-commerce Store",
    description:
      "Full-featured e-commerce solution with advanced inventory and analytics",
    category: "web-development",
    basePrice: 3500,
    unit: "project",
    tags: ["advanced-inventory", "analytics", "full-featured"],
  },
  {
    id: "web-custom",
    name: "Custom Web Application",
    description:
      "Bespoke web application development with advanced functionality",
    category: "web-development",
    basePrice: 150,
    unit: "hour",
    tags: ["custom", "advanced", "api-integration"],
  },
  {
    id: "web-landing",
    name: "Landing Page",
    description: "High-converting landing page with lead capture and analytics",
    category: "web-development",
    basePrice: 1200,
    unit: "project",
    popular: true,
    tags: ["conversion-optimized", "lead-capture", "analytics"],
  },

  // Design Services
  {
    id: "design-logo",
    name: "Logo Design",
    description:
      "Professional logo design with multiple concepts and revisions",
    category: "design",
    basePrice: 800,
    unit: "project",
    tags: ["branding", "identity", "vector"],
  },
  {
    id: "design-branding",
    name: "Complete Brand Package",
    description: "Logo, color palette, typography, and brand guidelines",
    category: "design",
    basePrice: 2200,
    unit: "project",
    popular: true,
    tags: ["logo", "guidelines", "colors", "typography"],
  },
  {
    id: "design-ui-ux",
    name: "UI/UX Design",
    description:
      "User interface and experience design for web or mobile applications",
    category: "design",
    basePrice: 120,
    unit: "hour",
    tags: ["user-experience", "interface", "wireframes"],
  },
  {
    id: "design-graphics",
    name: "Graphic Design",
    description: "Custom graphics, banners, and marketing materials",
    category: "design",
    basePrice: 85,
    unit: "hour",
    tags: ["marketing", "graphics", "print-ready"],
  },

  // Marketing Services
  {
    id: "marketing-seo",
    name: "SEO Optimization",
    description: "Search engine optimization for improved rankings and traffic",
    category: "marketing",
    basePrice: 1500,
    unit: "month",
    popular: true,
    tags: ["search-engine", "rankings", "traffic"],
  },
  {
    id: "marketing-content",
    name: "Content Creation",
    description:
      "Professional content writing for websites and marketing materials",
    category: "marketing",
    basePrice: 95,
    unit: "hour",
    tags: ["copywriting", "content", "marketing"],
  },
  {
    id: "marketing-social",
    name: "Social Media Management",
    description: "Complete social media strategy and content management",
    category: "marketing",
    basePrice: 800,
    unit: "month",
    tags: ["social-media", "content", "strategy"],
  },
  {
    id: "marketing-ads",
    name: "Google Ads Management",
    description: "Professional Google Ads campaign setup and management",
    category: "marketing",
    basePrice: 1200,
    unit: "month",
    tags: ["google-ads", "ppc", "campaigns"],
  },

  // Consulting
  {
    id: "consulting-strategy",
    name: "Digital Strategy Consultation",
    description: "Comprehensive digital strategy and roadmap development",
    category: "consulting",
    basePrice: 185,
    unit: "hour",
    tags: ["strategy", "roadmap", "consultation"],
  },
  {
    id: "consulting-technical",
    name: "Technical Consultation",
    description: "Technical architecture and development guidance",
    category: "consulting",
    basePrice: 165,
    unit: "hour",
    tags: ["technical", "architecture", "guidance"],
  },
  {
    id: "consulting-audit",
    name: "Website Audit",
    description:
      "Comprehensive website analysis with improvement recommendations",
    category: "consulting",
    basePrice: 750,
    unit: "project",
    popular: true,
    tags: ["audit", "analysis", "recommendations"],
  },

  // Maintenance & Support
  {
    id: "crm-monthly",
    name: "CRM Monthly Service",
    description: "Custom-branded CRM with lead management and customer tracking",
    category: "maintenance",
    basePrice: 49,
    unit: "month",
    popular: true,
    tags: ["crm", "lead-management", "customer-tracking", "monthly"],
  },
  {
    id: "maintenance-basic",
    name: "Basic Maintenance",
    description: "Monthly website updates, backups, and security monitoring",
    category: "maintenance",
    basePrice: 150,
    unit: "month",
    popular: true,
    tags: ["updates", "backups", "security"],
  },
  {
    id: "maintenance-premium",
    name: "Premium Maintenance",
    description:
      "Comprehensive maintenance with priority support and performance optimization",
    category: "maintenance",
    basePrice: 300,
    unit: "month",
    tags: ["priority-support", "optimization", "monitoring"],
  },
  {
    id: "maintenance-support",
    name: "Technical Support",
    description: "On-demand technical support and issue resolution",
    category: "maintenance",
    basePrice: 125,
    unit: "hour",
    tags: ["support", "troubleshooting", "on-demand"],
  },

  // Hosting & Infrastructure
  {
    id: "hosting-managed",
    name: "Managed Hosting",
    description:
      "Professional managed hosting with SSL, CDN, and daily backups",
    category: "hosting",
    basePrice: 45,
    unit: "month",
    popular: true,
    tags: ["ssl", "cdn", "backups", "managed"],
  },
  {
    id: "hosting-premium",
    name: "Premium Hosting",
    description:
      "High-performance hosting with advanced security and monitoring",
    category: "hosting",
    basePrice: 85,
    unit: "month",
    tags: ["high-performance", "security", "monitoring"],
  },
  {
    id: "hosting-enterprise",
    name: "Enterprise Hosting",
    description:
      "Enterprise-grade hosting with dedicated resources and 24/7 support",
    category: "hosting",
    basePrice: 200,
    unit: "month",
    tags: ["enterprise", "dedicated", "24-7-support"],
  },
];

export const SERVICE_CATEGORIES = {
  "web-development": {
    name: "Web Development",
    icon: "🌐",
    color: "bg-blue-100 text-blue-700",
  },
  design: {
    name: "Design Services",
    icon: "🎨",
    color: "bg-purple-100 text-purple-700",
  },
  marketing: {
    name: "Marketing",
    icon: "📊",
    color: "bg-green-100 text-green-700",
  },
  consulting: {
    name: "Consulting",
    icon: "💡",
    color: "bg-amber-100 text-amber-700",
  },
  maintenance: {
    name: "Maintenance",
    icon: "🔧",
    color: "bg-orange-100 text-orange-700",
  },
  hosting: {
    name: "Hosting",
    icon: "☁️",
    color: "bg-cyan-100 text-cyan-700",
  },
} as const;

export function getServicesByCategory(
  category: keyof typeof SERVICE_CATEGORIES
) {
  return SERVICE_TEMPLATES.filter((service) => service.category === category);
}

export function getPopularServices() {
  return SERVICE_TEMPLATES.filter((service) => service.popular);
}

export function searchServices(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return SERVICE_TEMPLATES.filter(
    (service) =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.description.toLowerCase().includes(lowercaseQuery) ||
      service.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}
