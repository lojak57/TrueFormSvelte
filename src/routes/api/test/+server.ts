import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

export const GET: RequestHandler = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('SUPABASE_URL:', import.meta.env.PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY exists:', !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
    
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );

    // Test basic connection
    const { data, error } = await supabase
      .from('tf_companies')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }

    console.log('Supabase connection successful');
    return json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}; 