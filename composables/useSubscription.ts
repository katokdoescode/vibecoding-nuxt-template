import type { Database } from '~/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export const useSubscription = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const config = useRuntimeConfig();
	// Reactive subscription state
	const subscription = ref<Subscription | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	/**
	 * Fetch user's current subscription
	 */
	const fetchSubscription = async () => {
		if (!user.value?.id) {
			subscription.value = null;
			return;
		}

		loading.value = true;
		error.value = null;

		try {
			const { data, error: fetchError } = await supabase
				.from('subscriptions')
				.select('*')
				.eq('user_id', user.value.id)
				.single();

			if (fetchError) {
				throw fetchError;
			}

			subscription.value = data;
		}
		catch (err) {
			console.error('Error fetching subscription:', err);
			error.value = err instanceof Error ? err.message : 'Failed to fetch subscription';
		}
		finally {
			loading.value = false;
		}
	};

	/**
	 * Create Stripe checkout session for Pro subscription
	 */
	const createCheckoutSession = async () => {
		if (!user.value?.id) {
			throw new Error('User not authenticated');
		}

		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ url?: string }>('/api/stripe/create-checkout', {
				method: 'POST',
				body: {
					userId: user.value.id,
					priceId: config.public.stripePriceId,
				},
			});

			if (response?.url) {
				// Redirect to Stripe Checkout
				await navigateTo(response.url, { external: true });
			}
		}
		catch (err) {
			console.error('Error creating checkout session:', err);
			error.value = err instanceof Error ? err.message : 'Failed to create checkout session';
		}
		finally {
			loading.value = false;
		}
	};

	/**
	 * Cancel user's subscription
	 */
	const cancelSubscription = async () => {
		if (!user.value?.id || !subscription.value?.stripe_subscription_id) {
			throw new Error('No active subscription to cancel');
		}

		loading.value = true;
		error.value = null;

		try {
			await $fetch('/api/stripe/cancel-subscription', {
				method: 'POST',
				body: {
					subscriptionId: subscription.value.stripe_subscription_id,
				},
			});

			// Refresh subscription data
			await fetchSubscription();
		}
		catch (err) {
			console.error('Error canceling subscription:', err);
			error.value = err instanceof Error ? err.message : 'Failed to cancel subscription';
		}
		finally {
			loading.value = false;
		}
	};

	/**
	 * Check if user has an active Pro subscription
	 */
	const isPro = computed(() => {
		if (!subscription.value) return false;

		return (
			subscription.value.plan === 'pro'
			&& subscription.value.status === 'active'
			&& (!subscription.value.current_period_end
				|| new Date(subscription.value.current_period_end) > new Date())
		);
	});

	/**
	 * Check if user is on free plan
	 */
	const isFree = computed(() => {
		return !isPro.value;
	});

	/**
	 * Get subscription plan display name
	 */
	const planDisplayName = computed(() => {
		if (!subscription.value) return 'Free';
		return subscription.value.plan === 'pro' ? 'Pro' : 'Free';
	});

	/**
	 * Subscribe to real-time subscription updates
	 */
	const subscribeToUpdates = () => {
		if (!user.value?.id) return;

		const channel = supabase
			.channel('subscription-updates')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'subscriptions',
					filter: `user_id=eq.${user.value.id}`,
				},
				(payload) => {
					console.log('Subscription updated:', payload);
					fetchSubscription();
				},
			)
			.subscribe();

		// Return unsubscribe function
		return () => {
			supabase.removeChannel(channel);
		};
	};

	// Auto-fetch subscription when user changes
	watch(user, () => {
		fetchSubscription();
	}, { immediate: true });

	return {
		// State
		subscription: readonly(subscription),
		loading: readonly(loading),
		error: readonly(error),

		// Computed
		isPro,
		isFree,
		planDisplayName,

		// Methods
		fetchSubscription,
		createCheckoutSession,
		cancelSubscription,
		subscribeToUpdates,
	};
};
