import { supabase } from "$lib/supabaseClient";

export interface TrueFormLead {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  projectDescription: string;
  websiteType: string;
  features: string[];
  colorPreferences?: string;
  stylePreference: string;
  brandAssets: boolean;
  timeline: string;
  budgetRange: string;
  planType: string;
}

export interface TrueFormOpportunity {
  id: string;
  name: string;
  contact_id: string;
  status:
    | "new"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  value: number;
  probability: number;
  expected_close_date?: string;
  source: string;
  notes?: string;
  company: string;
  email: string;
  phone?: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company: string;
  org_id: string;
}

// Client-side functions that call API endpoints
export async function createTrueFormOpportunity(leadData: TrueFormLead) {
  const response = await fetch("/api/opportunities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.details || error.message || "Failed to create opportunity"
    );
  }

  return response.json();
}

// Get all TrueForm opportunities via API
export async function getTrueFormOpportunities() {
  const response = await fetch("/api/opportunities");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch opportunities");
  }

  return response.json();
}

// Update opportunity status via API
export async function updateOpportunityStatus(
  opportunityId: string,
  status: string,
  notes?: string
) {
  const response = await fetch("/api/opportunities", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ opportunityId, status, notes }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update opportunity");
  }

  return response.json();
}

// Helper function to convert budget range to numeric value
function getBudgetValue(budgetRange: string): number {
  // Handle wizard custom pricing
  if (budgetRange.includes("Custom Quote") || budgetRange === "Enterprise") {
    return 0; // Will be updated manually
  }

  // Extract numeric value from custom pricing like "$1549 - Custom"
  const customMatch = budgetRange.match(/\$(\d+)\s*-\s*Custom/);
  if (customMatch) {
    return parseInt(customMatch[1]);
  }

  // Handle standard pricing tiers
  switch (budgetRange) {
    case "$99 - Starter":
      return 99;
    case "$199 - Standard":
      return 199;
    case "$399 - Pro":
      return 399;
    case "Custom Quote":
      return 0; // Will be updated manually
    default:
      return 199; // Default to Standard
  }
}

// Get opportunity activities
export async function getOpportunityActivities(opportunityId: string) {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch activities: ${error.message}`);

    return data;
  } catch (error) {
    console.error("Error fetching opportunity activities:", error);
    throw error;
  }
}

// Add activity to opportunity
export async function addOpportunityActivity(
  opportunityId: string,
  type: "call" | "email" | "meeting" | "note" | "task",
  title: string,
  description?: string,
  scheduledDate?: string
) {
  try {
    const { data, error } = await supabase
      .from("activities")
      .insert([
        {
          opportunity_id: opportunityId,
          type,
          title,
          description: description || "",
          scheduled_date: scheduledDate || null,
          created_by: "User", // In real app, this would be the current user
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Failed to add activity: ${error.message}`);

    return data;
  } catch (error) {
    console.error("Error adding opportunity activity:", error);
    throw error;
  }
}
