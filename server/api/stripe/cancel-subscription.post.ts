import { z } from 'zod';
import { serverSupabaseServiceRole } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import { getStripe } from '~/server/utils/stripe';
import type { Subscription } from '~/server/types';

const requestSchema = z.object({
	subscriptionId: z.string(),
});

export default defineEventHandler(async (event) => {
	// Ensure user is authenticated
	const user = await requireAuth(event);

	try {
		// Validate request body
		const body = await readBody(event);
		const { subscriptionId } = requestSchema.parse(body);

		const stripe = getStripe();
		const supabase = serverSupabaseServiceRole<{
			subscriptions: Subscription;
		}>(event);

		// Verify that the subscription belongs to the authenticated user
		const { data: subscription, error: fetchError } = await supabase
			.from('subscriptions')
			.select('*')
			.eq('user_id', user.id)
			.eq('stripe_subscription_id', subscriptionId)
			.single();

		if (fetchError || !subscription) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Subscription not found',
			});
		}

		// Cancel the subscription in Stripe
		await stripe.subscriptions.cancel(subscriptionId);

		// Update subscription status in database
		await supabase
			.from('subscriptions')
			.update({
				status: 'canceled',
				updated_at: new Date().toISOString(),
			})
			.eq('id', subscription.id);

		return {
			success: true,
			message: 'Subscription canceled successfully',
		};
	}
	catch (error) {
		console.error('Error canceling subscription:', error);

		if (error instanceof z.ZodError) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Invalid request data',
				data: error.errors,
			});
		}

		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to cancel subscription',
		});
	}
});
