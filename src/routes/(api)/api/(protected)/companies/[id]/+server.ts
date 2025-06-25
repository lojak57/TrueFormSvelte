import { updateCompanySchema, validateSchema } from "$lib/schemas/api";
import { supabaseAdmin } from "$lib/supabaseAdmin";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, request, locals }) => {
  // 🔒 SECURE: Require authentication for detailed company data
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;

    // Get company details
    const { data: company, error: companyError } = await supabaseAdmin
      .from("tf_companies")
      .select("*")
      .eq("id", id)
      .single();

    if (companyError) {
      if (companyError.code === "PGRST116") {
        return json({ error: "Company not found" }, { status: 404 });
      }
      throw companyError;
    }

    // Get associated contacts
    const { data: contacts, error: contactsError } = await supabaseAdmin
      .from("tf_contacts")
      .select("*")
      .eq("company_id", id);

    if (contactsError) throw contactsError;

    // Get associated projects
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("tf_company_projects")
      .select("*")
      .eq("company_id", id);

    if (projectsError) throw projectsError;

    // Return company with related data and stats
    const companyWithRelations = {
      ...company,
      contacts: contacts || [],
      projects: projects || [],
      stats: {
        total_contacts: (contacts || []).length,
        active_contacts: (contacts || []).filter((c) => c.status === "active")
          .length,
        total_projects: (projects || []).length,
        active_projects: (projects || []).filter(
          (p) => p.status === "in_progress"
        ).length,
        completed_projects: (projects || []).filter(
          (p) => p.status === "completed"
        ).length,
        total_project_value: (projects || []).reduce(
          (sum, p) => sum + (p.budget || 0),
          0
        ),
      },
    };

    return json(companyWithRelations);
  } catch (error) {
    return json({ error: "Failed to fetch company" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  // 🔒 SECURE: Require authentication for updating companies
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    const rawData = await request.json();

    // 🛡️ SECURE: Validate input data with Zod
    const validation = validateSchema(updateCompanySchema, rawData);
    if (!validation.success) {
      return json({ error: validation.error }, { status: 400 });
    }

    const { data: company, error } = await supabaseAdmin
      .from("tf_companies")
      .update(validation.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return json({ error: "Company not found" }, { status: 404 });
      }
      throw error;
    }

    return json(company);
  } catch (error) {
    return json({ error: "Failed to update company" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, request, locals }) => {
  // 🔒 SECURE: Require authentication for deleting companies
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;

    // Check if company has related records
    const { data: contacts } = await supabaseAdmin
      .from("tf_contacts")
      .select("id")
      .eq("company_id", id)
      .limit(1);

    const { data: projects } = await supabaseAdmin
      .from("tf_company_projects")
      .select("id")
      .eq("company_id", id)
      .limit(1);

    const { data: proposals } = await supabaseAdmin
      .from("tf_proposals")
      .select("id")
      .eq("company_id", id)
      .limit(1);

    if (contacts?.length || projects?.length || proposals?.length) {
      return json(
        {
          error: "Cannot delete company with existing relationships",
          details: {
            hasContacts: !!contacts?.length,
            hasProjects: !!projects?.length,
            hasProposals: !!proposals?.length,
          },
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("tf_companies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete company error:", error);
      if (error.code === "23503") {
        // Foreign key constraint violation
        return json(
          {
            error: "Cannot delete company - it has related records",
            hint: "Delete all contacts, projects, and proposals first",
          },
          { status: 400 }
        );
      }
      throw error;
    }

    return json({ success: true });
  } catch (error) {
    console.error("Failed to delete company:", error);
    return json({ error: "Failed to delete company" }, { status: 500 });
  }
};
