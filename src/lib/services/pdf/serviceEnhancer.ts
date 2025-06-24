/**
 * Service Enhancement Utilities for PDF Generation
 * Intelligently enhances service descriptions and generates deliverables
 */

export interface ServiceEnhancement {
  enhancedDescription: string;
  deliverables: string[];
  timeline: string;
}

export interface ProjectOverview {
  scope: string;
  methodology: string;
  support: string;
  hosting: string;
  maintenance: string;
}

export interface TechnicalSpecs {
  performance: string;
  security: string;
  seo: string;
  analytics: string;
  browsers: string;
}

export class ServiceEnhancer {
  /**
   * Enhances a service description based on the service name and existing description
   */
  enhanceServiceDescription(item: {
    name: string;
    description?: string;
  }): string {
    if (item.description && item.description.length > 50) {
      return item.description;
    }

    const serviceName = item.name.toLowerCase();

    if (serviceName.includes("frontend") || serviceName.includes("buildout")) {
      return `Modern frontend that works on every device. Fast loading, clean code, ready to scale.`;
    }

    if (
      serviceName.includes("website") ||
      serviceName.includes("development")
    ) {
      return `Full website build from scratch. Modern tech stack, mobile-first design, built to perform.`;
    }

    if (serviceName.includes("design") || serviceName.includes("ui")) {
      return `Clean, conversion-focused design. User research, wireframes, and pixel-perfect mockups.`;
    }

    if (serviceName.includes("backend") || serviceName.includes("api")) {
      return `Secure backend architecture. Fast APIs, solid database design, enterprise-grade security.`;
    }

    if (
      serviceName.includes("consulting") ||
      serviceName.includes("strategy")
    ) {
      return `Expert technical guidance. Architecture review, tech recommendations, clear roadmap.`;
    }

    if (
      serviceName.includes("maintenance") ||
      serviceName.includes("support")
    ) {
      return `Ongoing support and maintenance. Security updates, monitoring, 24/7 peace of mind.`;
    }

    return (
      item.description ||
      `Professional ${item.name.toLowerCase()} delivered on time and on budget.`
    );
  }

  /**
   * Generates deliverables list based on service name and description
   */
  getServiceDeliverables(serviceName: string, description?: string): string[] {
    const name = serviceName.toLowerCase();

    if (name.includes("frontend") || name.includes("buildout")) {
      return [
        "Responsive design",
        "Cross-browser testing",
        "Performance optimization",
        "Clean source code",
        "Documentation",
      ];
    }

    if (name.includes("website") || name.includes("development")) {
      return [
        "Custom website build",
        "Content management",
        "SEO optimization",
        "Analytics setup",
        "Mobile responsive",
        "SSL certificate",
        "Training included",
      ];
    }

    if (name.includes("design") || name.includes("ui")) {
      return [
        "User research",
        "Wireframes",
        "High-fidelity mockups",
        "Interactive prototypes",
        "Design system",
        "Brand guidelines",
      ];
    }

    if (name.includes("backend") || name.includes("api")) {
      return [
        "RESTful APIs",
        "Database design",
        "Authentication system",
        "Data validation",
        "API documentation",
        "Testing suite",
      ];
    }

    if (name.includes("consulting") || name.includes("strategy")) {
      return [
        "Architecture review",
        "Technology recommendations",
        "Performance audit",
        "Security assessment",
        "Implementation roadmap",
      ];
    }

    if (name.includes("maintenance") || name.includes("support")) {
      return [
        "Security updates",
        "Performance monitoring",
        "Bug fixes",
        "Backup & recovery",
        "24/7 monitoring",
        "Monthly reports",
      ];
    }

    return [
      "Professional delivery",
      "Quality assurance",
      "Documentation",
      "Post-launch support",
    ];
  }

  /**
   * Gets estimated timeline based on service type
   */
  getServiceTimeline(serviceName: string): string {
    const name = serviceName.toLowerCase();

    if (name.includes("frontend") || name.includes("buildout")) {
      return "3-4 weeks";
    }

    if (name.includes("website") || name.includes("development")) {
      return "4-6 weeks";
    }

    if (name.includes("design") || name.includes("ui")) {
      return "2-3 weeks";
    }

    if (name.includes("backend") || name.includes("api")) {
      return "3-5 weeks";
    }

    if (name.includes("consulting") || name.includes("strategy")) {
      return "1-2 weeks";
    }

    if (name.includes("maintenance") || name.includes("support")) {
      return "Ongoing";
    }

    return "2-4 weeks";
  }

  /**
   * Generates project overview information
   */
  getProjectOverview(proposal: any): ProjectOverview {
    return {
      scope:
        "Professional web development solution tailored to your business needs",
      methodology:
        "Agile development with regular client updates and feedback loops",
      support: "30 days of post-launch support and bug fixes included",
      hosting: "Optimized for modern cloud hosting platforms",
      maintenance: "Optional ongoing maintenance and updates available",
    };
  }

  /**
   * Generates technical specifications
   */
  getTechnicalSpecs(): TechnicalSpecs {
    return {
      performance: "Lighthouse score 90+ guaranteed",
      security: "Industry-standard security practices and SSL encryption",
      seo: "SEO-optimized with structured data and meta tags",
      analytics: "Google Analytics 4 and conversion tracking setup",
      browsers: "Support for all modern browsers including mobile",
    };
  }

  /**
   * Enhances a complete service item with all enhancements
   */
  enhanceService(item: any): any {
    return {
      ...item,
      enhancedDescription: this.enhanceServiceDescription(item),
      deliverables: this.getServiceDeliverables(item.name, item.description),
      timeline: this.getServiceTimeline(item.name),
    };
  }
}

// Export singleton instance
export const serviceEnhancer = new ServiceEnhancer();
