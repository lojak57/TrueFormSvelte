import {
  createTrueFormOpportunity,
  getTrueFormOpportunities,
  updateOpportunityStatus,
} from "$lib/api/trueform-server";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// Lead scoring algorithm
function calculateLeadScore(data: any): {
  score: number;
  priority: string;
  factors: string[];
} {
  let score = 50; // Base score
  const factors = [];

  // Decision Making Authority (0-25 points)
  switch (data.decisionAuthority) {
    case "decision_maker":
      score += 25;
      factors.push("Decision maker identified");
      break;
    case "influencer":
      score += 15;
      factors.push("Key influencer");
      break;
    case "team_decision":
      score += 10;
      factors.push("Team decision process");
      break;
    case "researcher":
      score += 5;
      factors.push("Research phase");
      break;
  }

  // Budget Context (0-25 points)
  switch (data.budgetContext) {
    case "budget_approved":
      score += 25;
      factors.push("Budget already approved");
      break;
    case "budget_flexible":
      score += 20;
      factors.push("Flexible budget");
      break;
    case "budget_researching":
      score += 15;
      factors.push("Researching investment");
      break;
    case "budget_constrained":
      score += 10;
      factors.push("Budget conscious");
      break;
    case "budget_exploring":
      score += 5;
      factors.push("Early exploration");
      break;
  }

  // Project Urgency (0-25 points)
  switch (data.projectUrgency) {
    case "urgent_deadline":
      score += 25;
      factors.push("Has specific deadline");
      break;
    case "high_priority":
      score += 20;
      factors.push("High priority project");
      break;
    case "planned_project":
      score += 15;
      factors.push("Planned initiative");
      break;
    case "when_ready":
      score += 10;
      factors.push("Quality over speed");
      break;
    case "exploring":
      score += 5;
      factors.push("Exploring options");
      break;
  }

  // Current Situation - Pain Level (0-20 points)
  switch (data.currentSituation) {
    case "losing_business":
      score += 20;
      factors.push("Losing business opportunities");
      break;
    case "no_website":
    case "competitor_pressure":
      score += 18;
      factors.push("Competitive pressure");
      break;
    case "outdated_website":
    case "new_launch":
    case "growth_phase":
      score += 15;
      factors.push("Growth-driven need");
      break;
    case "modernize":
      score += 10;
      factors.push("Modernization initiative");
      break;
  }

  // Competitor Context (0-15 points)
  switch (data.competitorContext) {
    case "first_choice":
      score += 15;
      factors.push("We are first choice");
      break;
    case "referral":
      score += 12;
      factors.push("Came via referral");
      break;
    case "quotes_received":
      score += 10;
      factors.push("Actively comparing quotes");
      break;
    case "quotes_pending":
      score += 8;
      factors.push("Getting multiple quotes");
      break;
    case "researching":
      score += 5;
      factors.push("Still researching");
      break;
  }

  // Project Complexity Bonus (0-10 points)
  const features = data.coreFeatures || [];
  if (features.length > 8) {
    score += 10;
    factors.push("Complex project requirements");
  } else if (features.length > 5) {
    score += 5;
    factors.push("Moderate complexity");
  }

  // Timeline Urgency Bonus (0-5 points)
  if (data.timeline === "ASAP" || data.timeline === "1-2 weeks") {
    score += 5;
    factors.push("Urgent timeline");
  }

  // Determine priority level
  let priority = "LOW";
  if (score >= 85) priority = "CRITICAL";
  else if (score >= 70) priority = "HIGH";
  else if (score >= 55) priority = "MEDIUM";

  return { score: Math.min(score, 100), priority, factors };
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    // Updated pricing model to match the wizard - includes ALL features
    const PRICING_MODEL = {
      base: 999,
      includedFeatures: 6,
      addOnCosts: {
        // Premium features (add-on costs)
        blog: 100, // Blog/News
        chat: 50, // Live Chat
        members: 250, // Customer Portal
        newsletter: 200, // Email Newsletter
        multilang: 200, // Multi-language Support
        mobile: 500, // Custom Application (enterprise)
        booking: 150, // Appointment Booking
        payment: 200, // Payment Processing
        rushDelivery: 150, // Rush delivery for timeline
      },
    };

    // Base features (included in $999 base price)
    const BASE_FEATURES = [
      "contact", // Contact Forms
      "gallery", // Photo Gallery
      "seo", // SEO Optimization
      "analytics", // Analytics Dashboard
      "search", // Search Functionality
      "social", // Social Media Integration
    ];

    // Enterprise features that trigger custom quote
    const ENTERPRISE_FEATURES = ["mobile"];

    const features = data.coreFeatures || [];
    const timeline = data.timeline || "";

    // Check for enterprise features
    const hasEnterpriseFeatures = features.some((feature: string) =>
      ENTERPRISE_FEATURES.includes(feature)
    );

    let addOns: Array<{ name: string; price: number; displayName: string }> =
      [];
    let totalPrice = PRICING_MODEL.base;
    let isEnterprise = hasEnterpriseFeatures;

    // Calculate pricing
    if (!isEnterprise) {
      // Add premium feature costs
      features.forEach((featureId: string) => {
        if (
          PRICING_MODEL.addOnCosts[
            featureId as keyof typeof PRICING_MODEL.addOnCosts
          ]
        ) {
          const cost =
            PRICING_MODEL.addOnCosts[
              featureId as keyof typeof PRICING_MODEL.addOnCosts
            ];
          totalPrice += cost;

          // Get display name for feature
          const displayNames: Record<string, string> = {
            blog: "Blog/News",
            chat: "Live Chat",
            members: "Customer Portal",
            newsletter: "Email Newsletter",
            multilang: "Multi-language Support",
            booking: "Appointment Booking",
            payment: "Payment Processing",
          };

          addOns.push({
            name: featureId,
            price: cost,
            displayName: displayNames[featureId] || featureId,
          });
        }
      });

      // Add rush delivery cost if timeline is urgent
      if (timeline === "1-2 weeks" || timeline === "ASAP") {
        totalPrice += PRICING_MODEL.addOnCosts.rushDelivery;
        addOns.push({
          name: "rushDelivery",
          price: PRICING_MODEL.addOnCosts.rushDelivery,
          displayName: "Rush Delivery",
        });
      }
    }

    // Map all selected features for display
    const FEATURE_DISPLAY_NAMES: Record<string, string> = {
      contact: "Contact Forms",
      gallery: "Photo Gallery",
      seo: "SEO Optimization",
      analytics: "Analytics Dashboard",
      search: "Search Functionality",
      social: "Social Media Integration",
      blog: "Blog/News",
      chat: "Live Chat",
      members: "Customer Portal",
      newsletter: "Email Newsletter",
      multilang: "Multi-language Support",
      mobile: "Custom Application",
      booking: "Appointment Booking",
      payment: "Payment Processing",
    };

    const selectedFeatures = features.map((id: string) => ({
      id,
      name: FEATURE_DISPLAY_NAMES[id] || id,
      isBase: BASE_FEATURES.includes(id),
      isPremium:
        !BASE_FEATURES.includes(id) && !ENTERPRISE_FEATURES.includes(id),
      isEnterprise: ENTERPRISE_FEATURES.includes(id),
    }));

    // Calculate lead score and qualification
    const leadScoring = calculateLeadScore(data);

    // Create project summary
    const projectSummary = {
      contact: {
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
      },
      project: {
        description: data.projectDescription,
        websiteType: data.websiteType,
        timeline: data.timeline,
      },
      features: {
        selected: selectedFeatures,
        totalCount: selectedFeatures.length,
        baseCount: selectedFeatures.filter((f: any) => f.isBase).length,
        premiumCount: selectedFeatures.filter((f: any) => f.isPremium).length,
        enterpriseCount: selectedFeatures.filter((f: any) => f.isEnterprise)
          .length,
      },
      design: {
        colorPalette: data.colorPalette,
        designMood: data.designMood,
        brandingAssets: data.brandingAssets,
      },
      pricing: {
        isEnterprise,
        basePrice: PRICING_MODEL.base,
        addOns,
        totalPrice: isEnterprise ? 0 : totalPrice,
        monthlyPayment: isEnterprise ? 0 : Math.round(totalPrice / 12),
        priceBreakdown: isEnterprise
          ? "Custom Enterprise Quote"
          : `$${PRICING_MODEL.base} base + $${
              totalPrice - PRICING_MODEL.base
            } add-ons = $${totalPrice}`,
      },
      submission: {
        source: "TrueForm Wizard",
        submittedAt: new Date().toISOString(),
        wizardVersion: "1.0",
      },
    };

    // Transform wizard data to TrueForm lead format with qualification data
    const leadData = {
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || "",
      projectDescription: data.projectDescription,
      websiteType: data.websiteType,
      features: selectedFeatures.map((f: any) => f.name),
      colorPreferences: data.colorPalette,
      stylePreference: data.designMood?.join(", ") || "Modern",
      brandAssets: data.brandingAssets?.hasBrandAssets === "yes",
      timeline: data.timeline,
      budgetRange: isEnterprise ? "Custom Quote" : `$${totalPrice} - Custom`,
      planType: isEnterprise ? "enterprise" : "custom",

      // NEW: Lead qualification data
      contactRole: data.contactRole,
      decisionAuthority: data.decisionAuthority,
      budgetContext: data.budgetContext,
      projectUrgency: data.projectUrgency,
      currentSituation: data.currentSituation,
      competitorContext: data.competitorContext,

      // Lead scoring
      leadScore: leadScoring.score,
      leadPriority: leadScoring.priority,
      scoringFactors: leadScoring.factors.join(", "),

      // Enhanced tracking
      industry: data.industry,
      targetAudience: data.targetAudience,
      primaryGoals: Array.isArray(data.primaryGoals)
        ? data.primaryGoals.join(", ")
        : data.primaryGoals,
      additionalInfo: data.additionalInfo,
    };

    // Creating TrueForm opportunity

    // Use the proper TrueForm opportunity creation function
    const result = await createTrueFormOpportunity(leadData);

    // TrueForm opportunity created successfully

    // 🚨 HIGH-PRIORITY LEAD NOTIFICATION SYSTEM
    if (
      leadScoring.priority === "CRITICAL" ||
      leadScoring.priority === "HIGH"
    ) {
      // TODO: In production, this would:
      // - Send Slack notification to sales team
      // - Send email alert to lead sales rep
      // - Create high-priority ticket in project management system
      // - Set up automated follow-up reminders
      // - Log to proper monitoring service (not console)
    }

    return json({
      success: true,
      opportunity: result.opportunity,
      contact: result.contact,
      summary: projectSummary,
      message: isEnterprise
        ? "Your enterprise project request has been submitted! We'll provide a custom proposal within 48 hours."
        : `Your project request has been submitted! Total investment: $${totalPrice}. We\'ll be in touch within 24 hours.`,
    });
  } catch (error) {
    return json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Require authentication for opportunities data
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const opportunities = await getTrueFormOpportunities();
    return json(opportunities);
  } catch (error) {
    return json(
      {
        error: "Failed to fetch opportunities",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
  // 🔒 SECURE: Require authentication for updating opportunities
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { opportunityId, status, notes } = await request.json();

    if (!opportunityId || !status) {
      return json(
        {
          error: "Missing required fields",
          details: "opportunityId and status are required",
        },
        { status: 400 }
      );
    }

    const result = await updateOpportunityStatus(opportunityId, status, notes);
    return json(result);
  } catch (error) {
    return json(
      {
        error: "Failed to update opportunity",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
};
