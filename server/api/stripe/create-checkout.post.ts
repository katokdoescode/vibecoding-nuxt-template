import { z } from 'zod';
import { serverSupabaseServiceRole } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import { getStripe, STRIPE_PRICES } from '~/server/utils/stripe';
import type { Subscription } from '~/server/types';
import { useRuntimeConfig } from '#imports';

const requestSchema = z.object({
	userId: z.string().uuid(),
	priceId: z.enum([useRuntimeConfig().public.stripePriceId]),
});

export default defineEventHandler(async (event) => {
	// Ensure user is authenticated
	const user = await requireAuth(event);

	try {
		// Validate request body
		const body = await readBody(event);
		const { userId, priceId } = requestSchema.parse(body);

		// Ensure user can only create checkout for themselves
		if (user.id !== userId) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Forbidden: Cannot create checkout for another user',
			});
		}

		const stripe = getStripe();

		// Map internal price IDs to Stripe price IDs
		const stripePriceId = priceId === STRIPE_PRICES.PRO_MONTHLY ? STRIPE_PRICES.PRO_MONTHLY : null;

		if (!stripePriceId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Invalid price ID',
			});
		}

		// Get or create Stripe customer
		const supabase = serverSupabaseServiceRole<{
			subscriptions: Subscription;
		}>(event);

		// Check if user already has a Stripe customer ID
		const { data: subscription } = await supabase
			.from('subscriptions')
			.select('stripe_customer_id')
			.eq('user_id', userId)
			.single();

		let customerId = subscription?.stripe_customer_id;

		// Create Stripe customer if doesn't exist
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: user.email || undefined,
				metadata: {
					user_id: userId,
				},
			});

			customerId = customer.id;

			// Update subscription record with customer ID
			await supabase
				.from('subscriptions')
				.update({ stripe_customer_id: customerId })
				.eq('user_id', userId);
		}

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ['card'],
			line_items: [
				{
					price: stripePriceId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `${getHeader(event, 'origin') || 'http://localhost:3000'}/pricing?success=true`,
			cancel_url: `${getHeader(event, 'origin') || 'http://localhost:3000'}/pricing?canceled=true`,
			metadata: {
				user_id: userId,
			},
		});

		return {
			url: session.url,
		};
	}
	catch (error) {
		console.error('Error creating checkout session:', error);

		if (error instanceof z.ZodError) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Invalid request data',
				data: error.errors,
			});
		}

		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to create checkout session',
		});
	}
});
