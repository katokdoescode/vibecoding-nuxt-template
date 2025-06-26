<template>
	<div>
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold tracking-tight mb-4">
				Study Cases
			</h1>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
				Master your skills through interactive role-playing scenarios. Complete cases in order to unlock new challenges.
			</p>
		</div>

		<!-- Filters Section -->
		<div
			class="max-w-6xl mx-auto mb-8"
			role="region"
			aria-labelledby="filters-heading"
			aria-describedby="filters-description"
		>
			<div class="bg-card border rounded-lg p-4 space-y-4">
				<div class="flex items-center justify-between">
					<h3
						id="filters-heading"
						class="text-sm font-medium text-muted-foreground py-2"
					>
						Filters
					</h3>
					<UButton
						v-if="hasActiveFilters"
						variant="ghost"
						size="sm"
						class="text-xs"
						aria-label="Clear all active filters"
						:aria-describedby="hasActiveFilters ? 'active-filters-count' : undefined"
						@click="clearAllFilters"
					>
						<Icon
							name="lucide:x"
							class="h-3 w-3 mr-1"
							aria-hidden="true"
						/>
						Clear All
					</UButton>
				</div>

				<!-- Hidden description for screen readers -->
				<div
					id="filters-description"
					class="sr-only"
				>
					Use the following filters to narrow down the study cases displayed below. Changes will update the results immediately.
				</div>

				<!-- Active filters announcement for screen readers -->
				<div
					id="active-filters-count"
					class="sr-only"
					aria-live="polite"
				>
					{{ activeFiltersAnnouncement }}
				</div>

				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
					role="group"
					aria-label="Filter controls"
				>
					<!-- Tags Filter -->
					<div>
						<label
							id="tags-filter-label"
							class="text-xs font-medium text-muted-foreground mb-2 block"
						>
							Tags
						</label>
						<FilterDropdown
							v-model:selected-values="selectedTags"
							label="Tags"
							icon="lucide:tag"
							:options="tagOptions"
							placeholder="Select tags..."
							aria-labelledby="tags-filter-label"
							aria-describedby="tags-filter-help"
							aria-controls="cases-grid"
						/>
						<div
							id="tags-filter-help"
							class="sr-only"
						>
							Filter cases by topic tags. You can select multiple tags.
						</div>
					</div>

					<!-- Status Filter -->
					<div>
						<label
							id="status-filter-label"
							class="text-xs font-medium text-muted-foreground mb-2 block"
						>
							Status
						</label>
						<FilterDropdown
							v-model:selected-values="selectedStatuses"
							label="Status"
							icon="lucide:activity"
							:options="statusOptions"
							placeholder="Select statuses..."
							aria-labelledby="status-filter-label"
							aria-describedby="status-filter-help"
							aria-controls="cases-grid"
						/>
						<div
							id="status-filter-help"
							class="sr-only"
						>
							Filter cases by your progress status. You can select multiple statuses.
						</div>
					</div>

					<!-- Ownership Filter -->
					<div>
						<label
							id="ownership-filter-label"
							class="text-xs font-medium text-muted-foreground mb-2 block"
						>
							Ownership
						</label>
						<FilterDropdown
							v-model:selected-values="selectedOwnerships"
							label="Ownership"
							icon="lucide:users"
							:options="ownershipOptions"
							placeholder="Select ownership..."
							aria-labelledby="ownership-filter-label"
							aria-describedby="ownership-filter-help"
							aria-controls="cases-grid"
						/>
						<div
							id="ownership-filter-help"
							class="sr-only"
						>
							Filter cases by who created them - your own cases or public cases.
						</div>
					</div>

					<!-- Difficulty Filter -->
					<div>
						<label
							id="difficulty-filter-label"
							class="text-xs font-medium text-muted-foreground mb-2 block"
						>
							Difficulty
						</label>
						<FilterDropdown
							v-model:selected-values="selectedDifficulties"
							label="Difficulty"
							icon="lucide:trending-up"
							:options="difficultyOptions"
							placeholder="Select difficulty..."
							aria-labelledby="difficulty-filter-label"
							aria-describedby="difficulty-filter-help"
							aria-controls="cases-grid"
						/>
						<div
							id="difficulty-filter-help"
							class="sr-only"
						>
							Filter cases by difficulty level. You can select multiple difficulties.
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Cases Grid -->
		<TransitionGroup
			id="cases-grid"
			name="card"
			tag="div"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
			appear
			role="region"
			aria-labelledby="cases-heading"
			aria-describedby="cases-description"
			:aria-label="`Showing ${filteredCases.length} of ${orderedCases.length} study cases`"
		>
			<div
				v-for="(caseItem, index) in filteredCases"
				:key="caseItem.id || `placeholder-${index}`"
				class="relative"
				:aria-label="`Case ${index + 1} of ${filteredCases.length}`"
			>
				<!-- Available Case -->
				<CaseCard
					v-if="caseItem.id && caseItem.isAvailable"
					:case-item="caseItem"
					:index="index"
					:status="caseItem.status"
					:chat-id="caseItem.chatId"
					@tag-click="handleTagClick"
				/>

				<!-- Locked Case -->
				<LockedCaseCard
					v-else
					:index="index"
					:title="caseItem.title"
					:description="caseItem.description"
					:reason="caseItem.lockReason"
				/>
			</div>
		</TransitionGroup>

		<!-- No Results Message -->
		<Transition
			name="fade"
			mode="out-in"
		>
			<div
				v-if="filteredCases.length === 0 && !pending && !statusPending"
				class="text-center py-12"
				role="status"
				aria-live="polite"
				aria-label="No cases found message"
			>
				<Icon
					name="lucide:search-x"
					class="h-12 w-12 text-muted-foreground mx-auto mb-4"
					aria-hidden="true"
				/>
				<h3 class="text-lg font-medium mb-2">
					No cases found
				</h3>
				<p class="text-muted-foreground mb-4">
					Try adjusting your filters to see more results.
				</p>
				<UButton
					variant="outline"
					aria-label="Clear all filters to show all cases"
					@click="clearAllFilters"
				>
					Clear Filters
				</UButton>
			</div>
		</Transition>

		<!-- Loading State -->
		<div
			v-if="pending || statusPending"
			class="text-center py-12"
			role="status"
			aria-live="polite"
			aria-label="Loading cases"
		>
			<div class="inline-flex items-center space-x-2">
				<Icon
					name="lucide:refresh-cw"
					class="animate-spin h-5 w-5"
					aria-hidden="true"
				/>
				<span>
					{{ pending ? 'Loading cases...' : 'Loading your progress...' }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type Case, ChatStatus } from '~/server/types';
