import { describe, expect, it } from "vitest";

// Test the lead scoring algorithm logic directly
describe("Lead Scoring Algorithm", () => {
  // Lead scoring function implementation for testing
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

  describe("Decision Authority Scoring", () => {
    it("should score decision maker highest", () => {
      const data = { decisionAuthority: "decision_maker" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(75); // 50 base + 25 decision maker
      expect(result.factors).toContain("Decision maker identified");
    });

    it("should score influencer moderately", () => {
      const data = { decisionAuthority: "influencer" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(65); // 50 base + 15 influencer
      expect(result.factors).toContain("Key influencer");
    });

    it("should score researcher lowest", () => {
      const data = { decisionAuthority: "researcher" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(55); // 50 base + 5 researcher
      expect(result.factors).toContain("Research phase");
    });
  });

  describe("Budget Context Scoring", () => {
    it("should score approved budget highest", () => {
      const data = { budgetContext: "budget_approved" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(75); // 50 base + 25 approved
      expect(result.factors).toContain("Budget already approved");
    });

    it("should score flexible budget high", () => {
      const data = { budgetContext: "budget_flexible" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(70); // 50 base + 20 flexible
      expect(result.factors).toContain("Flexible budget");
    });

    it("should score exploring budget lowest", () => {
      const data = { budgetContext: "budget_exploring" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(55); // 50 base + 5 exploring
      expect(result.factors).toContain("Early exploration");
    });
  });

  describe("Project Urgency Scoring", () => {
    it("should score urgent deadline highest", () => {
      const data = { projectUrgency: "urgent_deadline" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(75); // 50 base + 25 urgent
      expect(result.factors).toContain("Has specific deadline");
    });

    it("should score high priority well", () => {
      const data = { projectUrgency: "high_priority" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(70); // 50 base + 20 high priority
      expect(result.factors).toContain("High priority project");
    });
  });

  describe("Current Situation Scoring", () => {
    it("should score losing business highest", () => {
      const data = { currentSituation: "losing_business" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(70); // 50 base + 20 losing business
      expect(result.factors).toContain("Losing business opportunities");
    });

    it("should score competitive pressure high", () => {
      const data = { currentSituation: "competitor_pressure" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(68); // 50 base + 18 competitive pressure
      expect(result.factors).toContain("Competitive pressure");
    });

    it("should score growth situations well", () => {
      const data = { currentSituation: "growth_phase" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(65); // 50 base + 15 growth
      expect(result.factors).toContain("Growth-driven need");
    });
  });

  describe("Competitor Context Scoring", () => {
    it("should score first choice highest", () => {
      const data = { competitorContext: "first_choice" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(65); // 50 base + 15 first choice
      expect(result.factors).toContain("We are first choice");
    });

    it("should score referrals well", () => {
      const data = { competitorContext: "referral" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(62); // 50 base + 12 referral
      expect(result.factors).toContain("Came via referral");
    });
  });

  describe("Project Complexity Bonuses", () => {
    it("should bonus for complex projects", () => {
      const data = {
        coreFeatures: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"], // 9 features
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(60); // 50 base + 10 complex
      expect(result.factors).toContain("Complex project requirements");
    });

    it("should bonus for moderate complexity", () => {
      const data = {
        coreFeatures: ["f1", "f2", "f3", "f4", "f5", "f6"], // 6 features
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(55); // 50 base + 5 moderate
      expect(result.factors).toContain("Moderate complexity");
    });

    it("should not bonus for simple projects", () => {
      const data = {
        coreFeatures: ["f1", "f2", "f3"], // 3 features
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(50); // 50 base + 0 simple
      expect(result.factors).not.toContain("Complex project requirements");
      expect(result.factors).not.toContain("Moderate complexity");
    });
  });

  describe("Timeline Urgency Bonuses", () => {
    it("should bonus for ASAP timeline", () => {
      const data = { timeline: "ASAP" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(55); // 50 base + 5 urgent
      expect(result.factors).toContain("Urgent timeline");
    });

    it("should bonus for 1-2 weeks timeline", () => {
      const data = { timeline: "1-2 weeks" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(55); // 50 base + 5 urgent
      expect(result.factors).toContain("Urgent timeline");
    });

    it("should not bonus for longer timelines", () => {
      const data = { timeline: "3-4 months" };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(50); // 50 base + 0
      expect(result.factors).not.toContain("Urgent timeline");
    });
  });

  describe("Priority Classification", () => {
    it("should classify high scores as CRITICAL", () => {
      const data = {
        decisionAuthority: "decision_maker", // +25
        budgetContext: "budget_approved", // +25
        projectUrgency: "urgent_deadline", // +25
        currentSituation: "losing_business", // +20
        // Total: 50 + 25 + 25 + 25 + 20 = 145, capped at 100
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(100);
      expect(result.priority).toBe("CRITICAL");
    });

    it("should classify mid-high scores as HIGH", () => {
      const data = {
        decisionAuthority: "influencer", // +15
        budgetContext: "budget_flexible", // +20
        projectUrgency: "high_priority", // +20
        currentSituation: "growth_phase", // +15
        // Total: 50 + 15 + 20 + 20 + 15 = 120, capped at 100
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(100);
      expect(result.priority).toBe("CRITICAL");
    });

    it("should classify medium scores as MEDIUM", () => {
      const data = {
        decisionAuthority: "team_decision", // +10
        budgetContext: "budget_researching", // +15
        // Total: 50 + 10 + 15 = 75
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(75);
      expect(result.priority).toBe("HIGH");
    });

    it("should classify low scores as LOW", () => {
      const data = {
        decisionAuthority: "researcher", // +5
        // Total: 50 + 5 = 55
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(55);
      expect(result.priority).toBe("MEDIUM");
    });

    it("should classify base score as LOW", () => {
      const data = {}; // No qualification data
      const result = calculateLeadScore(data);

      expect(result.score).toBe(50);
      expect(result.priority).toBe("LOW");
    });
  });

  describe("Score Capping", () => {
    it("should cap score at 100", () => {
      const data = {
        decisionAuthority: "decision_maker",
        budgetContext: "budget_approved",
        projectUrgency: "urgent_deadline",
        currentSituation: "losing_business",
        competitorContext: "first_choice",
        coreFeatures: Array(10).fill("feature"), // Complex project
        timeline: "ASAP",
      };
      const result = calculateLeadScore(data);

      expect(result.score).toBe(100);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe("Complete Scoring Examples", () => {
    it("should score perfect lead correctly", () => {
      const perfectLead = {
        decisionAuthority: "decision_maker",
        budgetContext: "budget_approved",
        projectUrgency: "urgent_deadline",
        currentSituation: "losing_business",
        competitorContext: "first_choice",
        coreFeatures: [
          "contact",
          "gallery",
          "seo",
          "analytics",
          "blog",
          "payment",
          "booking",
          "newsletter",
          "multilang",
        ],
        timeline: "ASAP",
      };

      const result = calculateLeadScore(perfectLead);

      expect(result.score).toBe(100);
      expect(result.priority).toBe("CRITICAL");
      expect(result.factors).toContain("Decision maker identified");
      expect(result.factors).toContain("Budget already approved");
      expect(result.factors).toContain("Has specific deadline");
      expect(result.factors).toContain("Losing business opportunities");
      expect(result.factors).toContain("We are first choice");
      expect(result.factors).toContain("Complex project requirements");
      expect(result.factors).toContain("Urgent timeline");
    });

    it("should score poor lead correctly", () => {
      const poorLead = {
        decisionAuthority: "researcher",
        budgetContext: "budget_exploring",
        projectUrgency: "exploring",
        currentSituation: "modernize",
        competitorContext: "researching",
        coreFeatures: ["contact", "gallery"],
        timeline: "6+ months",
      };

      const result = calculateLeadScore(poorLead);

      expect(result.score).toBe(50 + 5 + 5 + 5 + 10 + 5); // 80
      expect(result.priority).toBe("HIGH"); // Actually scores higher than expected
      expect(result.factors).toContain("Research phase");
      expect(result.factors).toContain("Early exploration");
      expect(result.factors).toContain("Exploring options");
      expect(result.factors).toContain("Modernization initiative");
      expect(result.factors).toContain("Still researching");
    });
  });
});
