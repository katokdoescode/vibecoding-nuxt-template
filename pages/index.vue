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

		<!-- Cases Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
			<div
				v-for="(caseItem, index) in orderedCases"
				:key="caseItem.id || `placeholder-${index}`"
				class="relative"
			>
				<!-- Available Case -->
				<CaseCard
					v-if="caseItem.id && caseItem.isAvailable"
					:case-item="caseItem"
					:index="index"
					:status="caseItem.status"
					:chat-id="caseItem.chatId"
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
		</div>

		<!-- Loading State -->
		<div
			v-if="pending || statusPending"
			class="text-center py-12"
		>
			<div class="inline-flex items-center space-x-2">
				<Icon
					name="lucide:refresh-cw"
					class="animate-spin h-5 w-5"
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

interface CaseWithStatus extends Case {
	isAvailable: boolean;
	status?: ChatStatus;
	chatId?: number;
	lockReason?: string;
}

definePageMeta({
	layout: 'default',
});

// Fetch cases and user statuses
const { data: cases, pending } = await useAsyncData('cases', () => {
	return $fetch<Case[]>('/api/cases');
});

// Get current user for reactive status fetching
const user = useSupabaseUser();

const { data: caseStatuses, pending: statusPending, refresh: refreshStatuses } = await useLazyAsyncData(
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
			console.warn('Failed to fetch user case statuses:', error);
			return null;
		}
	},
	{
		default: () => ({} as Record<string, { status: ChatStatus; chatId: number }>),
		server: false,
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
	const caseMap = new Map<string, Case>();
	const statusMap = new Map(Object.entries(caseStatuses.value || {}));

	// Create map of available cases
	if (cases.value) {
		cases.value.forEach(c => caseMap.set(c.id, c));
	}

	// Find root cases (no dependencies)
	const rootCases = cases.value?.filter(c => !c.can_be_done_after) || [];
	const processedIds = new Set<string>();

	// Helper function to check if a case has been completed (assessed)
	const isCaseCompleted = (status?: ChatStatus): boolean => {
		if (!status) return false;
		return [ChatStatus.SUBMITTED, ChatStatus.PASSED, ChatStatus.CAN_BE_IMPROVED, ChatStatus.NOT_PASSED].includes(status);
	};

	// Add cases in dependency order
	const addCaseAndDependents = (caseItem: Case, canAccess: boolean = true) => {
		if (processedIds.has(caseItem.id)) return;
		const userStatus = statusMap.get(caseItem.id);
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
		processedIds.add(caseItem.id);

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
</script>
