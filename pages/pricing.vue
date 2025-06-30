<template>
	<div class="min-h-screen bg-background">
		<!-- Header -->
		<div class="container mx-auto px-4 py-8">
			<div class="text-center mb-12">
				<h1 class="text-4xl font-bold mb-4">
					Choose Your Plan
				</h1>
				<p class="text-xl text-muted-foreground">
					Start with Free, upgrade to Pro when you need more advanced features
				</p>
			</div>

			<!-- Pricing Cards -->
			<div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				<!-- Free Plan -->
				<UCard class="relative">
					<UCardHeader>
						<div class="text-center">
							<h3 class="text-2xl font-bold">
								Free
							</h3>
							<div class="mt-4 flex items-baseline justify-center">
								<span class="text-5xl font-bold">$0</span>
								<span class="text-xl text-muted-foreground ml-1">/month</span>
							</div>
						</div>
					</UCardHeader>
					<UCardContent>
						<ul class="space-y-4">
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Access to all cases</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>AI role-playing tutors</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Basic chat history</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:x"
									class="h-5 w-5 text-muted-foreground mr-3 mt-0.5"
								/>
								<span class="text-muted-foreground">Advanced analytics</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:x"
									class="h-5 w-5 text-muted-foreground mr-3 mt-0.5"
								/>
								<span class="text-muted-foreground">Priority support</span>
							</li>
						</ul>
					</UCardContent>
					<UCardFooter>
						<UButton
							:variant="isCurrentPlan('free') ? 'default' : 'outline'"
							class="w-full"
							:disabled="isCurrentPlan('free')"
						>
							{{ isCurrentPlan('free') ? 'Current Plan' : 'Get Started' }}
						</UButton>
					</UCardFooter>

					<!-- Current Plan Badge -->
					<div
						v-if="isCurrentPlan('free')"
						class="absolute -top-3 left-1/2 transform -translate-x-1/2"
					>
						<UBadge>Current Plan</UBadge>
					</div>
				</UCard>

				<!-- Pro Plan -->
				<UCard class="relative border-2 border-primary">
					<UCardHeader>
						<div class="text-center">
							<div class="flex justify-center items-center gap-2 mb-2">
								<h3 class="text-2xl font-bold">
									Pro
								</h3>
								<UBadge variant="secondary">
									Most Popular
								</UBadge>
							</div>
							<div class="mt-4 flex items-baseline justify-center">
								<span class="text-5xl font-bold">$19</span>
								<span class="text-xl text-muted-foreground ml-1">/month</span>
							</div>
						</div>
					</UCardHeader>
					<UCardContent>
						<ul class="space-y-4">
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Everything in Free</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Advanced analytics</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Unlimited chat history</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Priority support</span>
							</li>
							<li class="flex items-start">
								<Icon
									name="lucide:check"
									class="h-5 w-5 text-green-500 mr-3 mt-0.5"
								/>
								<span>Early access to new features</span>
							</li>
						</ul>
					</UCardContent>
					<UCardFooter>
						<UButton
							:variant="isCurrentPlan('pro') ? 'default' : 'default'"
							class="w-full"
							:disabled="isCurrentPlan('pro') || subscriptionLoading"
							@click="handleUpgrade"
						>
							<Icon
								v-if="subscriptionLoading"
								name="lucide:loader-2"
								class="h-4 w-4 mr-2 animate-spin"
							/>
							{{ getProButtonText() }}
						</UButton>
					</UCardFooter>

					<!-- Current Plan Badge -->
					<div
						v-if="isCurrentPlan('pro')"
						class="absolute -top-3 left-1/2 transform -translate-x-1/2"
					>
						<UBadge>Current Plan</UBadge>
					</div>
				</UCard>
			</div>

			<!-- Success/Error Messages -->
			<div
				v-if="successMessage || errorMessage"
				class="mt-8 max-w-2xl mx-auto"
			>
				<UAlert
					v-if="successMessage"
					class="mb-4"
				>
					<Icon
						name="lucide:check-circle"
						class="h-4 w-4"
					/>
					<UAlertTitle>Success!</UAlertTitle>
					<UAlertDescription>{{ successMessage }}</UAlertDescription>
				</UAlert>

				<UAlert
					v-if="errorMessage"
					variant="destructive"
					class="mb-4"
				>
					<Icon
						name="lucide:alert-circle"
						class="h-4 w-4"
					/>
					<UAlertTitle>Error</UAlertTitle>
					<UAlertDescription>{{ errorMessage }}</UAlertDescription>
				</UAlert>
			</div>

			<!-- Subscription Management for Pro Users -->
			<div
				v-if="isPro && user"
				class="mt-12 max-w-2xl mx-auto"
			>
				<UCard>
					<UCardHeader>
						<UCardTitle>Manage Subscription</UCardTitle>
						<UCardDescription>
							Your Pro subscription is active
							<span v-if="subscription?.current_period_end">
								until {{ formatDate(subscription.current_period_end) }}
							</span>
						</UCardDescription>
					</UCardHeader>
					<UCardContent>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<span>Current Plan</span>
								<UBadge>{{ planDisplayName }}</UBadge>
							</div>
							<div
								v-if="subscription?.current_period_end"
								class="flex items-center justify-between"
							>
								<span>Next Billing Date</span>
								<span class="text-sm text-muted-foreground">
									{{ formatDate(subscription.current_period_end) }}
								</span>
							</div>
						</div>
					</UCardContent>
					<UCardFooter>
						<UButton
							variant="destructive"
							:disabled="subscriptionLoading"
							@click="handleCancelSubscription"
						>
							<Icon
								v-if="subscriptionLoading"
								name="lucide:loader-2"
								class="h-4 w-4 mr-2 animate-spin"
							/>
							Cancel Subscription
						</UButton>
					</UCardFooter>
				</UCard>
			</div>

			<!-- FAQ Section -->
			<div class="mt-16 max-w-4xl mx-auto">
				<h2 class="text-3xl font-bold text-center mb-8">
					Frequently Asked Questions
				</h2>
				<div class="grid md:grid-cols-2 gap-8">
					<div>
						<h3 class="text-lg font-semibold mb-2">
							Can I change plans anytime?
						</h3>
						<p class="text-muted-foreground">
							Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
						</p>
					</div>
					<div>
						<h3 class="text-lg font-semibold mb-2">
							What payment methods do you accept?
						</h3>
						<p class="text-muted-foreground">
							We accept all major credit cards through our secure Stripe payment processor.
						</p>
					</div>
					<div>
						<h3 class="text-lg font-semibold mb-2">
							Can I cancel my subscription?
						</h3>
						<p class="text-muted-foreground">
							Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.
						</p>
					</div>
					<div>
						<h3 class="text-lg font-semibold mb-2">
							Is there a free trial?
						</h3>
						<p class="text-muted-foreground">
							The Free plan provides full access to our core features. You can upgrade to Pro when you need advanced features.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Meta tags for SEO
