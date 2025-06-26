<template>
	<div class="bg-background h-full flex flex-col">
		<!-- Header with back button -->
		<div class="flex-shrink-0 p-4 pb-6">
			<div class="flex items-center gap-2">
				<NuxtLink
					variant="outline"
					size="sm"
					href="/"
				>
					<Icon name="lucide:arrow-left" />
					Back to cases
				</NuxtLink>
			</div>
		</div>

		<!-- Loading state -->
		<div
			v-if="pending"
			class="flex-1 flex items-center justify-center"
		>
			<div class="text-lg">
				Loading case...
			</div>
		</div>

		<!-- Error state -->
		<div
			v-else-if="error"
			class="flex-1 p-4"
		>
			<UAlert
				variant="destructive"
				icon="lucide:alert-triangle"
			>
				<UAlertTitle>
					Failed to load case
				</UAlertTitle>
				<UAlertDescription>
					{{ error?.statusMessage || 'Failed to load case' }}
				</UAlertDescription>
			</UAlert>
		</div>

		<!-- Main content -->
		<div
			v-else-if="studyCase && !error"
			class="flex-1 flex flex-col lg:overflow-hidden overflow-y-auto px-4 pb-2"
		>
			<!-- Case Story and Chat - Full height layout -->
			<div class="flex-1 flex flex-col lg:flex-row lg:gap-2 h-full lg:overflow-hidden overflow-y-auto">
				<!-- Left side: Case story -->
				<div class="flex-1 flex flex-col h-full msx-lg:max-h-[70vh]">
					<div class="h-full py-6 flex flex-col">
						<CaseStory
							v-if="chat || !user"
							:study-case="studyCase"
							:disabled="isAssessed"
							:is-submitting="isSubmitting"
							:submit-text="getSubmitButtonText(chat?.status)"
							:can-be-submitted="canBeSubmitted"
							@submit="submitChat"
						>
							<!-- Case Actions -->
							<template #actions>
								<div
									v-if="shouldShowActions"
									class="pt-4 border-t border-border mt-4 space-y-3"
								>
									<!-- Learning Outcomes Button (for completed chats) -->
									<UButton
										v-if="isAssessed && chat?.learning_outcomes"
										variant="outline"
										size="sm"
										class="w-full"
										@click="showLearningOutcomes = true"
									>
										<Icon
											name="lucide:graduation-cap"
											class="mr-2 h-4 w-4"
										/>
										View Learning Outcomes
									</UButton>

									<!-- Chat History Button (show if has completed history) -->
									<UButton
										v-if="chatStatus && chatStatus.hasCompletedHistory"
										variant="outline"
										size="sm"
										class="w-full"
										@click="showChatHistory = true"
									>
										<Icon
											name="lucide:history"
											class="mr-2 h-4 w-4"
										/>
										View Chat History ({{ chatStatus.totalChats }} chats)
									</UButton>

									<!-- Start New Chat Button (when no active chat but has history) -->
									<UButton
										v-if="isAssessed"
										variant="default"
										size="sm"
										class="w-full"
										:disabled="isStartingAgain"
										@click="startCaseAgain"
									>
										<Icon
											name="lucide:play-circle"
											class="mr-2 h-4 w-4"
											:class="{ 'animate-spin': isStartingAgain }"
										/>
										{{ isStartingAgain ? 'Starting...' : 'Start New Chat' }}
									</UButton>
								</div>
							</template>
						</CaseStory>
					</div>
				</div>

				<!-- Right side: Chat Interface -->
				<div class="flex flex-1 flex-col h-full relative lg:overflow-hidden">
					<div class="lg:overflow-hidden flex flex-1">
						<!-- Active Chat Interface -->
						<ChatInterface
							v-if="chat"
							v-model="newMessage"
							:agent="studyCase.agent_id"
							:messages="chat.messages || []"
							:status="chat.status || 'created'"
							:is-typing="isTyping"
							:disabled="isAssessed"
							:is-sending="isSending"
							@send="sendMessage"
						/>

						<!-- Loading State -->
						<UCard
							v-else-if="!chatStatus"
							class="flex-1 flex flex-col items-center justify-center"
						>
							<UCardContent class="text-center">
								<Icon
									name="lucide:refresh-cw"
									class="animate-spin h-8 w-8 mx-auto mb-4"
								/>
								<p>Loading chat...</p>
							</UCardContent>
						</UCard>
					</div>

					<!-- Auth Overlay for unauthenticated users -->
					<AuthOverlay
						v-if="!user"
						:return-url="$route.fullPath"
					/>
				</div>
			</div>
		</div>

		<!-- Learning Outcomes Overlay -->
		<UDialog v-model:open="showLearningOutcomes">
			<UDialogContent class="lg:max-w-[90vw] lg:w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
				<UDialogHeader>
					<UDialogTitle>Learning Outcomes Assessment</UDialogTitle>
					<UDialogDescription>
						Here's your detailed assessment and learning outcomes for this case.
					</UDialogDescription>
				</UDialogHeader>

				<div class="flex-1 overflow-y-auto p-1">
					<LearningOutcomes
						v-if="chat?.learning_outcomes"
						:learning-outcomes="chat.learning_outcomes"
					/>
				</div>

				<div class="flex justify-end gap-2 pt-4 border-t">
					<UButton
						variant="outline"
						@click="showLearningOutcomes = false"
					>
						Close
					</UButton>
				</div>
			</UDialogContent>
		</UDialog>

		<!-- Chat History Modal -->
		<UDialog v-model:open="showChatHistory">
			<UDialogContent class="lg:max-w-[90vw] lg:w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
				<UDialogHeader>
					<UDialogTitle>Chat History</UDialogTitle>
					<UDialogDescription>
						View all your previous conversations for this case.
					</UDialogDescription>
				</UDialogHeader>

				<div class="flex-1 overflow-y-auto p-1">
					<ChatHistoryView
						v-if="studyCase"
						:case-id="studyCase.id"
						:current-chat-id="chat?.id"
					/>
				</div>

				<div class="flex justify-end gap-2 pt-4 border-t">
					<UButton
						variant="outline"
						@click="showChatHistory = false"
					>
						Close
					</UButton>
				</div>
			</UDialogContent>
		</UDialog>
	</div>
