import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    const config = useRuntimeConfig();

    if (!config.stripeSecretKey || !config.public.stripePriceId) {
      throw new Error('STRIPE_SECRET_KEY or STRIPE_PRICE_ID is not configured');
    }

    stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
      typescript: true,
    });
  }

  return stripe;
};

export const STRIPE_PRICES = {
  PRO_MONTHLY: useRuntimeConfig().public.stripePriceId,
} as const;

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
