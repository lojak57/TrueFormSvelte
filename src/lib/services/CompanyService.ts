import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from "$lib/types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class CompanyService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );
  }

  async getCompanies(): Promise<Company[]> {
    const { data, error } = await this.supabase
      .from("tf_companies")
      .select("*")
      .order("name");

    if (error) throw new Error(error.message);
    return data;
  }

  async getCompany(id: string): Promise<Company> {
    const { data, error } = await this.supabase
      .from("tf_companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async createCompany(dto: CreateCompanyDTO): Promise<Company> {
    // Ensure required fields and set defaults
    const companyData = {
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

    console.log("Inserting company data:", companyData);

    const { data, error } = await this.supabase
      .from("tf_companies")
      .insert(companyData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }
    return data;
  }

  async updateCompany(id: string, dto: UpdateCompanyDTO): Promise<Company> {
    const { data, error } = await this.supabase
      .from("tf_companies")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteCompany(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("tf_companies")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
