<template>
	<div class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
		<UCard class="w-full max-w-md mx-4">
			<UCardHeader class="text-center">
				<UCardTitle class="text-xl">
					Sign In to Resolve Case
				</UCardTitle>
				<UCardDescription>
					Join the conversation and work through this case study with AI mentors
				</UCardDescription>
			</UCardHeader>
			<UCardContent class="space-y-4">
				<div class="text-center space-y-2">
					<Icon
						name="lucide:lock"
						class="h-12 w-12 mx-auto text-muted-foreground"
					/>
					<p class="text-sm text-muted-foreground">
						Create an account or sign in to interact with the AI mentor and submit your case resolution.
					</p>
				</div>
				<UButton
					class="w-full"
					@click="handleSignIn"
				>
					<Icon
						name="lucide:log-in"
						class="mr-2 h-4 w-4"
					/>
					Sign In to Continue
				</UButton>
			</UCardContent>
		</UCard>
	</div>
</template>

<script setup lang="ts">
interface Props {
	returnUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
	returnUrl: '',
});

const router = useRouter();

const handleSignIn = () => {
	// Build login URL with return parameter
	const loginUrl = props.returnUrl
		? `/login?return=${encodeURIComponent(props.returnUrl)}`
		: '/login';

	router.push(loginUrl);
};
</script>
