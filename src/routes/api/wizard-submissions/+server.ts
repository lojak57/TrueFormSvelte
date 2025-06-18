import { ProjectService } from "$lib/services/ProjectService";
import { CompanyService } from "$lib/services/CompanyService";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { ConversationalWizardData } from "$lib/components/conversational-wizard/conversationalWizardStore";

const projectService = new ProjectService();
const companyService = new CompanyService();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const wizardData: ConversationalWizardData = await request.json();
    console.log('Received wizard data:', JSON.stringify(wizardData, null, 2));
    
    // Create or find company first
    let company;
    try {
      // Try to find existing company by name
      const companies = await companyService.getCompanies();
      company = companies.find(c => 
        c.name.toLowerCase() === wizardData.businessName?.toLowerCase()
      );
      
      if (!company) {
        // Create new company
        company = await companyService.createCompany({
          name: wizardData.businessName || `${wizardData.name}'s Business`,
          website: wizardData.businessWebsite,
          status: 'active',
          notes: `Created from conversational wizard submission on ${new Date().toLocaleDateString()}`
        });
      }
    } catch (error) {
      // If company creation fails, create a default one
      company = await companyService.createCompany({
        name: wizardData.businessName || `${wizardData.name}'s Project`,
        status: 'active'
      });
    }
    
    // Create rich project description from wizard data
    const projectDescription = formatWizardDataForProject(wizardData);
    
    // Create project as active (valid status)
    const project = await projectService.createProject({
      name: `Website Project - ${wizardData.businessName || wizardData.name}`,
      description: projectDescription,
      company_id: company.id,
      status: 'active',
      project_type: 'website',
      budget: extractBudgetHint(wizardData)
    });
    
    return json({ 
      success: true, 
      project,
      company,
      message: "Your project request has been submitted successfully!"
    }, { status: 201 });
    
  } catch (error) {
    console.error('Wizard submission error:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return json({ 
      error: "Failed to submit project request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
};

function formatWizardDataForProject(data: ConversationalWizardData): string {
  const sections = [];
  
  // Contact Information
  if (data.name || data.email) {
    sections.push(`**Contact Information:**
• Name: ${data.name || 'Not provided'}
• Email: ${data.email || 'Not provided'}
• Phone: ${data.phone || 'Not provided'}`);
  }
  
  // Project Overview
  if (data.problemDescription) {
    sections.push(`**Project Need:**
${data.problemDescription}`);
  }
  
  // Current Situation
  if (data.currentTools || data.frustrations) {
    sections.push(`**Current Situation:**
• Current tools/website: ${Array.isArray(data.currentTools) ? data.currentTools.join(', ') : (data.currentTools || 'Not specified')}
• Main frustrations: ${data.frustrations || 'Not specified'}`);
  }
  
  // Success Vision
  if (data.successVision) {
    sections.push(`**Success Vision:**
${data.successVision}`);
  }
  
  // Design Preferences
  if (data.designVibe || data.fontFeel || data.colorPalette) {
    sections.push(`**Design Preferences:**
• Vibe: ${data.designVibe || 'Not specified'}
• Font feel: ${Array.isArray(data.fontFeel) ? data.fontFeel.join(', ') : (data.fontFeel || 'Not specified')}
• Colors: ${data.colorPalette || 'Not specified'}
• Inspiration: ${data.inspirationLinks || 'None provided'}`);
  }
  
  // Working Style
  if (data.workingStyle !== undefined || data.wantToTalk !== undefined || data.wantMockup !== undefined) {
    sections.push(`**Working Preferences:**
• Style: ${data.workingStyle || 'Not specified'}
• Wants to talk: ${data.wantToTalk ? 'Yes' : 'Email preferred'}
• Wants mockup first: ${data.wantMockup ? 'Yes' : 'Jump right in'}`);
  }
  
  // Project Scoping & Investment
  if (data.selectedAddons || data.estimatedTotal) {
    const addonTitles = {
      'ecommerce': 'eCommerce Lite (+$200)',
      'booking': 'Booking System (+$200)', 
      'portfolio': 'Portfolio Builder (+$150)',
      'blog': 'Blog Setup (+$100)',
      'forms': 'Custom Forms (+$100)',
      'portal': 'Client Portal (+$300)',
      'service-pages': 'Service Pages (+$100)',
      'animations': 'Premium Animation (+$150)',
      'domain-email': 'Domain + Email (+$100)',
      'copywriting': 'Copywriting Polish (+$200)'
    };
    
    let scopingText = `**Project Scope & Investment:**
• Base Package: $999 (Custom site + hosting + support)`;
    
    if (data.selectedAddons && data.selectedAddons.length > 0) {
      scopingText += '\n• Selected Add-ons:';
      data.selectedAddons.forEach(addonId => {
        const addonTitle = addonTitles[addonId as keyof typeof addonTitles] || addonId;
        scopingText += `\n  - ${addonTitle}`;
      });
    }
    
    if (data.estimatedTotal) {
      scopingText += `\n• **Estimated Total: $${data.estimatedTotal.toLocaleString()}**`;
      scopingText += `\n• Payment Structure: 25% deposit ($${Math.round(data.estimatedTotal * 0.25).toLocaleString()}) + 75% completion ($${Math.round(data.estimatedTotal * 0.75).toLocaleString()})`;
    }
    
    sections.push(scopingText);
  }
  
  // Submission metadata
  const submittedAt = new Date().toLocaleString();
  sections.push(`**Submission Details:**
• Submitted: ${submittedAt}
• Source: Conversational Wizard
• Started: ${data.startedAt ? new Date(data.startedAt).toLocaleString() : 'Unknown'}
• Completed: ${data.completedAt ? new Date(data.completedAt).toLocaleString() : submittedAt}`);
  
  return sections.join('\n\n');
}

function extractBudgetHint(data: ConversationalWizardData): number | undefined {
  // If we have scoped pricing, use that
  if (data.estimatedTotal) {
    return data.estimatedTotal;
  }
  
  // Otherwise try to extract budget hints from the text content
  const allText = [
    data.problemDescription,
    data.successVision,
    data.workingStyle
  ].filter(Boolean).join(' ');
  
  // Simple budget detection (this could be enhanced)
  const budgetMatches = allText.match(/\$[\d,]+|\d+k|\d+\s*thousand/i);
  if (budgetMatches) {
    // Extract and convert to number (basic implementation)
    const match = budgetMatches[0];
    if (match.includes('k') || match.includes('thousand')) {
      const num = parseInt(match.replace(/[^\d]/g, ''));
      return num * 1000;
    }
    return parseInt(match.replace(/[^\d]/g, ''));
  }
  
  return undefined;
}