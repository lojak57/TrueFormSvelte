import { supabase } from "$lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export interface Activity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'download' | 'send_message' | 'create_proposal';
  entity_type: 'company' | 'contact' | 'proposal' | 'project' | 'document' | 'message' | 'auth';
  entity_id?: string;
  entity_name?: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateActivityDTO {
  activity_type: Activity['activity_type'];
  entity_type: Activity['entity_type'];
  entity_id?: string;
  entity_name?: string;
  description: string;
  metadata?: Record<string, any>;
}

export class ActivityService {
  private async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async logActivity(activity: CreateActivityDTO): Promise<{ data: Activity | null; error: any }> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return { data: null, error: new Error("No authenticated user") };
      }

      const { data, error } = await supabase
        .from("tf_activities")
        .insert({
          ...activity,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error logging activity:", error);
      return { data: null, error };
    }
  }

  async getRecentActivities(limit = 10): Promise<{ data: Activity[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("tf_activities")
        .select(`
          *,
          user:tf_user_profiles!inner(
            first_name,
            last_name,
            user_id
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform the data to include user info properly
      const activities = data?.map(activity => ({
        ...activity,
        user: activity.user ? {
          first_name: activity.user.first_name,
          last_name: activity.user.last_name,
          email: '' // We'll need to fetch this separately if needed
        } : undefined
      })) || [];

      return { data: activities, error: null };
    } catch (error) {
      console.error("Error fetching activities:", error);
      return { data: null, error };
    }
  }

  async getUserActivities(userId: string, limit = 20): Promise<{ data: Activity[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("tf_activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user activities:", error);
      return { data: null, error };
    }
  }

  async getActivitiesByEntity(
    entityType: Activity['entity_type'],
    entityId: string,
    limit = 20
  ): Promise<{ data: Activity[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("tf_activities")
        .select(`
          *,
          user:tf_user_profiles!inner(
            first_name,
            last_name
          )
        `)
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform the data to include user info properly
      const activities = data?.map(activity => ({
        ...activity,
        user: activity.user ? {
          first_name: activity.user.first_name,
          last_name: activity.user.last_name,
          email: ''
        } : undefined
      })) || [];

      return { data: activities, error: null };
    } catch (error) {
      console.error("Error fetching entity activities:", error);
      return { data: null, error };
    }
  }

  // Helper methods for common activities
  async logLogin(): Promise<void> {
    await this.logActivity({
      activity_type: 'login',
      entity_type: 'auth',
      description: 'User logged in'
    });
  }

  async logLogout(): Promise<void> {
    await this.logActivity({
      activity_type: 'logout',
      entity_type: 'auth',
      description: 'User logged out'
    });
  }

  async logCreate(entityType: Activity['entity_type'], entityName: string, entityId?: string): Promise<void> {
    await this.logActivity({
      activity_type: 'create',
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      description: `Created ${entityType}: ${entityName}`
    });
  }

  async logUpdate(entityType: Activity['entity_type'], entityName: string, entityId: string): Promise<void> {
    await this.logActivity({
      activity_type: 'update',
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      description: `Updated ${entityType}: ${entityName}`
    });
  }

  async logDelete(entityType: Activity['entity_type'], entityName: string, entityId: string): Promise<void> {
    await this.logActivity({
      activity_type: 'delete',
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      description: `Deleted ${entityType}: ${entityName}`
    });
  }

  async logView(entityType: Activity['entity_type'], entityName: string, entityId: string): Promise<void> {
    await this.logActivity({
      activity_type: 'view',
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      description: `Viewed ${entityType}: ${entityName}`
    });
  }

  async logProposalCreated(proposalTitle: string, proposalId: string, companyName: string): Promise<void> {
    await this.logActivity({
      activity_type: 'create_proposal',
      entity_type: 'proposal',
      entity_id: proposalId,
      entity_name: proposalTitle,
      description: `Created proposal "${proposalTitle}" for ${companyName}`,
      metadata: { company_name: companyName }
    });
  }

  async logMessageSent(threadId: string, recipientName: string): Promise<void> {
    await this.logActivity({
      activity_type: 'send_message',
      entity_type: 'message',
      entity_id: threadId,
      description: `Sent message to ${recipientName}`
    });
  }
}