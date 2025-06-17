import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '$lib/types';

export class ProjectService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );
  }

  async getProjects(companyId?: string): Promise<Project[]> {
    let query = this.supabase
      .from('tf_company_projects')
      .select('*')
      .order('name');

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async getProject(id: string): Promise<Project> {
    const { data, error } = await this.supabase
      .from('tf_company_projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async createProject(dto: CreateProjectDTO): Promise<Project> {
    const { data, error } = await this.supabase
      .from('tf_company_projects')
      .insert(dto)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProject(id: string, dto: UpdateProjectDTO): Promise<Project> {
    const { data, error } = await this.supabase
      .from('tf_company_projects')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tf_company_projects')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
} 