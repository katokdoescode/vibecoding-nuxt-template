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
				/>

				<!-- Locked Case -->
				<LockedCaseCard
					v-else
					:index="index"
					:title="caseItem.title"
					:description="caseItem.description"
				/>
			</div>
		</div>

		<!-- Loading State -->
		<div
			v-if="pending"
			class="text-center py-12"
		>
			<div class="inline-flex items-center space-x-2">
				<Icon
					name="lucide:refresh-cw"
					class="animate-spin h-5 w-5"
				/>
				<span>Loading cases...</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Case } from '~/server/types';
import CaseCard from '@/components/CaseCard.vue';
import LockedCaseCard from '@/components/LockedCaseCard.vue';

definePageMeta({
	layout: 'default',
});

// Fetch cases
const { data: cases, pending } = await useAsyncData('cases', () => {
	return $fetch<Case[]>('/api/cases');
});

// Create ordered cases array (9 total, with dependencies resolved)
const orderedCases = computed(() => {
	const result: Array<Case & { isAvailable: boolean }> = [];
	const caseMap = new Map<string, Case>();

	// Create map of available cases
	if (cases.value) {
		cases.value.forEach(c => caseMap.set(c.id, c));
	}

	// Find root cases (no dependencies)
	const rootCases = cases.value?.filter(c => !c.can_be_done_after) || [];
	const processedIds = new Set<string>();

	// Add cases in dependency order
	const addCaseAndDependents = (caseItem: Case) => {
		if (processedIds.has(caseItem.id)) return;

		result.push({ ...caseItem, isAvailable: true });
		processedIds.add(caseItem.id);

		// Find dependent cases
		const dependents = cases.value?.filter(c => c.can_be_done_after === caseItem.id) || [];
		dependents.forEach(addCaseAndDependents);
	};

	// Process root cases first
	rootCases.forEach(addCaseAndDependents);

	// Fill remaining slots with placeholder locked cases
	while (result.length < 9) {
		result.push({
			id: '',
			title: null,
			description: null,
			difficulty: null,
			can_be_done_after: null,
			agent: null,
			story: null,
			criteria_outcomes: null,
			created_at: '',
			isAvailable: false,
		});
	}

	return result.slice(0, 9);
});
</script>
