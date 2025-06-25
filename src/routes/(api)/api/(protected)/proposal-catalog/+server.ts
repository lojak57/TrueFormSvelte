import { createClient } from "@supabase/supabase-js";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const isActive = url.searchParams.get("is_active");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    let query = supabase
      .from("tf_proposal_catalog")
      .select("*")
      .order("category, name");

    // Apply filters
    if (category) query = query.eq("category", category);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    } else {
      // Default to only active items
      query = query.eq("is_active", true);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: items, error, count } = await query;

    if (error) throw error;

    return json({
      items: items || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching catalog items:", error);
    return json({ error: "Failed to fetch catalog items" }, { status: 500 });
  }
};
