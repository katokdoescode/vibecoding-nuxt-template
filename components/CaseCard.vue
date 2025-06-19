<template>
	<UCard class="h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border hover:border-primary/30 group cursor-pointer relative">
		<UCardHeader class="pb-3">
			<div class="flex items-start justify-between mb-3">
				<UBadge
					:variant="getDifficultyVariant(caseItem.difficulty)"
					class="text-xs font-medium"
				>
					{{ getDifficultyLabel(caseItem.difficulty) }}
				</UBadge>
				<span class="text-xs text-muted-foreground font-medium">
					{{ index + 1 }}/9
				</span>
			</div>
			<UCardTitle class="text-lg font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
				{{ caseItem.title }}
			</UCardTitle>
			<UCardDescription class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
				{{ caseItem.description }}
				<NuxtLink
					:to="`/cases/${caseItem.slug}`"
					class="absolute inset-0"
					:aria-label="`View case ${caseItem.title}`"
				/>
			</UCardDescription>
		</UCardHeader>
		<UCardFooter class="pt-0 mt-auto">
			<div class="flex items-center text-xs text-muted-foreground">
				<Icon
					name="lucide:clock"
					aria-hidden="true"
					class="h-3 w-3 mr-1.5 flex-shrink-0"
				/>
				<span class="font-medium">Est. 30-45 min</span>
			</div>
		</UCardFooter>
	</UCard>
</template>

<script setup lang="ts">
import type { Case } from '~/server/types';

interface Props {
	caseItem: Case;
	index: number;
}

defineProps<Props>();

// Utility functions
const getDifficultyVariant = (difficulty: number | null) => {
	if (!difficulty) return 'secondary';
	if (difficulty <= 2) return 'default';
	if (difficulty <= 4) return 'secondary';
	return 'destructive';
};

const getDifficultyLabel = (difficulty: number | null) => {
	if (!difficulty) return 'Unknown';
	if (difficulty <= 2) return 'Beginner';
	if (difficulty <= 4) return 'Intermediate';
	return 'Advanced';
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
