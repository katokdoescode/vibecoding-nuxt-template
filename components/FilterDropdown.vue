<template>
	<div class="relative">
		<UButton
			variant="outline"
			class="w-full justify-between text-left font-normal"
			:aria-expanded="isOpen"
			:aria-haspopup="true"
			:aria-labelledby="props.ariaLabelledby"
			:aria-describedby="props.ariaDescribedby"
			:aria-controls="props.ariaControls"
			:aria-label="`${props.label} filter. ${displayText}. Click to ${isOpen ? 'close' : 'open'} dropdown.`"
			role="combobox"
			@click="isOpen = !isOpen"
		>
			<div class="flex items-center gap-2">
				<Icon
					:name="icon"
					class="h-4 w-4"
					aria-hidden="true"
				/>
				<span class="truncate">
					{{ displayText }}
				</span>
			</div>
			<Icon
				:name="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'"
				class="h-4 w-4 opacity-50"
				aria-hidden="true"
			/>
		</UButton>

		<!-- Dropdown Content -->
		<Transition
			name="dropdown"
			mode="out-in"
		>
			<div
				v-if="isOpen"
				:id="`${props.label.toLowerCase()}-dropdown`"
				class="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md p-2"
				role="listbox"
				:aria-labelledby="props.ariaLabelledby"
				aria-multiselectable="true"
			>
				<!-- Search Input -->
				<div class="mb-3">
					<div class="relative">
						<Icon
							name="lucide:search"
							class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<UInput
							v-model="searchQuery"
							:placeholder="`Search ${label.toLowerCase()}...`"
							class="pl-10"
							:aria-label="`Search ${props.label.toLowerCase()} options`"
							aria-describedby="search-help"
							role="searchbox"
						/>
						<div
							id="search-help"
							class="sr-only"
						>
							Type to filter the available {{ props.label.toLowerCase() }} options
						</div>
					</div>
				</div>

				<!-- Select All / Clear All -->
				<div
					class="flex justify-between mb-2 text-xs"
					role="group"
					aria-label="Bulk selection controls"
				>
					<button
						class="text-primary hover:underline motion-safe:transition-colors motion-reduce:transition-none"
						:disabled="filteredOptions.length === 0"
						:aria-label="`Select all ${filteredOptions.length} visible ${props.label.toLowerCase()} options`"
						@click="selectAll"
					>
						Select All ({{ filteredOptions.length }})
					</button>
					<button
						class="text-muted-foreground hover:text-foreground hover:underline motion-safe:transition-colors motion-reduce:transition-none"
						:disabled="selectedValues.length === 0"
						:aria-label="`Clear all ${props.selectedValues.length} selected ${props.label.toLowerCase()} options`"
						@click="clearAll"
					>
						Clear All
					</button>
				</div>

				<!-- Options List -->
				<div
					class="max-h-48 overflow-y-auto space-y-1"
					role="group"
					:aria-label="`${props.label} options list`"
				>
					<TransitionGroup
						name="option"
						tag="div"
					>
						<div
							v-for="option in filteredOptions"
							:key="option.value"
							class="flex items-center justify-between p-2 hover:bg-accent rounded-sm cursor-pointer motion-safe:transition-colors motion-reduce:transition-none"
							role="option"
							:aria-selected="selectedValues.includes(option.value)"
							:aria-label="`${option.label} (${option.count} cases). ${selectedValues.includes(option.value) ? 'Selected' : 'Not selected'}.`"
							tabindex="0"
							@click="toggleOption(option.value)"
							@keydown.enter="toggleOption(option.value)"
							@keydown.space.prevent="toggleOption(option.value)"
						>
							<div class="flex items-center gap-2 flex-1">
								<div class="relative">
									<input
										type="checkbox"
										:checked="selectedValues.includes(option.value)"
										class="h-4 w-4 rounded border motion-safe:transition-colors motion-reduce:transition-none"
										:aria-describedby="`${option.value}-description`"
										tabindex="-1"
										@click.stop="toggleOption(option.value)"
									>
								</div>
								<Icon
									v-if="option.icon"
									:name="option.icon"
									class="h-4 w-4"
									aria-hidden="true"
								/>
								<span class="text-sm">{{ option.label }}</span>
							</div>
							<UBadge
								variant="secondary"
								class="text-xs ml-2"
								:aria-label="`${option.count} cases`"
							>
								{{ option.count }}
							</UBadge>
							<div
								:id="`${option.value}-description`"
								class="sr-only"
							>
								{{ option.label }} filter option with {{ option.count }} matching cases
							</div>
						</div>
					</TransitionGroup>
				</div>

				<!-- No Results -->
				<Transition
					name="fade-simple"
					mode="out-in"
				>
					<div
						v-if="filteredOptions.length === 0"
						class="text-center text-muted-foreground text-sm py-6"
						role="status"
						aria-live="polite"
					>
						<Icon
							name="lucide:search-x"
							class="h-8 w-8 mx-auto mb-2 opacity-50"
							aria-hidden="true"
						/>
						No results found for "{{ searchQuery }}"
					</div>
				</Transition>
			</div>
		</Transition>

		<!-- Overlay to close dropdown -->
		<div
			v-if="isOpen"
			class="fixed inset-0 z-40"
			@click="isOpen = false"
		/>
	</div>
