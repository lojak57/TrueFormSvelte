import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from "$lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "./BaseService";

export class CompanyService extends BaseService<
  Company,
  CreateCompanyDTO,
  UpdateCompanyDTO
> {
  constructor(supabaseClient?: SupabaseClient) {
    super("tf_companies", supabaseClient);
  }

  /**
   * Get companies ordered by name
   */
  async getCompanies(): Promise<Company[]> {
    return this.getAll("name");
  }

  /**
   * Get a single company by ID
   */
  async getCompany(id: string): Promise<Company> {
    return this.getById(id);
  }

  /**
   * Create a new company
   */
  async createCompany(dto: CreateCompanyDTO): Promise<Company> {
    return this.create(dto);
  }

  /**
   * Update an existing company
   */
  async updateCompany(id: string, dto: UpdateCompanyDTO): Promise<Company> {
    return this.update(id, dto);
  }

  /**
   * Delete a company
   */
  async deleteCompany(id: string): Promise<void> {
    return this.delete(id);
  }

  /**
   * Find companies by vertical
   */
  async getCompaniesByVertical(verticalId: string): Promise<Company[]> {
    return this.findWhere({ vertical_id: verticalId }, "name");
  }

  /**
   * Get companies by status
   */
  async getCompaniesByStatus(status: string): Promise<Company[]> {
    return this.findWhere({ status }, "name");
  }

  /**
   * Search companies by name
   */
  async searchCompanies(searchTerm: string): Promise<Company[]> {
    const { data, error } = await this.query()
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .order("name");

    if (error) {
      throw new Error(`Failed to search companies: ${error.message}`);
    }

    return data;
  }

  /**
   * Preprocess create data to set defaults
   */
  protected preprocessCreateData(dto: CreateCompanyDTO): any {
    return {
      name: dto.name,
      website: dto.website || null,
      billing_street: dto.billing_street || null,
      billing_city: dto.billing_city || null,
      billing_state: dto.billing_state || null,
      billing_zip: dto.billing_zip || null,
      billing_country: dto.billing_country || null,
      notes: dto.notes || null,
      status: dto.status || "active",
      vertical_id: dto.vertical_id || null,
    };
  }
}
