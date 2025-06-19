<template>
	<div class="min-h-screen flex items-center justify-center bg-background px-4">
		<UCard class="w-full max-w-md">
			<UCardHeader class="space-y-1">
				<UCardTitle class="text-2xl font-bold text-center">
					{{ error ? 'Sign Out Failed' : 'Signing Out' }}
				</UCardTitle>
				<UCardDescription class="text-center">
					{{ error ? 'There was an issue signing you out' : 'Please wait while we sign you out...' }}
				</UCardDescription>
			</UCardHeader>

			<UCardContent class="space-y-4">
				<!-- Loading State -->
				<div
					v-if="loading"
					class="flex flex-col items-center space-y-4"
				>
					<div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p class="text-sm text-muted-foreground text-center">
						Signing you out and clearing your session...
					</p>
				</div>

				<!-- Success State -->
				<div
					v-else-if="success"
					class="flex flex-col items-center space-y-4"
				>
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
						<Icon
							name="lucide:check"
							class="w-8 h-8 text-green-600"
						/>
					</div>
					<p class="text-sm text-green-600 text-center font-medium">
						Successfully signed out! Redirecting you to the main page...
					</p>
				</div>

				<!-- Error State -->
				<div
					v-else-if="error"
					class="space-y-4"
				>
					<div class="p-4 bg-red-50 border border-red-200 rounded-md">
						<p class="text-sm text-red-800">
							{{ error }}
						</p>
					</div>

					<div class="flex flex-col space-y-2">
						<UButton
							:disabled="loading"
							class="w-full"
							@click="retrySignOut"
						>
							<span
								v-if="loading"
								class="flex items-center"
							>
								<Icon
									name="lucide:loader-2"
									class="animate-spin -ml-1 mr-3 h-4 w-4"
								/>
								Retrying...
							</span>
							<span v-else>Try Again</span>
						</UButton>

						<UButton
							variant="outline"
							class="w-full"
							@click="goToHome"
						>
							Go to Home Page
						</UButton>
					</div>
				</div>
			</UCardContent>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

// Meta tags
definePageMeta({
	layout: false,
});

useHead({
	title: 'Signing Out - AI Role Player Tutor',
	meta: [
		{ name: 'description', content: 'Signing you out securely' },
	],
});

// Composables
const { signOut } = useAuth();
const router = useRouter();

// Reactive state
const loading = ref(true);
const success = ref(false);
const error = ref('');

// Methods
const performSignOut = async () => {
	try {
		loading.value = true;
		error.value = '';

		const result = await signOut();

		if (result.success) {
			success.value = true;
			// Show success message briefly before redirect
			setTimeout(async () => {
				await router.push('/');
			}, 1500);
		}
		else {
			throw new Error(result.error || 'Failed to sign out');
		}
	}
	catch (err: unknown) {
		error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
		success.value = false;
	}
	finally {
		loading.value = false;
	}
};

const retrySignOut = () => {
	performSignOut();
};

const goToHome = () => {
	router.push('/');
};

// Auto-start signout process when component mounts
onMounted(() => {
	performSignOut();
});
</script>