useSeoMeta({
	title: 'Pricing - AI Role Player Tutor',
	description: 'Choose the perfect plan for your learning needs. Start free or upgrade to Pro for advanced features.',
});

// Composables
const { user, isAuthenticated } = useAuth();
const {
	subscription,
	loading: subscriptionLoading,
	error,
	isPro,
	planDisplayName,
	createCheckoutSession,
	cancelSubscription,
	fetchSubscription,
} = useSubscription();

// State
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Check URL params for success/cancel messages
onMounted(async () => {
	const route = useRoute();
	if (route.query.success === 'true') {
		successMessage.value = 'Welcome to Pro! Your subscription is now active.';
		// Refresh subscription data to update visual state
		await fetchSubscription();
	}
	else if (route.query.canceled === 'true') {
		errorMessage.value = 'Payment was canceled. You can try again anytime.';
	}
});

// Clear messages after errors change
watch(error, (newError) => {
	if (newError) {
		errorMessage.value = newError;
	}
});

// Methods
const isCurrentPlan = (plan: 'free' | 'pro') => {
	if (!isAuthenticated.value) return plan === 'free';

	if (plan === 'pro') {
		return isPro.value;
	}
	else {
		return !isPro.value;
	}
};

const getProButtonText = () => {
	if (!isAuthenticated.value) return 'Sign In to Upgrade';
	if (isPro.value) return 'Current Plan';
	return subscriptionLoading.value ? 'Processing...' : 'Upgrade to Pro';
};

const handleUpgrade = async () => {
	if (!isAuthenticated.value) {
		await navigateTo('/login');
		return;
	}

	if (isPro.value) return;

	try {
		await createCheckoutSession();
	}
	catch {
		errorMessage.value = 'Failed to start checkout. Please try again.';
	}
};

const handleCancelSubscription = async () => {
	if (!confirm('Are you sure you want to cancel your subscription? You\'ll lose access to Pro features at the end of your billing period.')) {
		return;
	}

	try {
		await cancelSubscription();
		successMessage.value = 'Your subscription has been canceled. You\'ll continue to have Pro access until the end of your billing period.';
		errorMessage.value = null;
	}
	catch {
		errorMessage.value = 'Failed to cancel subscription. Please try again or contact support.';
	}
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};
</script>