</template>

<script setup lang="ts">
import type { Database } from '~/database.types';
import { ChatStatus, type Case, type Chat } from '~/server/types';

// Page metadata - Use case layout and no auth middleware, we handle auth with overlay
definePageMeta({
	layout: 'case',
});

// Get route params
const route = useRoute();
const slug = route.params.slug as string;

// Reactive data
const newMessage = ref('');
const isTyping = ref(false);
const isSending = ref(false);
const isSubmitting = ref(false);
const showLearningOutcomes = ref(false);
const showChatHistory = ref(false);
const isStartingAgain = ref(false);

// Fetch case data
const { data: studyCase, error, pending } = await useFetch<Case>(`/api/cases/${slug}`);

// Chat state
const chat = ref<Chat | null>(null);
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

// Chat status state
const chatStatus = ref<{
	activeChat: Chat | null;
	hasHistory: boolean;
	hasCompletedHistory: boolean;
	totalChats: number;
} | null>(null);

// Store current chat ID for channel cleanup
const currentChatId = ref<number | null>(null);

// Initialize chat when case is loaded
watchEffect(async () => {
	if (studyCase.value && user.value) {
		await checkChatStatus();
	}
});

// Show learning outcomes overlay when they become available
watch(() => chat.value?.learning_outcomes, (newOutcomes) => {
	if (newOutcomes && isAssessed.value) {
		showLearningOutcomes.value = true;
	}
}, { immediate: true });

// Cleanup subscription on unmount
onUnmounted(() => {
	if (currentChatId.value) {
		supabase.removeAllChannels();
	}
});

// Check chat status and initialize if needed
async function checkChatStatus() {
	if (!studyCase.value || !user.value) return;

	try {
		// Check current chat status and history
		const response = await $fetch<{
			activeChat: Chat | null;
			hasHistory: boolean;
			hasCompletedHistory: boolean;
			totalChats: number;
		}>('/api/chats/check-status', {
			query: { case_id: studyCase.value.id },
		});

		chatStatus.value = response;

		// If there's an active chat, use it
		if (response.activeChat) {
			chat.value = response.activeChat;
			currentChatId.value = response.activeChat.id;
			await subscribeToChat(response.activeChat.id);
		}

		// If no active chat and no history, auto-create first chat
		else if (!response.hasHistory) {
			await createNewChat();
		}
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorStatus = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
		console.error('Failed to check chat status:', { message: errorMessage, status: errorStatus });
	}
}

// Create new chat
async function createNewChat() {
	if (!studyCase.value || !user.value) return;

	try {
		const response = await $fetch<Chat>('/api/chats/create', {
			method: 'POST',
			body: {
				case_id: studyCase.value.id,
				agent_id: studyCase.value.agent,
				force_new: true,
			},
		});

		chat.value = response;
		currentChatId.value = response.id;
		await subscribeToChat(response.id);

		// Refresh chat status
		await checkChatStatus();
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('Failed to create new chat:', { message: errorMessage });
	}
}

