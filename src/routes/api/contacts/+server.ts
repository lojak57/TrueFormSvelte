import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const GET: RequestHandler = async ({ url }) => {
  try {
    // Add query parameter support for filtering
    const companyId = url.searchParams.get('company_id');
    const verticalId = url.searchParams.get('vertical_id');
    
    let query = supabase
      .from('tf_contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    if (verticalId) {
      query = query.eq('vertical_id', verticalId);
    }
    
    const { data: contacts, error } = await query;
    
    if (error) throw error;
    
    return json(contacts || []);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const contactData = await request.json();
    
    const { data: contact, error } = await supabase
      .from('tf_contacts')
      .insert(contactData)
      .select()
      .single();
    
    if (error) throw error;
    
    return json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return json({ error: 'Failed to create contact' }, { status: 500 });
  }
}; 