import CaseCard from '@/components/CaseCard.vue';
import LockedCaseCard from '@/components/LockedCaseCard.vue';
import FilterDropdown, { type FilterOption } from '@/components/FilterDropdown.vue';

interface CaseWithStatus extends Case {
	isAvailable: boolean;
	status?: ChatStatus;
	chatId?: number;
	lockReason?: string;
}

definePageMeta({
	layout: 'default',
});

// Filter state
const selectedTags = ref<string[]>([]);
const selectedStatuses = ref<string[]>([]);
const selectedOwnerships = ref<string[]>([]);
const selectedDifficulties = ref<string[]>([]);

// Fetch cases and user statuses
const { data: cases, pending } = await useAsyncData('cases', () => {
	return $fetch<Case[]>('/api/cases');
});

// Get current user for reactive status fetching
const user = useSupabaseUser();

// Utility function to categorize difficulty (matches CaseCard logic)
const categorizeDifficulty = (difficultyValue: number | null): string => {
	if (!difficultyValue) {
		return 'unknown';
	}
	else if (difficultyValue <= 2) {
		return 'beginner';
	}
	else if (difficultyValue <= 4) {
		return 'intermediate';
	}
	else {
		return 'advanced';
	}
};

const { data: caseStatuses, pending: statusPending, refresh: refreshStatuses } = await useAsyncData(
	'user-case-statuses',
	async () => {
		// Wait for user authentication to be resolved
		if (!user.value) {
			return null;
		}

		try {
			return await $fetch<Record<string, { status: ChatStatus; chatId: number }>>('/api/user-case-statuses');
		}
		catch (error) {
			// Extract only serializable properties from error for logging
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.warn('Failed to fetch user case statuses:', { message: errorMessage });
			return null;
		}
	},
	{
		default: () => ({} as Record<string, { status: ChatStatus; chatId: number }>),
		server: true,
	},
);

// Ensure data is fetched when component mounts if user is already authenticated
onMounted(() => {
	if (user.value) {
		refreshStatuses();
	}
});

// Watch for authentication changes and refresh status data
watch(user, async (newUser, oldUser) => {
	// Only refresh if user just became authenticated (avoid infinite loops)
	if (newUser && !oldUser) {
		await nextTick();
		refreshStatuses();
	}
}, { immediate: false });

