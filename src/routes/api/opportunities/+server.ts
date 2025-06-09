import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createTrueFormOpportunity, getTrueFormOpportunities, updateOpportunityStatus } from '$lib/api/trueform-server';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Updated pricing model to match the wizard - includes ALL features
    const PRICING_MODEL = {
      base: 999,
      includedFeatures: 6,
      addOnCosts: {
        // Premium features (add-on costs)
        'blog': 100,           // Blog/News
        'chat': 50,            // Live Chat  
        'members': 250,        // Customer Portal
        'newsletter': 200,     // Email Newsletter
        'multilang': 200,      // Multi-language Support
        'mobile': 500,         // Custom Application (enterprise)
        'booking': 150,        // Appointment Booking
        'payment': 200,        // Payment Processing
        'rushDelivery': 150    // Rush delivery for timeline
      }
    };
    
    // Base features (included in $999 base price)
    const BASE_FEATURES = [
      'contact',     // Contact Forms
      'gallery',     // Photo Gallery  
      'seo',         // SEO Optimization
      'analytics',   // Analytics Dashboard
      'search',      // Search Functionality
      'social'       // Social Media Integration
    ];
    
    // Enterprise features that trigger custom quote
    const ENTERPRISE_FEATURES = ['mobile'];
    
    const features = data.coreFeatures || [];
    const timeline = data.timeline || '';
    
    // Check for enterprise features
    const hasEnterpriseFeatures = features.some((feature: string) => 
      ENTERPRISE_FEATURES.includes(feature)
    );
    
    let addOns: Array<{name: string, price: number, displayName: string}> = [];
    let totalPrice = PRICING_MODEL.base;
    let isEnterprise = hasEnterpriseFeatures;
    
    // Calculate pricing
    if (!isEnterprise) {
      // Add premium feature costs
      features.forEach((featureId: string) => {
        if (PRICING_MODEL.addOnCosts[featureId as keyof typeof PRICING_MODEL.addOnCosts]) {
          const cost = PRICING_MODEL.addOnCosts[featureId as keyof typeof PRICING_MODEL.addOnCosts];
          totalPrice += cost;
          
          // Get display name for feature
          const displayNames: Record<string, string> = {
            'blog': 'Blog/News',
            'chat': 'Live Chat',
            'members': 'Customer Portal',
            'newsletter': 'Email Newsletter',
            'multilang': 'Multi-language Support',
            'booking': 'Appointment Booking',
            'payment': 'Payment Processing'
          };
          
          addOns.push({
            name: featureId,
            price: cost,
            displayName: displayNames[featureId] || featureId
          });
        }
      });
      
      // Add rush delivery cost if timeline is urgent
      if (timeline === '1-2 weeks' || timeline === 'ASAP') {
        totalPrice += PRICING_MODEL.addOnCosts.rushDelivery;
        addOns.push({
          name: 'rushDelivery',
          price: PRICING_MODEL.addOnCosts.rushDelivery,
          displayName: 'Rush Delivery'
        });
      }
    }
    
    // Map all selected features for display
    const FEATURE_DISPLAY_NAMES: Record<string, string> = {
      'contact': 'Contact Forms',
      'gallery': 'Photo Gallery',
      'seo': 'SEO Optimization',
      'analytics': 'Analytics Dashboard',
      'search': 'Search Functionality',
      'social': 'Social Media Integration',
      'blog': 'Blog/News',
      'chat': 'Live Chat',
      'members': 'Customer Portal',
      'newsletter': 'Email Newsletter',
      'multilang': 'Multi-language Support',
      'mobile': 'Custom Application',
      'booking': 'Appointment Booking',
      'payment': 'Payment Processing'
    };
    
    const selectedFeatures = features.map((id: string) => ({
      id,
      name: FEATURE_DISPLAY_NAMES[id] || id,
      isBase: BASE_FEATURES.includes(id),
      isPremium: !BASE_FEATURES.includes(id) && !ENTERPRISE_FEATURES.includes(id),
      isEnterprise: ENTERPRISE_FEATURES.includes(id)
    }));
    
    // Create project summary
    const projectSummary = {
      contact: {
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail
      },
      project: {
        description: data.projectDescription,
        websiteType: data.websiteType,
        timeline: data.timeline
      },
      features: {
        selected: selectedFeatures,
        totalCount: selectedFeatures.length,
        baseCount: selectedFeatures.filter(f => f.isBase).length,
        premiumCount: selectedFeatures.filter(f => f.isPremium).length,
        enterpriseCount: selectedFeatures.filter(f => f.isEnterprise).length
      },
      design: {
        colorPalette: data.colorPalette,
        designMood: data.designMood,
        brandingAssets: data.brandingAssets
      },
      pricing: {
        isEnterprise,
        basePrice: PRICING_MODEL.base,
        addOns,
        totalPrice: isEnterprise ? 0 : totalPrice,
        monthlyPayment: isEnterprise ? 0 : Math.round(totalPrice / 12),
        priceBreakdown: isEnterprise 
          ? 'Custom Enterprise Quote' 
          : `$${PRICING_MODEL.base} base + $${totalPrice - PRICING_MODEL.base} add-ons = $${totalPrice}`
      },
      submission: {
        source: 'TrueForm Wizard',
        submittedAt: new Date().toISOString(),
        wizardVersion: '1.0'
      }
    };
    
    // Transform wizard data to TrueForm lead format
    const leadData = {
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: '', // Not collected in wizard
      projectDescription: data.projectDescription,
      websiteType: data.websiteType,
      features: selectedFeatures.map((f: any) => f.name),
      colorPreferences: data.colorPalette,
      stylePreference: data.designMood?.join(', ') || 'Modern',
      brandAssets: data.brandingAssets?.hasBrandAssets === 'yes',
      timeline: data.timeline,
      budgetRange: isEnterprise ? 'Custom Quote' : `$${totalPrice} - Custom`,
      planType: isEnterprise ? 'enterprise' : 'custom'
    };
    
    console.log('🚀 Creating TrueForm opportunity:', {
      company: leadData.companyName,
      email: leadData.contactEmail,
      features: leadData.features.length,
      pricing: isEnterprise ? 'ENTERPRISE QUOTE' : `$${totalPrice}`
    });
    
    // Use the proper TrueForm opportunity creation function
    const result = await createTrueFormOpportunity(leadData);
    
    console.log('🎉 NEW TRUEFORM OPPORTUNITY CREATED:', {
      id: result.opportunity.id,
      company: leadData.companyName,
      contact: leadData.contactName,
      email: leadData.contactEmail,
      type: leadData.websiteType,
      features: leadData.features.length,
      pricing: isEnterprise ? 'ENTERPRISE QUOTE' : `$${totalPrice}`,
      timeline: leadData.timeline
    });
    
    return json({ 
      success: true, 
      opportunity: result.opportunity,
      contact: result.contact,
      summary: projectSummary,
      message: isEnterprise 
        ? 'Your enterprise project request has been submitted! We\'ll provide a custom proposal within 48 hours.'
        : `Your project request has been submitted! Total investment: $${totalPrice}. We\'ll be in touch within 24 hours.`
    });
    
  } catch (error) {
    console.error('Error in opportunities API:', error);
    
    return json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    const opportunities = await getTrueFormOpportunities();
    return json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return json({
      error: 'Failed to fetch opportunities',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const { opportunityId, status, notes } = await request.json();
    
    if (!opportunityId || !status) {
      return json({
        error: 'Missing required fields',
        details: 'opportunityId and status are required'
      }, { status: 400 });
    }
    
    const result = await updateOpportunityStatus(opportunityId, status, notes);
    return json(result);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return json({
      error: 'Failed to update opportunity',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}; 