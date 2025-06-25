import { generateSimplePDF } from "$lib/services/pdf/simplePdfGenerator";
import { supabase } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const proposalId = params.id;

    if (!proposalId) {
      throw error(400, "Proposal ID is required");
    }

    // Fetch proposal data with related company and contact information
    const { data: proposal, error: proposalError } = await supabase
      .from("tf_proposals")
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .eq("id", proposalId)
      .single();

    if (proposalError || !proposal) {
      throw error(404, "Proposal not found");
    }

    // Parse line items if they're stored as JSON
    let lineItems = proposal.line_items;
    if (typeof lineItems === "string") {
      try {
        lineItems = JSON.parse(lineItems);
      } catch (e) {
        lineItems = [];
      }
    }

    // Ensure line items have proper structure
    const formattedLineItems = Array.isArray(lineItems)
      ? lineItems.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          name: item.name || "Unnamed Service",
          description: item.description || "",
          quantity: parseInt(item.quantity) || 1,
          unitPrice: parseFloat(item.unitPrice) || 0,
          total:
            parseFloat(item.total) ||
            (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1),
        }))
      : [];

    // Build the simplified PDF data structure
    const pdfData = {
      proposal: {
        id: proposal.id,
        title: proposal.title,
        line_items: formattedLineItems,
        subtotal: parseFloat(String(proposal.subtotal)) || 0,
        tax: parseFloat(String(proposal.tax)) || 0,
        tax_rate: parseFloat(String(proposal.tax_rate)) || 0,
        total: parseFloat(String(proposal.total)) || 0,
        created_at: proposal.created_at,
      },
      company: proposal.company,
      contact: proposal.contact,
    };

    // Generate clean HTML for PDF
    const htmlContent = generateSimplePDF(pdfData as any);

    // Generate filename
    const companyName = (proposal.company as any)?.name || "unnamed";
    const filename = `proposal-${companyName.replace(
      /[^a-zA-Z0-9]/g,
      "-"
    )}-${proposalId.slice(-8)}.pdf`;

    // Return HTML for now (browser can print to PDF)
    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) {
      throw error(404, "Proposal not found");
    }

    throw error(500, "Failed to generate PDF. Please try again later.");
  }
};

// Optional: Support POST for custom PDF generation options
export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const proposalId = params.id;
    const options = await request.json();

    if (!proposalId) {
      throw error(400, "Proposal ID is required");
    }

    // Fetch proposal data (same as GET)
    const { data: proposal, error: proposalError } = await supabase
      .from("tf_proposals")
      .select(
        `
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `
      )
      .eq("id", proposalId)
      .single();

    if (proposalError || !proposal) {
      throw error(404, "Proposal not found");
    }

    // Parse and format data (same as GET)
    let lineItems = proposal.line_items;
    if (typeof lineItems === "string") {
      try {
        lineItems = JSON.parse(lineItems);
      } catch (e) {
        lineItems = [];
      }
    }

    const formattedLineItems = Array.isArray(lineItems)
      ? lineItems.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          name: item.name || "Unnamed Service",
          description: item.description || "",
          quantity: parseInt(item.quantity) || 1,
          unitPrice: parseFloat(item.unitPrice) || 0,
          total:
            parseFloat(item.total) ||
            (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1),
        }))
      : [];

    const pdfData = {
      proposal: {
        id: proposal.id,
        title: proposal.title,
        line_items: formattedLineItems,
        subtotal: parseFloat(String(proposal.subtotal)) || 0,
        tax: parseFloat(String(proposal.tax)) || 0,
        tax_rate: parseFloat(String(proposal.tax_rate)) || 0,
        total: parseFloat(String(proposal.total)) || 0,
        created_at: proposal.created_at,
      },
      company: proposal.company,
      contact: proposal.contact,
    };

    // Generate clean HTML for PDF
    const htmlContent = generateSimplePDF(pdfData as any);

    const filename = `proposal-${proposalId.slice(-8)}.pdf`;

    // Return HTML file
    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err) {
    throw error(500, "Failed to generate PDF");
  }
};
