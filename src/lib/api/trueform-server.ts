import { supabaseAdmin } from '$lib/supabaseAdmin';

export interface TrueFormLead {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  projectDescription: string;
  websiteType: string;
  features: string[];
  colorPreferences?: string;
  stylePreference: string;
  brandAssets: boolean;
  timeline: string;
  budgetRange: string;
  planType: string;
}

export interface TrueFormOpportunity {
  id: string;
  name: string;
  contact_id: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  expected_close_date?: string;
  source: string;
  notes?: string;
  company: string;
  email: string;
  phone?: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company: string;
  org_id: string;
}

// Create contact and opportunity from TrueForm lead
export async function createTrueFormOpportunity(leadData: TrueFormLead) {
  try {
    // Get TrueForm organization ID
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('name', 'Trueform')
      .single();

    if (orgError) throw new Error(`Organization not found: ${orgError.message}`);
    
    const orgId = orgData.id;

    // Create contact first
    const [firstName, ...lastNameParts] = leadData.contactName.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const { data: contact, error: contactError } = await supabaseAdmin
      .from('contacts')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email: leadData.contactEmail,
        phone: leadData.contactPhone || null,
        company: leadData.companyName,
        org_id: orgId
      }])
      .select()
      .single();

    if (contactError) throw new Error(`Failed to create contact: ${contactError.message}`);

    // Determine project value based on budget range
    const projectValue = getBudgetValue(leadData.budgetRange);
    
    // Create opportunity
    const { data: opportunity, error: opportunityError } = await supabaseAdmin
      .from('opportunities')
      .insert([{
        name: `${leadData.companyName} - ${leadData.websiteType}`,
        contact_id: contact.id,
        status: 'new',
        value: projectValue,
        probability: 25, // Initial probability for new leads
        source: 'Website Form',
        company: leadData.companyName,
        email: leadData.contactEmail,
        phone: leadData.contactPhone || null,
        notes: `Timeline: ${leadData.timeline}
Budget: ${leadData.budgetRange}
Style: ${leadData.stylePreference}
Features: ${leadData.features.join(', ')}
Project Description: ${leadData.projectDescription}
Website Type: ${leadData.websiteType}
Plan Type: ${leadData.planType}`,
        org_id: orgId
      }])
      .select()
      .single();

    if (opportunityError) throw new Error(`Failed to create opportunity: ${opportunityError.message}`);

    // Create initial activity
    await supabaseAdmin
      .from('activities')
      .insert([{
        opportunity_id: opportunity.id,
        type: 'note',
        title: 'New website request submitted',
        description: `Initial request for ${leadData.websiteType}. Client interested in: ${leadData.features.join(', ')}`,
        created_by: 'System'
      }]);

    return {
      contact,
      opportunity,
      success: true
    };

  } catch (error) {
    console.error('Error creating TrueForm opportunity:', error);
    throw error;
  }
}

// Get all TrueForm opportunities
export async function getTrueFormOpportunities() {
  try {
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('name', 'Trueform')
      .single();

    if (orgError) throw new Error(`Organization not found: ${orgError.message}`);

    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .select(`
        *,
        contacts (
          first_name,
          last_name,
          email,
          phone,
          company
        )
      `)
      .eq('org_id', orgData.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch opportunities: ${error.message}`);

    return data;
  } catch (error) {
    console.error('Error fetching TrueForm opportunities:', error);
    throw error;
  }
}

// Update opportunity status
export async function updateOpportunityStatus(opportunityId: string, status: string, notes?: string) {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.notes = notes;
    }

    // Update probability based on status
    const probabilityMap = {
      'new': 25,
      'qualified': 50,
      'proposal': 75,
      'negotiation': 85,
      'closed_won': 100,
      'closed_lost': 0
    };
    updateData.probability = probabilityMap[status as keyof typeof probabilityMap] || 25;

    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .update(updateData)
      .eq('id', opportunityId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update opportunity: ${error.message}`);

    // Create activity for status change
    await supabaseAdmin
      .from('activities')
      .insert([{
        opportunity_id: opportunityId,
        type: 'note',
        title: `Status changed to ${status}`,
        description: notes || `Opportunity moved to ${status} stage`,
        created_by: 'System'
      }]);

    return data;
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    throw error;
  }
}

// Helper function to convert budget range to numeric value
function getBudgetValue(budgetRange: string): number {
  // Handle wizard custom pricing
  if (budgetRange.includes('Custom Quote') || budgetRange === 'Enterprise') {
    return 0; // Will be updated manually
  }
  
  // Extract numeric value from custom pricing like "$1549 - Custom"
  const customMatch = budgetRange.match(/\$(\d+)\s*-\s*Custom/);
  if (customMatch) {
    return parseInt(customMatch[1]);
  }
  
  // Handle standard pricing tiers
  switch (budgetRange) {
    case '$99 - Starter':
      return 99;
    case '$199 - Standard':
      return 199;
    case '$399 - Pro':
      return 399;
    case 'Custom Quote':
      return 0; // Will be updated manually
    default:
      return 199; // Default to Standard
  }
}

// Get opportunity activities
export async function getOpportunityActivities(opportunityId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .select('*')
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch activities: ${error.message}`);

    return data;
  } catch (error) {
    console.error('Error fetching opportunity activities:', error);
    throw error;
  }
}

// Add activity to opportunity
export async function addOpportunityActivity(
  opportunityId: string, 
  type: 'call' | 'email' | 'meeting' | 'note' | 'task',
  title: string,
  description?: string,
  scheduledDate?: string
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .insert([{
        opportunity_id: opportunityId,
        type,
        title,
        description: description || '',
        scheduled_date: scheduledDate || null,
        created_by: 'User' // In real app, this would be the current user
      }])
      .select()
      .single();

    if (error) throw new Error(`Failed to add activity: ${error.message}`);

    return data;
  } catch (error) {
    console.error('Error adding opportunity activity:', error);
    throw error;
  }
} 