<template>
	<Card class="h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border hover:border-primary/30 group cursor-pointer relative">
		<CardHeader class="pb-3">
			<div class="flex items-start justify-between mb-3">
				<Badge
					:variant="getDifficultyVariant(caseItem.dificulty)"
					class="text-xs font-medium"
				>
					{{ getDifficultyLabel(caseItem.dificulty) }}
				</Badge>
				<span class="text-xs text-muted-foreground font-medium">
					{{ index + 1 }}/9
				</span>
			</div>
			<CardTitle class="text-lg font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
				{{ caseItem.title }}
			</CardTitle>
			<CardDescription class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
				{{ caseItem.description }}
				<NuxtLink
					:to="`/cases/${caseItem.id}`"
					class="absolute inset-0"
					:aria-label="`View case ${caseItem.title}`"
				/>
			</CardDescription>
		</CardHeader>
		<CardFooter class="pt-0 mt-auto">
			<div class="flex items-center text-xs text-muted-foreground">
				<svg
					aria-hidden="true"
					class="h-3 w-3 mr-1.5 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span class="font-medium">Est. 30-45 min</span>
			</div>
		</CardFooter>
	</Card>
</template>

<script setup lang="ts">
import type { Case } from '~/server/types';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
