<template>
	<div>
		<!-- Side Panel Toggle Button -->
		<Button
			variant="outline"
			size="icon"
			class="fixed top-4 right-4 z-50"
			@click="toggleSidePanel"
		>
			<Icon
				name="lucide:menu"
				class="h-4 w-4"
			/>
		</Button>

		<!-- Collapsible Side Panel -->
		<Sheet v-model:open="sidePanelOpen">
			<SheetContent
				side="right"
				class="w-80 px-4"
			>
				<SheetHeader>
					<SheetTitle>Actions</SheetTitle>
				</SheetHeader>
				<div class="mt-6 space-y-4">
					<div v-if="!user">
						<Button
							as="a"
							href="/login"
							class="w-full"
						>
							Login
						</Button>
					</div>
					<div
						v-else
						class="space-y-4"
					>
						<div class="flex items-center space-x-3">
							<Avatar class="h-8 w-8">
								<AvatarFallback>
									{{ user.email?.charAt(0).toUpperCase() }}
								</AvatarFallback>
							</Avatar>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate">
									{{ user.email }}
								</p>
							</div>
						</div>
						<Button
							as="a"
							href="/logout"
							variant="outline"
							class="w-full"
						>
							Sign Out
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	</div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

// Auth composable
const user = useSupabaseUser();

// Side panel state
const sidePanelOpen = ref(false);

const toggleSidePanel = () => {
	sidePanelOpen.value = !sidePanelOpen.value;
};
</script>
