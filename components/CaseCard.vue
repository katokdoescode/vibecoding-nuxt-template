<template>
	<UCard class="h-full flex flex-col motion-safe:transition-all motion-safe:duration-200 motion-reduce:transition-none hover:shadow-lg hover:shadow-primary/5 border hover:border-primary/30 group cursor-pointer relative">
		<UCardHeader class="pb-3">
			<div class="flex items-start justify-between mb-3">
				<div class="flex items-center gap-2">
					<UBadge
						:variant="getDifficultyVariant(caseItem.difficulty)"
						class="text-xs font-medium"
					>
						{{ getDifficultyLabel(caseItem.difficulty) }}
					</UBadge>
					<UBadge
						v-if="status"
						:variant="getStatusVariant(status)"
						class="text-xs font-medium"
					>
						{{ getStatusLabel(status) }}
					</UBadge>
				</div>
				<span class="text-xs text-muted-foreground font-medium">
					{{ index + 1 }}/9
				</span>
			</div>
			<UCardTitle class="text-lg font-semibold leading-tight mb-2 group-hover:text-primary motion-safe:transition-colors motion-reduce:transition-none flex items-center gap-2">
				<Icon
					v-if="status === 'submitted'"
					name="lucide:check-circle"
					class="h-4 w-4 text-green-500 flex-shrink-0"
					aria-hidden="true"
				/>
				<Icon
					v-else-if="status === 'in progress'"
					name="lucide:clock"
					class="h-4 w-4 text-blue-500 flex-shrink-0"
					aria-hidden="true"
				/>
				<Icon
					v-else-if="status === 'created'"
					name="lucide:play-circle"
					class="h-4 w-4 text-orange-500 flex-shrink-0"
					aria-hidden="true"
				/>
				<span>{{ caseItem.title }}</span>
			</UCardTitle>
			<UCardDescription class="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
				{{ caseItem.description }}
			</UCardDescription>

			<!-- Tags Section -->
			<div
				v-if="caseItem.tags && caseItem.tags.length > 0"
				class="flex flex-wrap gap-1.5 mb-2"
			>
				<UBadge
					v-for="tag in caseItem.tags"
					:key="tag"
					variant="outline"
					class="text-xs px-2 py-0.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 motion-safe:transition-colors motion-reduce:transition-none relative z-10"
					@click.stop.prevent="$emit('tag-click', tag)"
				>
					<Icon
						name="lucide:tag"
						class="h-3 w-3 mr-1"
						aria-hidden="true"
					/>
					{{ tag }}
				</UBadge>
			</div>

			<NuxtLink
				:to="`/cases/${caseItem.slug}`"
				class="absolute inset-0"
				:aria-label="`View case ${caseItem.title}`"
			/>
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
					v-if="status"
					class="text-xs font-medium"
				>
					{{ getStatusDescription(status) }}
				</div>
			</div>
		</UCardFooter>
	</UCard>
</template>

<script setup lang="ts">
import type { Case } from '~/server/types';

interface Props {
	caseItem: Case;
	index: number;
	status?: string;
	chatId?: number;
}

interface Emits {
	(e: 'tag-click', tag: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

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

const getStatusVariant = (status: string) => {
	switch (status) {
		case 'created': return 'outline';
		case 'in progress': return 'default';
		case 'submitted': return 'secondary';
		case 'passed': return 'default';
		case 'can_be_improved': return 'secondary';
		case 'not_passed': return 'destructive';
		default: return 'outline';
	}
};

const getStatusLabel = (status: string) => {
	switch (status) {
		case 'created': return 'Started';
		case 'in progress': return 'In Progress';
		case 'submitted': return 'Completed';
		case 'passed': return 'Passed';
		case 'can_be_improved': return 'Can be improved';
		case 'not_passed': return 'Not passed';
		default: return 'Not Started';
	}
};

const getStatusDescription = (status: string) => {
	switch (status) {
		case 'created': return 'Chat created';
		case 'in progress': return 'Active';
		case 'submitted': return 'Submitted';
		case 'passed': return 'Passed';
		case 'can_be_improved': return 'Can be improved';
		case 'not_passed': return 'Not passed';
		default: return 'Ready to start';
	}
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
