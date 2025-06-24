import { paymentLogger } from "$lib/utils/logger";
import { json } from "@sveltejs/kit";
import Stripe from "stripe";
import type { RequestHandler } from "./$types";

const logger = paymentLogger.child({ endpoint: "stripe-webhook" });

const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
  logger.warn("STRIPE_SECRET_KEY not configured - webhook will not function");
}

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    })
  : null;

export const POST: RequestHandler = async ({ request }) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    logger.error("Stripe configuration missing");
    return json(
      {
        error: "Stripe not configured",
        message: "STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      logger.warn("Missing stripe-signature header");
      return json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error({ err }, "Invalid webhook signature");
      return json({ error: "Invalid signature" }, { status: 400 });
    }

    logger.info(
      { eventType: event.type, eventId: event.id },
      "Processing webhook event"
    );

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(
          {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
          },
          "Payment succeeded"
        );
        // TODO: Update proposal status in database
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        logger.warn(
          {
            paymentIntentId: failedPayment.id,
            failureMessage: failedPayment.last_payment_error?.message,
          },
          "Payment failed"
        );
        // TODO: Handle failed payment
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        logger.info(
          {
            invoiceId: invoice.id,
            customerId: invoice.customer,
          },
          "Invoice payment succeeded"
        );
        // TODO: Handle subscription payment
        break;

      default:
        logger.debug({ eventType: event.type }, "Unhandled webhook event type");
        break;
    }

    return json({ received: true });
  } catch (error) {
    logger.error({ error }, "Webhook processing failed");
    return json({ error: "Webhook processing failed" }, { status: 500 });
  }
};
