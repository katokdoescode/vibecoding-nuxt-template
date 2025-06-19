<template>
	<div class="min-h-screen flex items-center justify-center bg-background px-4">
		<UCard class="w-full max-w-md">
			<UCardHeader class="space-y-1">
				<UCardTitle class="text-2xl font-bold text-center">
					{{ isSignUp ? 'Create Account' : 'Welcome Back' }}
				</UCardTitle>
				<UCardDescription class="text-center">
					{{ isSignUp ? 'Sign up to get started' : 'Sign in to your account' }}
				</UCardDescription>
			</UCardHeader>

			<UCardContent class="space-y-4">
				<!-- Success Message for Sign Up -->
				<div
					v-if="showEmailConfirmation"
					class="p-4 bg-green-50 border border-green-200 rounded-md"
				>
					<p class="text-sm text-green-800">
						✅ Account created successfully! Please check your email for a confirmation link to activate your account.
					</p>
				</div>

				<!-- Already Authenticated Message -->
				<div
					v-if="showRedirectMessage && isClient"
					class="p-4 bg-blue-50 border border-blue-200 rounded-md"
				>
					<p class="text-sm text-blue-800 flex items-center">
						<svg
							class="animate-spin -ml-1 mr-3 h-4 w-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						You are already signed in! Redirecting you to the main page...
					</p>
				</div>

				<!-- Error Message -->
				<div
					v-if="error"
					class="p-4 bg-red-50 border border-red-200 rounded-md"
				>
					<p class="text-sm text-red-800">
						{{ error }}
					</p>
				</div>

				<!-- Google Sign In Button -->
				<UButton
					:disabled="loading || showRedirectMessage"
					variant="outline"
					class="w-full"
					@click="handleGoogleSignIn"
				>
					<svg
						class="w-5 h-5 mr-2"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</UButton>

				<!-- Divider -->
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
					</div>
				</div>

				<!-- Email/Password Form -->
				<form
					class="space-y-4"
					@submit.prevent="handleEmailAuth"
				>
					<div class="space-y-2">
						<ULabel for="email">
							Email
						</ULabel>
						<UInput
							id="email"
							v-model="form.email"
							type="email"
							placeholder="Enter your email"
							required
							:disabled="loading || showRedirectMessage"
						/>
					</div>

					<div class="space-y-2">
						<ULabel for="password">
							Password
						</ULabel>
						<UInput
							id="password"
							v-model="form.password"
							type="password"
							placeholder="Enter your password"
							required
							:disabled="loading || showRedirectMessage"
							:minlength="isSignUp ? 6 : undefined"
						/>
					</div>

					<div
						v-if="isSignUp"
						class="space-y-2"
					>
						<ULabel for="confirmPassword">
							Confirm Password
						</ULabel>
						<UInput
							id="confirmPassword"
							v-model="form.confirmPassword"
							type="password"
							placeholder="Confirm your password"
							required
							:disabled="loading || showRedirectMessage"
							minlength="6"
						/>
					</div>

					<UButton
						type="submit"
						:disabled="loading || (isSignUp && !isPasswordConfirmed) || showRedirectMessage"
						class="w-full"
					>
						<span
							v-if="loading"
							class="flex items-center"
						>
							<svg
								class="animate-spin -ml-1 mr-3 h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							{{ isSignUp ? 'Creating Account...' : 'Signing In...' }}
						</span>
						<span v-else>
							{{ isSignUp ? 'Create Account' : 'Sign In' }}
						</span>
					</UButton>
				</form>
			</UCardContent>

			<UCardFooter>
				<p class="text-sm text-center text-muted-foreground w-full">
					{{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
					<button
						class="font-medium text-primary hover:underline ml-1"
						type="button"
						@click="toggleMode"
					>
						{{ isSignUp ? 'Sign In' : 'Sign Up' }}
					</button>
				</p>
			</UCardFooter>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useSupabaseUser } from '#imports';
import { useAuth } from '~/composables/useAuth';

// Meta tags
definePageMeta({
	layout: false,
});

useHead({
	title: 'Login - AI Role Player Tutor',
	meta: [
		{ name: 'description', content: 'Sign in to your AI Role Player Tutor account' },
	],
});

// Composables
const { signInWithEmail, signUp, signInWithGoogle } = useAuth();
const user = useSupabaseUser();
const router = useRouter();

// Reactive state
const isSignUp = ref(false);
const loading = ref(false);
const error = ref('');
const showEmailConfirmation = ref(false);
const showRedirectMessage = ref(false);
const isClient = ref(false);

const form = ref({
	email: '',
	password: '',
	confirmPassword: '',
});

// Computed
const isPasswordConfirmed = computed(() => {
	if (!isSignUp.value) return true;
	return form.value.password === form.value.confirmPassword && form.value.password.length >= 6;
});

// Watch for user changes and redirect if authenticated
// Only run on client side to avoid hydration mismatches
onMounted(() => {
	// Set client flag to true
	isClient.value = true;

	// Check immediately on mount
	if (user.value) {
		showRedirectMessage.value = true;
		// Redirect after a brief delay to show the message
		setTimeout(() => {
			router.push('/');
		}, 2000);
	}
});

// Watch for future user changes
watch(user, (newUser) => {
	if (import.meta.client && newUser) {
		showRedirectMessage.value = true;
		// Redirect after a brief delay to show the message
		setTimeout(() => {
			router.push('/');
		}, 2000);
	}
});

// Methods
const clearForm = () => {
	form.value = {
		email: '',
		password: '',
		confirmPassword: '',
	};
};

const clearError = () => {
	error.value = '';
	showEmailConfirmation.value = false;
};

const toggleMode = () => {
	isSignUp.value = !isSignUp.value;
	clearForm();
	clearError();
};

const handleGoogleSignIn = async () => {
	try {
		loading.value = true;
		clearError();

		const result = await signInWithGoogle();

		if (!result.success) {
			throw new Error(result.error || 'Failed to sign in with Google');
		}
	}
	catch (err: unknown) {
		error.value = err instanceof Error ? err.message : 'Failed to sign in with Google';
	}
	finally {
		loading.value = false;
	}
};

const handleEmailAuth = async () => {
	try {
		loading.value = true;
		clearError();

		if (isSignUp.value) {
			// Sign up
			const result = await signUp(
				form.value.email,
				form.value.password,
				form.value.confirmPassword,
			);

			if (!result.success) {
				throw new Error(result.error || 'Failed to create account');
			}

			// Show success message and clear form
			showEmailConfirmation.value = true;
			clearForm();
		}
		else {
			// Sign in
			const result = await signInWithEmail(
				form.value.email,
				form.value.password,
			);

			if (!result.success) {
				throw new Error(result.error || 'Failed to sign in');
			}
		}
	}
	catch (err: unknown) {
		error.value = err instanceof Error ? err.message : 'An error occurred';
	}
	finally {
		loading.value = false;
	}
};

// Clear error when form changes (client-side only)
watch(() => [form.value.email, form.value.password, form.value.confirmPassword], () => {
	if (import.meta.client && error.value) {
		error.value = '';
	}
});
</script>

<style>

</style>
