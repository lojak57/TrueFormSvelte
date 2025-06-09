import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return json({ error: 'Missing stripe signature' }, { status: 400 });
    }

    // Verify webhook signature - CRITICAL SECURITY FIX
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update invoice status in Supabase
        const { error } = await supabase
          .from('invoices')
          .update({ 
            status: 'paid',
            paid_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);

        if (error) {
          console.error('Error updating invoice:', error);
          return json({ error: 'Failed to update invoice' }, { status: 500 });
        }

        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}; 