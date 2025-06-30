import type Stripe from 'stripe';
import { serverSupabaseServiceRole } from '#supabase/server';
import { getStripe } from '~/server/utils/stripe';
import type { Subscription } from '~/server/types';

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
		const supabase = serverSupabaseServiceRole<{
			subscriptions: Subscription;
		}>(event);

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
				await handleCheckoutCompleted(stripeEvent.data.object, supabase);
				break;

			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(stripeEvent.data.object, stripeEvent.data.object.items.data[0], supabase);
				break;

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(stripeEvent.data.object, supabase);
				break;

			case 'invoice.payment_succeeded':
				await handlePaymentSucceeded(stripeEvent.data.object, supabase);
				break;

			case 'invoice.payment_failed':
				await handlePaymentFailed(stripeEvent.data.object, supabase);
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
	supabase: ReturnType<typeof serverSupabaseServiceRole<{
		subscriptions: Subscription;
	}>>,
) {
	const userId = session.metadata?.user_id;
	if (!userId) {
		console.error('No user_id in checkout session metadata');
		return;
	}

	// Update subscription with Stripe subscription ID
	if (session.subscription && typeof session.subscription === 'string') {
		await supabase
			.from('subscriptions')
			.update({
				stripe_subscription_id: session.subscription,
				status: 'active',
				updated_at: new Date().toISOString(),
			})
			.eq('user_id', userId);
	}
}

// Handle subscription updates
async function handleSubscriptionUpdated(
	subscription: Stripe.Subscription,
	subscriptionItem: Stripe.SubscriptionItem,
	supabase: ReturnType<typeof serverSupabaseServiceRole<{
		subscriptions: Subscription;
	}>>,
) {
	const customerId = typeof subscription.customer === 'string'
		? subscription.customer
		: subscription.customer?.id;

	if (!customerId) {
		console.error('No customer ID in subscription');
		return;
	}

	// Find user by Stripe customer ID
	const { data: userSubscription } = await supabase
		.from('subscriptions')
		.select('*')
		.eq('stripe_customer_id', customerId)
		.single();

	if (!userSubscription) {
		console.error('No subscription found for customer:', customerId);
		return;
	}

	// Determine plan based on subscription
	const plan = subscription.status === 'active' ? 'pro' : 'free';

	await supabase
		.from('subscriptions')
		.update({
			plan,
			status: subscription.status,
			stripe_subscription_id: subscription.id,
			stripe_price_id: subscription.items.data[0]?.price.id || null,
			current_period_start: subscriptionItem.current_period_start
				? new Date(subscriptionItem.current_period_start * 1000).toISOString()
				: null,
			current_period_end: subscriptionItem.current_period_end
				? new Date(subscriptionItem.current_period_end * 1000).toISOString()
				: null,
			updated_at: new Date().toISOString(),
		})
		.eq('id', userSubscription.id);
}

// Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(
	subscription: Stripe.Subscription,
	supabase: ReturnType<typeof serverSupabaseServiceRole<{
		subscriptions: Subscription;
	}>>,
) {
	const customerId = typeof subscription.customer === 'string'
		? subscription.customer
		: subscription.customer?.id;

	if (!customerId) {
		console.error('No customer ID in subscription');
		return;
	}

	await supabase
		.from('subscriptions')
		.update({
			plan: 'free',
			status: 'canceled',
			current_period_end: (subscription as unknown as { current_period_end?: number }).current_period_end
				? new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
				: null,
			updated_at: new Date().toISOString(),
		})
		.eq('stripe_customer_id', customerId);
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
	supabase: ReturnType<typeof serverSupabaseServiceRole<{
		subscriptions: Subscription;
	}>>,
) {
	const subscriptionId = getSubscriptionFromInvoice(invoice);
	console.log('handlePaymentSucceeded', subscriptionId);
	if (subscriptionId) {
		const customerId = typeof invoice.customer === 'string'
			? invoice.customer
			: invoice.customer?.id;

		if (!customerId) {
			console.error('No customer ID in invoice');
			return;
		}

		await supabase
			.from('subscriptions')
			.update({
				status: 'active',
				updated_at: new Date().toISOString(),
			})
			.eq('stripe_customer_id', customerId);
	}
}

// Handle failed payment
async function handlePaymentFailed(
	invoice: Stripe.Invoice,
	supabase: ReturnType<typeof serverSupabaseServiceRole<{
		subscriptions: Subscription;
	}>>,
) {
	const subscriptionId = getSubscriptionFromInvoice(invoice);

	if (subscriptionId) {
		const customerId = typeof invoice.customer === 'string'
			? invoice.customer
			: invoice.customer?.id;

		if (!customerId) {
			console.error('No customer ID in invoice');
			return;
		}

		await supabase
			.from('subscriptions')
			.update({
				status: 'past_due',
				updated_at: new Date().toISOString(),
			})
			.eq('stripe_customer_id', customerId);
	}
}