// Subscribe to chat updates
async function subscribeToChat(chatId: number) {
	// Cleanup old subscription
	if (currentChatId.value && currentChatId.value !== chatId) {
		supabase.removeAllChannels();
	}

	// Subscribe to new chat updates
	supabase
		.channel(`chat-${chatId}`)
		.on('postgres_changes', {
			event: 'UPDATE',
			schema: 'public',
			table: 'chats',
			filter: `id=eq.${chatId}`,
		}, (payload) => {
			chat.value = payload.new as Chat;
		})
		.subscribe();
}

// Send message
async function sendMessage(messageText?: string) {
	const text = messageText || newMessage.value.trim();
	if (!text || !chat.value || isSending.value) return;

	newMessage.value = '';
	isSending.value = true;

	try {
		// Send user message
		await $fetch(`/api/chats/${chat.value.id}/messages`, {
			method: 'POST',
			body: {
				message: text,
				type: 'user',
			},
		});

		// Generate AI response
		isTyping.value = true;

		try {
			await $fetch(`/api/chats/${chat.value.id}/generate-response`, {
				method: 'POST',
				body: {
					userMessage: text,
				},
			});

			// The AI response is automatically saved to the database by the endpoint
			// The UI will update through the Supabase realtime subscription
		}
		catch (error) {
			// Extract only serializable properties from error for logging
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.error('Failed to generate AI response:', { message: errorMessage });
			// If AI generation fails, show an error message
			await $fetch(`/api/chats/${chat.value.id}/messages`, {
				method: 'POST',
				body: {
					message: 'I apologize, but I encountered an error while processing your message. Please try again.',
					type: 'agent',
				},
			});
		}
		finally {
			isTyping.value = false;
		}
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('Failed to send message:', { message: errorMessage });
		if (!messageText) {
			newMessage.value = text; // Restore message on error
		}
	}
	finally {
		isSending.value = false;
	}
}

// Submit chat with comprehensive assessment
async function submitChat() {
	if (!chat.value || isSubmitting.value || !chat.value.messages.length) return;

	isSubmitting.value = true;

	try {
		const response = await $fetch(`/api/chats/${chat.value.id}/submit-case`, {
			method: 'POST',
		});

		chat.value = response;
		await checkChatStatus();
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('Failed to submit and assess case:', { message: errorMessage });
		// You might want to show an error toast/notification here
	}
	finally {
		isSubmitting.value = false;
	}
}

// Start case again - create a new chat
async function startCaseAgain() {
	if (isStartingAgain.value) return;

	isStartingAgain.value = true;

	try {
		await createNewChat();
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('Failed to start case again:', { message: errorMessage });
	}
	finally {
		isStartingAgain.value = false;
	}
}

// Computed properties
const shouldShowActions = computed(() => {
	// Show if there are learning outcomes to view
	if (isAssessed.value && chat.value?.learning_outcomes) return true;

	// Wait for chatStatus to be loaded before checking these conditions
	if (!chatStatus.value) return false;

	// Show if no active chat but has history (start new chat button)
	if (!chat.value && chatStatus.value.hasHistory) return true;

	// Show if has completed history (history button)
	if (chatStatus.value.hasCompletedHistory) return true;

	return false;
});

const canBeSubmitted = computed(() => {
	if (!chat.value?.status || !chat.value.messages.length) return false;
	return true;
});

// Helper functions for assessment status
const isAssessed = computed(() => {
	if (!chat.value?.status) return false;
	return [ChatStatus.SUBMITTED, ChatStatus.PASSED, ChatStatus.CAN_BE_IMPROVED, ChatStatus.NOT_PASSED].includes(chat.value.status);
});

function getSubmitButtonText(status?: ChatStatus): string {
	if (!status) return 'Submit Case';

	switch (status) {
		case ChatStatus.PASSED:
			return 'Passed ✓';
		case ChatStatus.CAN_BE_IMPROVED:
			return 'Can Be Improved';
		case ChatStatus.NOT_PASSED:
			return 'Not Passed';
		case ChatStatus.SUBMITTED:
			return 'Submitted';
		default:
			return 'Submit Case';
	}
}

// Set page title
useHead({
	title: computed(() => studyCase.value?.title || 'Case'),
});
</script>