// Create ordered cases array (9 total, with dependencies resolved)
const orderedCases = computed(() => {
	const result: CaseWithStatus[] = [];
	const caseMap: Record<string, Case> = {};
	const statusMap: Record<string, { status: ChatStatus; chatId: number }> = caseStatuses.value || {};

	// Create map of available cases
	if (cases.value) {
		cases.value.forEach(c => caseMap[c.id] = c);
	}

	// Find root cases (no dependencies)
	const rootCases = cases.value?.filter(c => !c.can_be_done_after) || [];
	const processedIds: Record<string, boolean> = {};

	// Helper function to check if a case has been completed (assessed)
	const isCaseCompleted = (status?: ChatStatus): boolean => {
		if (!status) return false;
		return [ChatStatus.SUBMITTED, ChatStatus.PASSED, ChatStatus.CAN_BE_IMPROVED, ChatStatus.NOT_PASSED].includes(status);
	};

	// Add cases in dependency order
	const addCaseAndDependents = (caseItem: Case, canAccess: boolean = true) => {
		if (processedIds[caseItem.id]) return;
		const userStatus = statusMap[caseItem.id];
		const isCompleted = isCaseCompleted(userStatus?.status);

		// Determine if case is available
		const isAvailable = canAccess;
		let lockReason = '';

		if (!canAccess) {
			lockReason = 'Complete previous cases first';
		}

		result.push({
			...caseItem,
			isAvailable,
			status: userStatus?.status,
			chatId: userStatus?.chatId,
			lockReason,
		});
		processedIds[caseItem.id] = true;

		// Find dependent cases - they can only be accessed if current case is completed (assessed)
		const dependents = cases.value?.filter(c => c.can_be_done_after === caseItem.id) || [];
		dependents.forEach((dependent) => {
			addCaseAndDependents(dependent, isCompleted);
		});
	};

	// Process root cases first (always available)
	rootCases.forEach(caseItem => addCaseAndDependents(caseItem, true));

	return result;
});

