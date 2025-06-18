import { puppeteerPdfGenerator } from "$lib/services/pdf/puppeteerPdfGenerator";
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
      console.error("Error fetching proposal:", proposalError);
      throw error(404, "Proposal not found");
    }

    // Parse line items if they're stored as JSON
    let lineItems = proposal.line_items;
    if (typeof lineItems === "string") {
      try {
        lineItems = JSON.parse(lineItems);
      } catch (e) {
        console.error("Error parsing line items:", e);
        lineItems = [];
      }
    }

    // Ensure line items have proper structure
    const formattedLineItems = Array.isArray(lineItems) ? lineItems.map(
      (item: any, index: number) => ({
        id: item.id || `item-${index}`,
        name: item.name || "Unnamed Service",
        description: item.description || "",
        quantity: parseInt(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        total:
          parseFloat(item.total) ||
          (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1),
      })
    ) : [];

    // Build the PDF data structure
    const pdfData = {
      proposal: {
        ...proposal,
        line_items: formattedLineItems,
        subtotal: parseFloat(String(proposal.subtotal)) || 0,
        tax: parseFloat(String(proposal.tax)) || 0,
        tax_rate: parseFloat(String(proposal.tax_rate)) || 0,
        total: parseFloat(String(proposal.total)) || 0,
      },
      company: proposal.company,
      contact: proposal.contact,
    };

    // Check for query parameters
    const includePaymentQR = url.searchParams.get("payment_qr") === "true";
    const includeAcceptanceQR =
      url.searchParams.get("acceptance_qr") === "true";
    const format =
      (url.searchParams.get("format") as "A4" | "Letter") || "Letter";

    // Generate payment and acceptance links
    const baseUrl = url.origin;
    const paymentLink = includePaymentQR ? `${baseUrl}/api/proposals/${proposalId}/payment-link?type=standard` : undefined;
    const acceptanceLink = includeAcceptanceQR ? `${baseUrl}/proposals/${proposalId}/accept` : undefined;

    // Update PDF data with optional links
    const completePdfData = {
      ...pdfData,
      paymentLink,
      acceptanceLink,
    };

    // Generate actual PDF using Puppeteer
    const pdfBuffer = await puppeteerPdfGenerator.generatePDF(completePdfData as any, {
      includePaymentQR,
      includeAcceptanceQR,
      format,
      logoUrl: `${baseUrl}/logo.svg`,
    });

    // Generate filename
    const companyName = (proposal.company as any)?.name || "unnamed";
    const filename = `proposal-${companyName.replace(/[^a-zA-Z0-9]/g, "-")}-${proposalId.slice(-8)}.pdf`;

    // Return actual PDF file
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("Error generating PDF:", err);

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

    const formattedLineItems = Array.isArray(lineItems) ? lineItems.map(
      (item: any, index: number) => ({
        id: item.id || `item-${index}`,
        name: item.name || "Unnamed Service",
        description: item.description || "",
        quantity: parseInt(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        total:
          parseFloat(item.total) ||
          (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1),
      })
    ) : [];

    const pdfData = {
      proposal: {
        ...proposal,
        line_items: formattedLineItems,
        subtotal: parseFloat(String(proposal.subtotal)) || 0,
        tax: parseFloat(String(proposal.tax)) || 0,
        tax_rate: parseFloat(String(proposal.tax_rate)) || 0,
        total: parseFloat(String(proposal.total)) || 0,
      },
      company: proposal.company,
      contact: proposal.contact,
      paymentLink: options.paymentLink,
      acceptanceLink: options.acceptanceLink,
    };

    // Generate PDF with custom options
    const pdfBuffer = await puppeteerPdfGenerator.generatePDF(pdfData as any, {
      includePaymentQR: options.includePaymentQR || false,
      includeAcceptanceQR: options.includeAcceptanceQR || false,
      format: options.format || "Letter",
      logoUrl: options.logoUrl,
    });

    const filename = `proposal-${proposalId.slice(-8)}.pdf`;

    // Return actual PDF file
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Error generating custom PDF:", err);
    throw error(500, "Failed to generate PDF");
  }
};
