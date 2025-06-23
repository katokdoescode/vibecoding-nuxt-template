<template>
	<div class="space-y-4">
		<!-- Loading State -->
		<div
			v-if="pending"
			class="text-center py-8"
		>
			<Icon
				name="lucide:refresh-cw"
				class="animate-spin h-5 w-5 mx-auto mb-2"
			/>
			<p class="text-sm text-muted-foreground">
				Loading chat history...
			</p>
		</div>

		<!-- No History -->
		<div
			v-else-if="!chatHistory || chatHistory.length === 0"
			class="text-center py-8"
		>
			<Icon
				name="lucide:message-circle"
				class="h-12 w-12 mx-auto mb-4 text-muted-foreground"
			/>
			<p class="text-muted-foreground">
				No chat history found for this case.
			</p>
		</div>

		<!-- Chat History List -->
		<div
			v-else
			class="space-y-3"
		>
			<div
				v-for="(chatItem, index) in chatHistory"
				:key="chatItem.id"
				class="border rounded-lg overflow-hidden"
			>
				<!-- Chat Summary Header -->
				<div
					class="p-4 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
					@click="toggleChatExpansion(chatItem.id)"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="flex items-center gap-2">
								<UBadge
									:variant="getStatusVariant(chatItem.status)"
									class="text-xs"
								>
									{{ getStatusLabel(chatItem.status) }}
								</UBadge>
								<UBadge
									v-if="chatItem.id === currentChatId"
									variant="default"
									class="text-xs"
								>
									Current
								</UBadge>
							</div>
							<div class="text-sm">
								<div class="font-medium">
									Chat #{{ chatHistory.length - index }}
								</div>
								<div class="text-muted-foreground">
									{{ formatDate(chatItem.created_at) }}
								</div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground">
								{{ (chatItem.messages as Message[])?.length || 0 }} messages
							</span>
							<Icon
								name="lucide:chevron-down"
								class="h-4 w-4 transition-transform"
								:class="expandedChats.has(chatItem.id) ? 'rotate-180' : ''"
							/>
						</div>
					</div>
				</div>

				<!-- Expanded Chat Details -->
				<div
					v-if="expandedChats.has(chatItem.id)"
					class="border-t"
				>
					<!-- Messages -->
					<div class="p-4 max-h-96 overflow-y-auto space-y-3">
						<div
							v-if="!(chatItem.messages as Message[])?.length"
							class="text-center text-muted-foreground py-4"
						>
							No messages in this chat
						</div>
						<div
							v-for="(message, msgIndex) in (chatItem.messages as Message[])"
							:key="msgIndex"
							class="flex"
							:class="message.type === 'user' ? 'justify-end' : 'justify-start'"
						>
							<div class="max-w-[80%]">
								<div
									class="rounded-lg px-3 py-2 text-sm"
									:class="message.type === 'user'
										? 'bg-primary text-primary-foreground'
										: 'bg-muted'"
								>
									{{ message.text }}
								</div>
								<div
									class="text-xs text-muted-foreground mt-1"
									:class="message.type === 'user' ? 'text-right' : 'text-left'"
								>
									{{ formatTime(message.timestamp) }}
								</div>
							</div>
						</div>
					</div>

					<!-- Assessment Results -->
					<div
						v-if="chatItem.learning_outcomes"
						class="border-t p-4 bg-muted/10"
					>
						<h4 class="font-semibold mb-2 flex items-center">
							<Icon
								name="lucide:graduation-cap"
								class="h-4 w-4 mr-2"
							/>
							Assessment Results
						</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<span class="font-medium">Score:</span>
								<span
									class="ml-2"
									:class="getScoreColor((chatItem.learning_outcomes as LearningOutcomes).assessment_percentage)"
								>
									{{ (chatItem.learning_outcomes as LearningOutcomes).assessment_percentage }}%
								</span>
							</div>
							<div>
								<span class="font-medium">Status:</span>
								<span class="ml-2">{{ getStatusLabel(chatItem.status) }}</span>
							</div>
						</div>
						<UButton
							variant="outline"
							size="sm"
							class="mt-3"
							@click="showLearningOutcomes(chatItem.learning_outcomes as LearningOutcomes)"
						>
							<Icon
								name="lucide:eye"
								class="mr-2 h-3 w-3"
							/>
							View Full Assessment
						</UButton>
					</div>
				</div>
			</div>
		</div>

		<!-- Learning Outcomes Modal -->
		<UDialog v-model:open="showLearningModal">
			<UDialogContent class="lg:max-w-[90vw] lg:w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
				<UDialogHeader>
					<UDialogTitle>Learning Outcomes Assessment</UDialogTitle>
					<UDialogDescription>
						Assessment results from previous chat session.
					</UDialogDescription>
				</UDialogHeader>

				<div class="flex-1 overflow-y-auto p-1">
					<LearningOutcomes
						v-if="selectedLearningOutcomes"
						:learning-outcomes="selectedLearningOutcomes"
					/>
				</div>

				<div class="flex justify-end gap-2 pt-4 border-t">
					<UButton
						variant="outline"
						@click="showLearningModal = false"
					>
						Close
					</UButton>
				</div>
			</UDialogContent>
		</UDialog>
	</div>
</template>

<script setup lang="ts">
import type { Chat, Message, LearningOutcomes } from '~/server/types';

interface Props {
	caseId: string;
	currentChatId?: number;
}

const props = defineProps<Props>();

// Reactive state
const expandedChats = ref(new Set<number>());
const showLearningModal = ref(false);
const selectedLearningOutcomes = ref<LearningOutcomes | null>(null);

// Fetch chat history
const { data: chatHistory, pending } = await useFetch<Chat[]>('/api/chats/case-history', {
	query: { case_id: props.caseId },
	server: false,
});

// Toggle chat expansion
function toggleChatExpansion(chatId: number) {
	if (expandedChats.value.has(chatId)) {
		expandedChats.value.delete(chatId);
	}
	else {
		expandedChats.value.add(chatId);
	}
}

// Show learning outcomes modal
function showLearningOutcomes(outcomes: LearningOutcomes) {
	selectedLearningOutcomes.value = outcomes;
	showLearningModal.value = true;
}

// Utility functions
function getStatusVariant(status: string) {
	switch (status) {
		case 'created': return 'outline';
		case 'in progress': return 'default';
		case 'submitted': return 'secondary';
		case 'passed': return 'default';
		case 'can_be_improved': return 'secondary';
		case 'not_passed': return 'destructive';
		default: return 'outline';
	}
}

function getStatusLabel(status: string) {
	switch (status) {
		case 'created': return 'Started';
		case 'in progress': return 'In Progress';
		case 'submitted': return 'Submitted';
		case 'passed': return 'Passed';
		case 'can_be_improved': return 'Can Be Improved';
		case 'not_passed': return 'Not Passed';
		default: return status;
	}
}

function getScoreColor(score: number): string {
	if (score >= 80) return 'text-green-600 dark:text-green-400';
	if (score >= 60) return 'text-blue-600 dark:text-blue-400';
	if (score >= 40) return 'text-orange-600 dark:text-orange-400';
	return 'text-red-600 dark:text-red-400';
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString([], {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

function formatTime(timestamp: string): string {
	if (!timestamp) return '';
	return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
