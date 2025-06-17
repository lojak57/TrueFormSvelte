import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    
    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('tf_companies')
      .select('*')
      .eq('id', id)
      .single();

    if (companyError) {
      if (companyError.code === 'PGRST116') {
        return json({ error: 'Company not found' }, { status: 404 });
      }
      throw companyError;
    }

    // Get associated contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('tf_contacts')
      .select('*')
      .eq('company_id', id);

    if (contactsError) throw contactsError;

    // Get associated projects
    const { data: projects, error: projectsError } = await supabase
      .from('tf_company_projects')
      .select('*')
      .eq('company_id', id);

    if (projectsError) throw projectsError;

    // Return company with related data and stats
    const companyWithRelations = {
      ...company,
      contacts: contacts || [],
      projects: projects || [],
      stats: {
        total_contacts: (contacts || []).length,
        active_contacts: (contacts || []).filter(c => c.status === 'active').length,
        total_projects: (projects || []).length,
        active_projects: (projects || []).filter(p => p.status === 'in_progress').length,
        completed_projects: (projects || []).filter(p => p.status === 'completed').length,
        total_project_value: (projects || []).reduce((sum, p) => sum + (p.budget || 0), 0)
      }
    };

    return json(companyWithRelations);
  } catch (error) {
    console.error('Error fetching company:', error);
    return json({ error: 'Failed to fetch company' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    const { data: company, error } = await supabase
      .from('tf_companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return json({ error: 'Company not found' }, { status: 404 });
      }
      throw error;
    }

    return json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return json({ error: 'Failed to update company' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('tf_companies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return json({ error: 'Failed to delete company' }, { status: 500 });
  }
}; 