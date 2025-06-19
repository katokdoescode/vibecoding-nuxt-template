<template>
	<UCard class="h-full flex flex-col opacity-60 border-dashed">
		<UCardHeader class="pb-3">
			<div class="flex items-start justify-between mb-3">
				<UBadge
					variant="outline"
					class="text-xs font-medium"
				>
					Locked
				</UBadge>
				<span class="text-xs text-muted-foreground font-medium">
					{{ index + 1 }}/9
				</span>
			</div>
			<UCardTitle class="text-lg font-semibold leading-tight mb-2 text-muted-foreground flex items-center gap-2">
				<Icon
					name="lucide:lock"
					class="h-4 w-4 flex-shrink-0"
					aria-hidden="true"
				/>
				<span>{{ title || 'Locked Case' }}</span>
			</UCardTitle>
			<UCardDescription class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
				{{ description || 'This case will be unlocked when you complete the required prerequisites.' }}
			</UCardDescription>
		</UCardHeader>
		<UCardFooter class="pt-0 mt-auto">
			<div class="flex items-center justify-between w-full text-xs text-muted-foreground">
				<div class="flex items-center">
					<Icon
						name="lucide:clock"
						aria-hidden="true"
						class="h-3 w-3 mr-1.5 flex-shrink-0"
					/>
					<span class="font-medium">Est. 30-45 min</span>
				</div>
				<div
					v-if="reason"
					class="text-xs font-medium"
				>
					{{ reason }}
				</div>
			</div>
		</UCardFooter>
	</UCard>
</template>

<script setup lang="ts">
interface Props {
	index: number;
	title?: string | null;
	description?: string | null;
	reason?: string;
}

withDefaults(defineProps<Props>(), {
	title: null,
	description: null,
	reason: 'Complete previous cases first',
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
