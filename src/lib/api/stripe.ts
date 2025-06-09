import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

export const stripe = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(planType: 'starter' | 'standard' | 'pro', leadId?: string) {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      planType,
      leadId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { sessionId } = await response.json();
  return sessionId;
}

export async function redirectToCheckout(sessionId: string) {
  const stripeInstance = await stripe;
  
  if (!stripeInstance) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripeInstance.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export const planPricing = {
  starter: { price: 9900, name: 'Starter' }, // $99.00 in cents
  standard: { price: 19900, name: 'Standard' }, // $199.00 in cents
  pro: { price: 39900, name: 'Pro' }, // $399.00 in cents
}; 