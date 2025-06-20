<template>
	<div>
		<!-- Side Panel Toggle Button -->
		<UButton
			variant="outline"
			size="icon"
			class="fixed top-4 right-4 z-50"
			@click="toggleSidePanel"
		>
			<Icon
				name="lucide:menu"
				class="h-4 w-4"
			/>
		</UButton>

		<!-- Collapsible Side Panel -->
		<USheet v-model:open="sidePanelOpen">
			<USheetContent
				side="right"
				class="w-80 px-4"
			>
				<USheetHeader>
					<USheetTitle>Actions</USheetTitle>
				</USheetHeader>
				<ColorMode />
				<div class="mt-6 space-y-4">
					<div v-if="!user">
						<UButton
							as="a"
							href="/login"
							class="w-full"
						>
							Login
						</UButton>
					</div>
					<div
						v-else
						class="space-y-4"
					>
						<div class="flex items-center space-x-3">
							<UAvatar class="h-8 w-8">
								<UAvatarFallback>
									{{ user.email?.charAt(0).toUpperCase() }}
								</UAvatarFallback>
							</UAvatar>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate">
									{{ user.email }}
								</p>
							</div>
						</div>
						<UButton
							as="a"
							href="/logout"
							variant="outline"
							class="w-full"
						>
							Sign Out
						</UButton>
					</div>
				</div>
			</USheetContent>
		</USheet>
	</div>
</template>

<script setup lang="ts">
// Auth composable
const user = useSupabaseUser();

// Side panel state
const sidePanelOpen = ref(false);

const toggleSidePanel = () => {
	sidePanelOpen.value = !sidePanelOpen.value;
};
</script>
