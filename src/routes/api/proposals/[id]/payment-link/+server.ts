import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: Re-enable when Stripe is integrated (next week)
// Temporarily disabled for deployment since Stripe isn't integrated yet

export const POST: RequestHandler = async ({ params, request, url }) => {
  return json({
    message: 'Payment links not yet available - Stripe integration pending',
    status: 'disabled_pending_stripe_integration',
    proposalId: params.id
  }, { status: 503 });
};

export const GET: RequestHandler = async ({ params, url }) => {
  return json({
    message: 'Payment links not yet available - Stripe integration pending', 
    status: 'disabled_pending_stripe_integration',
    proposalId: params.id
  }, { status: 503 });
};

/* 
TODO: Uncomment when ready to integrate Stripe (next week)

import { stripeService } from '$lib/services/payments/stripeService';
import { supabase } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ params, request, url }) => {
  try {
    const proposalId = params.id;
    
    if (!proposalId) {
      throw error(400, 'Proposal ID is required');
    }

    const { paymentType = 'standard', installments = 1 } = await request.json();

    // Fetch proposal data with related company and contact information
    const { data: proposal, error: proposalError } = await supabase
      .from('tf_proposals')
      .select(`
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `)
      .eq('id', proposalId)
      .single();

    if (proposalError || !proposal) {
      console.error('Error fetching proposal:', proposalError);
      throw error(404, 'Proposal not found');
    }

    // Parse line items if they're stored as JSON
    let lineItems = proposal.line_items;
    if (typeof lineItems === 'string') {
      try {
        lineItems = JSON.parse(lineItems);
      } catch (e) {
        console.error('Error parsing line items:', e);
        lineItems = [];
      }
    }

    // Ensure line items have proper structure
    const formattedLineItems = (lineItems || []).map((item: any, index: number) => ({
      id: item.id || `item-${index}`,
      name: item.name || 'Unnamed Service',
      description: item.description || '',
      quantity: parseInt(item.quantity) || 1,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: parseFloat(item.total) || (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1)
    }));

    // Build the payment options
    const paymentOptions = {
      proposal: {
        ...proposal,
        line_items: formattedLineItems,
        subtotal: parseFloat(proposal.subtotal) || 0,
        tax: parseFloat(proposal.tax) || 0,
        tax_rate: parseFloat(proposal.tax_rate) || 0,
        total: parseFloat(proposal.total) || 0
      },
      company: proposal.company,
      contact: proposal.contact,
      successUrl: `${url.origin}/proposals/${proposalId}/payment-success`,
      cancelUrl: `${url.origin}/proposals/${proposalId}/payment-cancelled`
    };

    let paymentLink: string | string[];

    // Generate payment link based on type
    switch (paymentType) {
      case 'ach':
        paymentLink = await stripeService.createACHPaymentLink(paymentOptions);
        break;
      case 'installments':
        paymentLink = await stripeService.createInstallmentPlan(paymentOptions, installments);
        break;
      case 'standard':
      default:
        paymentLink = await stripeService.createPaymentLink(paymentOptions);
        break;
    }

    // Update proposal with payment link(s) if needed
    const updateData = {
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('tf_proposals')
      .update(updateData)
      .eq('id', proposalId);

    return json({
      success: true,
      paymentLink,
      paymentType,
      proposalId,
      total: proposal.total
    });

  } catch (err) {
    console.error('Error generating payment link:', err);
    
    if (err instanceof Error && err.message.includes('not found')) {
      throw error(404, 'Proposal not found');
    }
    
    throw error(500, 'Failed to generate payment link. Please try again later.');
  }
};

export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const proposalId = params.id;
    
    if (!proposalId) {
      throw error(400, 'Proposal ID is required');
    }

    // Get payment type from query params
    const paymentType = url.searchParams.get('type') || 'standard';
    const installments = parseInt(url.searchParams.get('installments') || '1');

    // Fetch proposal data
    const { data: proposal, error: proposalError } = await supabase
      .from('tf_proposals')
      .select(`
        *,
        company:tf_companies(*),
        contact:tf_contacts(*)
      `)
      .eq('id', proposalId)
      .single();

    if (proposalError || !proposal) {
      throw error(404, 'Proposal not found');
    }

    // Parse and format data (same as POST)
    let lineItems = proposal.line_items;
    if (typeof lineItems === 'string') {
      try {
        lineItems = JSON.parse(lineItems);
      } catch (e) {
        lineItems = [];
      }
    }

    const formattedLineItems = (lineItems || []).map((item: any, index: number) => ({
      id: item.id || `item-${index}`,
      name: item.name || 'Unnamed Service',
      description: item.description || '',
      quantity: parseInt(item.quantity) || 1,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: parseFloat(item.total) || (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1)
    }));

    const paymentOptions = {
      proposal: {
        ...proposal,
        line_items: formattedLineItems,
        subtotal: parseFloat(proposal.subtotal) || 0,
        tax: parseFloat(proposal.tax) || 0,
        tax_rate: parseFloat(proposal.tax_rate) || 0,
        total: parseFloat(proposal.total) || 0
      },
      company: proposal.company,
      contact: proposal.contact,
      successUrl: `${url.origin}/proposals/${proposalId}/payment-success`,
      cancelUrl: `${url.origin}/proposals/${proposalId}/payment-cancelled`
    };

    let paymentLink: string | string[];

    switch (paymentType) {
      case 'ach':
        paymentLink = await stripeService.createACHPaymentLink(paymentOptions);
        break;
      case 'installments':
        paymentLink = await stripeService.createInstallmentPlan(paymentOptions, installments);
        break;
      case 'standard':
      default:
        paymentLink = await stripeService.createPaymentLink(paymentOptions);
        break;
    }

    // For GET requests, redirect to the payment link
    if (typeof paymentLink === 'string') {
      return new Response(null, {
        status: 302,
        headers: {
          Location: paymentLink
        }
      });
    } else {
      // For installments, return the first payment link
      return new Response(null, {
        status: 302,
        headers: {
          Location: paymentLink[0] || `${url.origin}/proposals/${proposalId}`
        }
      });
    }

  } catch (err) {
    console.error('Error generating payment link:', err);
    throw error(500, 'Failed to generate payment link');
  }
};
*/