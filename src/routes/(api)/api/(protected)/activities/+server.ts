import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { ActivityService } from '$lib/services/ActivityService';

export const GET: RequestHandler = async ({ request, locals, url }) => {
  const supabase = createSupabaseServerClient(request, locals);

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const userId = url.searchParams.get('user_id');
    const entityType = url.searchParams.get('entity_type');
    const entityId = url.searchParams.get('entity_id');

    // For now, return mock data until we have the activities table
    const mockActivities = [
      {
        id: '1',
        user_id: user.id,
        activity_type: 'create_proposal',
        entity_type: 'proposal',
        entity_name: 'Website Redesign Proposal',
        description: 'Created proposal "Website Redesign Proposal" for Acme Corp',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
      },
      {
        id: '2',
        user_id: user.id,
        activity_type: 'update',
        entity_type: 'contact',
        entity_name: 'Jane Smith',
        description: 'Updated contact: Jane Smith',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
      },
      {
        id: '3',
        user_id: user.id,
        activity_type: 'send_message',
        entity_type: 'message',
        description: 'Sent message to Sarah Johnson',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
      },
      {
        id: '4',
        user_id: user.id,
        activity_type: 'create',
        entity_type: 'company',
        entity_name: 'Tech Startup Inc',
        description: 'Created company: Tech Startup Inc',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
      },
      {
        id: '5',
        user_id: user.id,
        activity_type: 'login',
        entity_type: 'auth',
        description: 'User logged in',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
      }
    ];

    // Filter based on query params
    let activities = mockActivities;
    
    if (userId) {
      activities = activities.filter(a => a.user_id === userId);
    }
    
    if (entityType && entityId) {
      activities = activities.filter(a => 
        a.entity_type === entityType && a.entity_id === entityId
      );
    }

    // Apply limit
    activities = activities.slice(0, limit);

    return json({ data: activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const supabase = createSupabaseServerClient(request, locals);

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // For now, just return success with mock data
    const activity = {
      id: crypto.randomUUID(),
      user_id: user.id,
      ...body,
      created_at: new Date().toISOString()
    };

    return json({ data: activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    return json({ error: 'Failed to create activity' }, { status: 500 });
  }
};