// Computed properties for filter options
const tagOptions = computed<FilterOption[]>(() => {
	const tagCounts = new Map<string, number>();

	orderedCases.value.forEach((caseItem) => {
		if (caseItem.tags) {
			caseItem.tags.forEach((tag) => {
				tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
			});
		}
	});

	return Array.from(tagCounts.entries())
		.map(([tag, count]) => ({
			value: tag,
			label: tag,
			icon: 'lucide:tag',
			count,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
});

const statusOptions = computed<FilterOption[]>(() => {
	const statusDefinitions = [
		{ value: 'not_started', label: 'Not Started', icon: 'lucide:circle' },
		{ value: 'created', label: 'Started', icon: 'lucide:play-circle' },
		{ value: 'in progress', label: 'In Progress', icon: 'lucide:clock' },
		{ value: 'submitted', label: 'Completed', icon: 'lucide:check-circle' },
		{ value: 'passed', label: 'Passed', icon: 'lucide:check-circle-2' },
		{ value: 'can_be_improved', label: 'Can be improved', icon: 'lucide:circle-alert' },
		{ value: 'not_passed', label: 'Not passed', icon: 'lucide:x-circle' },
	];

	return statusDefinitions.map(status => ({
		...status,
		count: getStatusCount(status.value),
	})).filter(status => status.count > 0);
});

const ownershipOptions = computed<FilterOption[]>(() => {
	const ownershipDefinitions = [
		{ value: 'mine', label: 'My Cases', icon: 'lucide:user' },
		{ value: 'public', label: 'Public Cases', icon: 'lucide:globe' },
	];

	return ownershipDefinitions.map(ownership => ({
		...ownership,
		count: getOwnershipCount(ownership.value),
	})).filter(ownership => ownership.count > 0);
});

const difficultyOptions = computed<FilterOption[]>(() => {
	const difficultyDefinitions = [
		{ value: 'beginner', label: 'Beginner', icon: 'lucide:circle' },
		{ value: 'intermediate', label: 'Intermediate', icon: 'lucide:circle-dot' },
		{ value: 'advanced', label: 'Advanced', icon: 'lucide:target' },
		{ value: 'unknown', label: 'Unknown', icon: 'lucide:help-circle' },
	];

	return difficultyDefinitions.map(difficulty => ({
		value: difficulty.value,
		label: difficulty.label,
		icon: difficulty.icon,
		count: getDifficultyCount(difficulty.value),
	})).filter(difficulty => difficulty.count > 0);
});

// Filter functions
const clearAllFilters = () => {
	selectedTags.value = [];
	selectedStatuses.value = [];
	selectedOwnerships.value = [];
	selectedDifficulties.value = [];
};

const hasActiveFilters = computed(() => {
	return selectedTags.value.length > 0
		|| selectedStatuses.value.length > 0
		|| selectedOwnerships.value.length > 0
		|| selectedDifficulties.value.length > 0;
});

// ARIA announcements for screen readers
const activeFiltersAnnouncement = computed(() => {
	const parts = [];
	if (selectedTags.value.length > 0) {
		parts.push(`${selectedTags.value.length} tag${selectedTags.value.length === 1 ? '' : 's'} selected`);
	}
	if (selectedStatuses.value.length > 0) {
		parts.push(`${selectedStatuses.value.length} status${selectedStatuses.value.length === 1 ? '' : 'es'} selected`);
	}
	if (selectedOwnerships.value.length > 0) {
		parts.push(`${selectedOwnerships.value.length} ownership filter${selectedOwnerships.value.length === 1 ? '' : 's'} selected`);
	}
	if (selectedDifficulties.value.length > 0) {
		parts.push(`${selectedDifficulties.value.length} difficulty${selectedDifficulties.value.length === 1 ? '' : 'es'} selected`);
	}

	if (parts.length === 0) {
		return 'No filters active';
	}

	return `Active filters: ${parts.join(', ')}`;
});

// Handle tag click from CaseCard
const handleTagClick = (tag: string) => {
	if (!selectedTags.value.includes(tag)) {
		selectedTags.value.push(tag);
	}
};

// Filtered cases
const filteredCases = computed(() => {
	let filtered = orderedCases.value;

	// Filter by tags
	if (selectedTags.value.length > 0) {
		filtered = filtered.filter(caseItem =>
			caseItem.tags
			&& selectedTags.value.some(tag => caseItem.tags!.includes(tag)),
		);
	}

	// Filter by status
	if (selectedStatuses.value.length > 0) {
		filtered = filtered.filter((caseItem) => {
			const status = caseItem.status || 'not_started';
			return selectedStatuses.value.includes(status);
		});
	}

	// Filter by ownership
	if (selectedOwnerships.value.length > 0) {
		filtered = filtered.filter((caseItem) => {
			const isPublic = caseItem.is_public;
			const isUserOwned = user.value && caseItem.user_id === user.value.id;

			return selectedOwnerships.value.some((ownership) => {
				if (ownership === 'public' && isPublic) return true;
				if (ownership === 'mine' && isUserOwned) return true;
				return false;
			});
		});
	}

	// Filter by difficulty
	if (selectedDifficulties.value.length > 0) {
		filtered = filtered.filter((caseItem) => {
			const difficultyCategory = categorizeDifficulty(caseItem.difficulty);
			return selectedDifficulties.value.includes(difficultyCategory);
		});
	}

	return filtered;
});

// Count functions for filter badges
const getStatusCount = (status: string) => {
	return orderedCases.value.filter((caseItem) => {
		const caseStatus = caseItem.status || 'not_started';
		return caseStatus === status;
	}).length;
};

const getOwnershipCount = (ownership: string) => {
	return orderedCases.value.filter((caseItem) => {
		const isPublic = caseItem.is_public;
		const isUserOwned = user.value && caseItem.user_id === user.value.id;

		if (ownership === 'public' && isPublic) return true;
		if (ownership === 'mine' && isUserOwned) return true;
		return false;
	}).length;
};

const getDifficultyCount = (difficulty: string) => {
	return orderedCases.value.filter((caseItem) => {
		const difficultyCategory = categorizeDifficulty(caseItem.difficulty);
		return difficultyCategory === difficulty;
	}).length;
};
</script>

<style scoped>
/* Card transition animations - only for users who don't prefer reduced motion */
@media (prefers-reduced-motion: no-preference) {
	.card-enter-active,
	.card-leave-active {
		transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.card-enter-from {
		opacity: 0;
		transform: scale(0.9) translateY(20px);
	}

	.card-leave-to {
		opacity: 0;
		transform: scale(0.9) translateY(-20px);
	}

	.card-move {
		transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	/* Stagger animation for initial load */
	.card-enter-active:nth-child(1) { transition-delay: 0ms; }
	.card-enter-active:nth-child(2) { transition-delay: 50ms; }
	.card-enter-active:nth-child(3) { transition-delay: 100ms; }
	.card-enter-active:nth-child(4) { transition-delay: 150ms; }
	.card-enter-active:nth-child(5) { transition-delay: 200ms; }
	.card-enter-active:nth-child(6) { transition-delay: 250ms; }
	.card-enter-active:nth-child(7) { transition-delay: 300ms; }
	.card-enter-active:nth-child(8) { transition-delay: 350ms; }
	.card-enter-active:nth-child(9) { transition-delay: 400ms; }

	/* Loading state transition */
	.card-enter-active.appear-active {
		transition-delay: calc(var(--i, 0) * 50ms);
	}

	/* Fade transition for no results message */
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.3s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: translateY(10px);
	}
}

/* Reduced motion: instant transitions */
@media (prefers-reduced-motion: reduce) {
	.card-enter-active,
	.card-leave-active,
	.card-move,
	.fade-enter-active,
	.fade-leave-active {
		transition: none !important;
		animation: none !important;
	}

	.card-enter-from,
	.card-leave-to,
	.fade-enter-from,
	.fade-leave-to {
		opacity: 1;
		transform: none;
	}
}
</style>