</template>

<script setup lang="ts">
export interface FilterOption {
	value: string;
	label: string;
	icon?: string;
	count: number;
}

interface Props {
	label: string;
	icon: string;
	options: FilterOption[];
	selectedValues: string[];
	placeholder?: string;
	// ARIA attributes
	ariaLabelledby?: string;
	ariaDescribedby?: string;
	ariaControls?: string;
}

interface Emits {
	(e: 'update:selectedValues', values: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: 'Select options...',
	ariaLabelledby: undefined,
	ariaDescribedby: undefined,
	ariaControls: undefined,
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const searchQuery = ref('');

// Computed
const displayText = computed(() => {
	if (props.selectedValues.length === 0) {
		return props.placeholder;
	}
	if (props.selectedValues.length === 1) {
		const option = props.options.find(opt => opt.value === props.selectedValues[0]);
		return option?.label || props.selectedValues[0];
	}
	return `${props.selectedValues.length} selected`;
});

const filteredOptions = computed(() => {
	if (!searchQuery.value) {
		return props.options;
	}
	const query = searchQuery.value.toLowerCase();
	return props.options.filter(option =>
		option.label.toLowerCase().includes(query)
		|| option.value.toLowerCase().includes(query),
	);
});

// Methods
const toggleOption = (value: string) => {
	const newValues = [...props.selectedValues];
	const index = newValues.indexOf(value);

	if (index === -1) {
		newValues.push(value);
	}
	else {
		newValues.splice(index, 1);
	}

	emit('update:selectedValues', newValues);
};

const selectAll = () => {
	const allValues = filteredOptions.value.map(option => option.value);
	const uniqueValues = [...new Set([...props.selectedValues, ...allValues])];
	emit('update:selectedValues', uniqueValues);
};

const clearAll = () => {
	emit('update:selectedValues', []);
};

// Close dropdown when clicking outside
onMounted(() => {
	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			isOpen.value = false;
		}
	};
	document.addEventListener('keydown', handleEscape);

	onUnmounted(() => {
		document.removeEventListener('keydown', handleEscape);
	});
});
</script>

<style scoped>
/* Transitions - only for users who don't prefer reduced motion */
@media (prefers-reduced-motion: no-preference) {
	/* Dropdown transition */
	.dropdown-enter-active,
	.dropdown-leave-active {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: top;
	}

	.dropdown-enter-from {
		opacity: 0;
		transform: scaleY(0.8) translateY(-10px);
	}

	.dropdown-leave-to {
		opacity: 0;
		transform: scaleY(0.8) translateY(-10px);
	}

	/* Option list transitions */
	.option-enter-active,
	.option-leave-active {
		transition: all 0.2s ease;
	}

	.option-enter-from {
		opacity: 0;
		transform: translateX(-10px);
	}

	.option-leave-to {
		opacity: 0;
		transform: translateX(10px);
	}

	.option-move {
		transition: transform 0.2s ease;
	}

	/* Simple fade transition */
	.fade-simple-enter-active,
	.fade-simple-leave-active {
		transition: all 0.2s ease;
	}

	.fade-simple-enter-from,
	.fade-simple-leave-to {
		opacity: 0;
		transform: translateY(5px);
	}
}

/* Reduced motion: instant transitions */
@media (prefers-reduced-motion: reduce) {
	.dropdown-enter-active,
	.dropdown-leave-active,
	.option-enter-active,
	.option-leave-active,
	.option-move,
	.fade-simple-enter-active,
	.fade-simple-leave-active {
		transition: none !important;
		animation: none !important;
	}

	.dropdown-enter-from,
	.dropdown-leave-to,
	.option-enter-from,
	.option-leave-to,
	.fade-simple-enter-from,
	.fade-simple-leave-to {
		opacity: 1;
		transform: none;
	}
}

/* Screen reader only class for accessibility */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
