import type { BaseformLead } from "../types/database.types";
import { supabase } from "../supabaseClient";

export async function createLead(leadData: Partial<BaseformLead>) {
  const { data, error } = await supabase
    .from("baseform_leads")
    .insert([leadData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  return data;
}

export async function getLeads(organizationId?: string) {
  let query = supabase
    .from("baseform_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return data;
}

export async function createOpportunityFromLead(
  leadId: string,
  opportunityData: any
) {
  const { data, error } = await supabase
    .from("baseform_opportunities")
    .insert([
      {
        lead_id: leadId,
        stage: "discovery",
        ...opportunityData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create opportunity: ${error.message}`);
  }

  return data;
}
