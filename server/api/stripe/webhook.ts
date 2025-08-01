import type Stripe from 'stripe';
// import { serverSupabaseServiceRole } from '#supabase/server';
import { getStripe } from '~/server/utils/stripe';

/**
 * Stripe Webhook Handler for Basil API (2025-03-31+)
 *
 * Uses the new parent field structure for invoicing objects.
 * Handles subscription lifecycle events and payment status updates.
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const stripe = getStripe();
    // const supabase = serverSupabaseServiceRole(event);

    // Get the raw body for webhook signature verification
    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature');

    if (!body || !signature) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing body or signature',
      });
    }

    if (!config.stripeWebhookSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Webhook secret not configured',
      });
    }

    // Verify webhook signature
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret,
    );

    console.log('Received Stripe webhook:', stripeEvent.type);

    // Handle different event types
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;

      default:
        console.log('Unhandled webhook event:', stripeEvent.type);
    }

    return { received: true };
  }
  catch (error) {
    console.error('Webhook error:', error);
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook error',
    });
  }
});

// Handle successful checkout session
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  // supabase: ReturnType<typeof serverSupabaseServiceRole>,
) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in checkout session metadata');
    return;
  }

  // Update subscription with Stripe subscription ID
  if (session.subscription && typeof session.subscription === 'string') {
    // COMPLETE
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  // subscriptionItem: Stripe.SubscriptionItem,
  // supabase: ReturnType<typeof serverSupabaseServiceRole>,
) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.error('No customer ID in subscription');
    return;
  }

  // Determine plan based on subscription
  // const plan = subscription.status === 'active' ? 'pro' : 'free';

  // COMPLETE
}

// Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  // supabase: ReturnType<typeof serverSupabaseServiceRole>,
) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.error('No customer ID in subscription');
    return;
  }

  // COMPLETE
}

// Get subscription ID from invoice using Basil API parent field structure
function getSubscriptionFromInvoice(invoice: Stripe.Invoice): string | null {
  // Basil API format: Use parent field structure
  if (invoice.parent?.type === 'subscription_details'
    && invoice.parent.subscription_details?.subscription) {
    const subscription = invoice.parent.subscription_details.subscription;
    return typeof subscription === 'string' ? subscription : subscription.id;
  }

  return null;
}

// Handle successful payment
async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  // supabase: ReturnType<typeof serverSupabaseServiceRole>,
) {
  const subscriptionId = getSubscriptionFromInvoice(invoice);
  console.log('handlePaymentSucceeded', subscriptionId);
  // COMPLETE
}

// Handle failed payment
async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  // supabase: ReturnType<typeof serverSupabaseServiceRole>,
) {
  const subscriptionId = getSubscriptionFromInvoice(invoice);
  console.log('handlePaymentFailed', subscriptionId);

  // COMPLETE
}
