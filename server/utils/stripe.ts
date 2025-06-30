import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
	if (!stripe) {
		const config = useRuntimeConfig();

		if (!config.stripeSecretKey || !config.public.stripePriceId) {
			throw new Error('STRIPE_SECRET_KEY or STRIPE_PRICE_ID is not configured');
		}

		stripe = new Stripe(config.stripeSecretKey, {
			apiVersion: '2025-05-28.basil',
			typescript: true,
		});
	}

	return stripe;
};

// Stripe Price IDs for plans (these should be set in your Stripe dashboard)
// IMPORTANT: Replace 'price_1234567890' with your actual Stripe Price ID from your dashboard
export const STRIPE_PRICES = {
	PRO_MONTHLY: useRuntimeConfig().public.stripePriceId,
} as const;

// Subscription status mapping
export const SUBSCRIPTION_STATUS = {
	ACTIVE: 'active',
	CANCELED: 'canceled',
	INCOMPLETE: 'incomplete',
	INCOMPLETE_EXPIRED: 'incomplete_expired',
	PAST_DUE: 'past_due',
	TRIALING: 'trialing',
	UNPAID: 'unpaid',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
