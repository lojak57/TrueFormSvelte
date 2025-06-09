import { json } from '@sveltejs/kit';
import { createTrueFormOpportunity } from '$lib/api/trueform-server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const sampleLead = {
      companyName: "Test Company Ltd",
      contactName: "John Smith",
      contactEmail: "john@testcompany.com",
      contactPhone: "(555) 123-4567",
      projectDescription: "We need a modern business website to showcase our services and attract new customers. Looking for a professional design with contact forms and service pages.",
      websiteType: "Business Website",
      features: ["Contact Forms", "Blog/News", "Social Media Integration"],
      colorPreferences: "Professional blues and whites, matching our existing brand",
      stylePreference: "Modern & Minimal",
      brandAssets: true,
      timeline: "2-4 weeks",
      budgetRange: "$199 - Standard",
      planType: "standard"
    };

    const result = await createTrueFormOpportunity(sampleLead);
    
    return json({
      success: true,
      message: 'Test opportunity created successfully',
      data: result
    });

  } catch (error) {
    console.error('Error creating test opportunity:', error);
    
    return json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create test opportunity'
    }, { status: 500 });
  }
}; 