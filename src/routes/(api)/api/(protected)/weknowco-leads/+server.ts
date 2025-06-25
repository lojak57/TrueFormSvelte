import { CompanyService } from "$lib/services/CompanyService";
import { ProjectService } from "$lib/services/ProjectService";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const projectService = new ProjectService();
const companyService = new CompanyService();

export interface WeKnowCoLeadData {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  // Company Information
  companyName: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;

  // Marketing Lead Data
  leadSource: string; // "weknowco", "google-ads", "facebook", "linkedin", etc.
  campaign?: string;
  adGroup?: string;
  keyword?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;

  // Service Interest
  serviceInterest: string; // "digital-marketing", "seo", "ppc", "social-media", "web-design", etc.
  monthlyBudget?: string;
  timeframe?: string;

  // Qualification Data
  currentMarketing?: string;
  painPoints?: string;
  goals?: string;
  decisionMaker?: boolean;
  timeline?: string;

  // Form/Page Context
  pageUrl?: string;
  formName?: string;
  submittedAt?: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const leadData: WeKnowCoLeadData = await request.json();

    // Create or find company first
    let company;
    try {
      // Try to find existing company by name
      const companies = await companyService.getCompanies();
      company = companies.find(
        (c) => c.name.toLowerCase() === leadData.companyName?.toLowerCase()
      );

      if (!company) {
        // Create new company
        company = await companyService.createCompany({
          name:
            leadData.companyName ||
            `${leadData.firstName} ${leadData.lastName}'s Company`,
          website: leadData.companyWebsite,
          status: "prospect",
          notes: `WeKnowCo lead created on ${new Date().toLocaleDateString()}`,
        });
      }
    } catch (error) {
      // If company creation fails, create a default one
      company = await companyService.createCompany({
        name:
          leadData.companyName ||
          `${leadData.firstName} ${leadData.lastName}'s Company`,
        status: "prospect",
      });
    }

    // Create rich project description from WeKnowCo lead data
    const projectDescription = formatWeKnowCoLeadForProject(leadData);

    // Create project as lead
    const project = await projectService.createProject({
      name: `Marketing Lead - ${
        leadData.companyName || leadData.firstName + " " + leadData.lastName
      }`,
      description: projectDescription,
      company_id: company.id,
      status: "lead",
      project_type: "marketing",
      budget: extractBudgetFromLead(leadData),
    });

    return json(
      {
        success: true,
        project,
        company,
        message: "WeKnowCo lead received successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    return json(
      {
        error: "Failed to process WeKnowCo lead",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

function formatWeKnowCoLeadForProject(data: WeKnowCoLeadData): string {
  const sections = [];

  // Contact Information
  sections.push(`**Contact Information:**
• Name: ${data.firstName} ${data.lastName}
• Email: ${data.email}
• Phone: ${data.phone || "Not provided"}
• Company: ${data.companyName}
• Website: ${data.companyWebsite || "Not provided"}
• Industry: ${data.industry || "Not specified"}
• Company Size: ${data.companySize || "Not specified"}`);

  // Lead Source & Attribution
  const attribution = [];
  if (data.leadSource) attribution.push(`Source: ${data.leadSource}`);
  if (data.campaign) attribution.push(`Campaign: ${data.campaign}`);
  if (data.adGroup) attribution.push(`Ad Group: ${data.adGroup}`);
  if (data.keyword) attribution.push(`Keyword: ${data.keyword}`);
  if (data.utmSource) attribution.push(`UTM Source: ${data.utmSource}`);
  if (data.utmMedium) attribution.push(`UTM Medium: ${data.utmMedium}`);
  if (data.utmCampaign) attribution.push(`UTM Campaign: ${data.utmCampaign}`);

  if (attribution.length > 0) {
    sections.push(`**Lead Attribution:**
• ${attribution.join("\n• ")}`);
  }

  // Service Interest & Budget
  if (data.serviceInterest || data.monthlyBudget || data.timeframe) {
    sections.push(`**Service Requirements:**
• Interest: ${data.serviceInterest || "Not specified"}
• Monthly Budget: ${data.monthlyBudget || "Not specified"}
• Timeframe: ${data.timeframe || "Not specified"}`);
  }

  // Current Situation & Goals
  if (data.currentMarketing || data.painPoints || data.goals) {
    sections.push(`**Current Marketing Situation:**
• Current Marketing: ${data.currentMarketing || "Not specified"}
• Pain Points: ${data.painPoints || "Not specified"}
• Goals: ${data.goals || "Not specified"}`);
  }

  // Qualification Info
  if (data.decisionMaker !== undefined || data.timeline) {
    sections.push(`**Lead Qualification:**
• Decision Maker: ${data.decisionMaker ? "Yes" : "No/Uncertain"}
• Timeline: ${data.timeline || "Not specified"}`);
  }

  // Form Context
  if (data.pageUrl || data.formName) {
    sections.push(`**Form Context:**
• Page URL: ${data.pageUrl || "Not captured"}
• Form Name: ${data.formName || "Not specified"}`);
  }

  // Submission metadata
  const submittedAt = data.submittedAt
    ? new Date(data.submittedAt).toLocaleString()
    : new Date().toLocaleString();
  sections.push(`**Submission Details:**
• Submitted: ${submittedAt}
• Source: WeKnowCo Marketing Platform
• Lead Type: Marketing Services`);

  return sections.join("\n\n");
}

function extractBudgetFromLead(data: WeKnowCoLeadData): number | undefined {
  if (!data.monthlyBudget) return undefined;

  // Parse monthly budget strings like "$1,000-$5,000", "$500+", "Under $1000", etc.
  const budget = data.monthlyBudget.toLowerCase();

  // Extract numbers from budget string
  const numbers = budget.match(/\d+/g);
  if (!numbers) return undefined;

  // Convert to monthly budget (assume first number is the base)
  const baseAmount = parseInt(numbers[0]);

  // Convert monthly to project budget estimate (assume 6-month engagement)
  if (budget.includes("k") || budget.includes("thousand")) {
    return baseAmount * 1000 * 6;
  }

  return baseAmount * 6;
}
