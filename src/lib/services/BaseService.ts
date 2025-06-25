import { createServerClient } from "$lib/supabase/factory";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Base service class providing common CRUD operations
 * Eliminates code duplication across all service classes
 */
export abstract class BaseService<T, CreateDTO, UpdateDTO> {
  protected supabase: SupabaseClient;
  protected tableName: string;

  constructor(tableName: string, supabaseClient?: SupabaseClient) {
    this.tableName = tableName;
    this.supabase = supabaseClient || createServerClient();
  }

  /**
   * Get all records with optional ordering
   */
  async getAll(orderBy = "created_at"): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .order(orderBy);

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  /**
   * Get a single record by ID
   */
  async getById(id: string): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error(`${this.tableName} with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new record
   */
  async create(dto: CreateDTO): Promise<T> {
    const processedData = this.preprocessCreateData(dto);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(processedData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing record
   */
  async update(id: string, dto: UpdateDTO): Promise<T> {
    const processedData = this.preprocessUpdateData(dto);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(processedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error(`${this.tableName} with ID ${id} not found`);
      }
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`);
    }
  }

  /**
   * Find records with custom filters
   */
  async findWhere(
    filters: Record<string, any>,
    orderBy = "created_at"
  ): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select("*");

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query.order(orderBy);

    if (error) {
      throw new Error(`Failed to query ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  /**
   * Count records with optional filters
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Override this method to preprocess data before creation
   */
  protected preprocessCreateData(dto: CreateDTO): any {
    return dto;
  }

  /**
   * Override this method to preprocess data before update
   */
  protected preprocessUpdateData(dto: UpdateDTO): any {
    return dto;
  }

  /**
   * Custom query builder for complex operations
   */
  protected query() {
    return this.supabase.from(this.tableName);
  }
}
