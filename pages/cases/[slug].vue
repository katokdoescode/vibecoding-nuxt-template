<template>
	<div class="min-h-screen bg-background">
		<div class="container mx-auto p-6">
			<div class="flex items-center gap-2 mb-4">
				<NuxtLink
					variant="outline"
					size="sm"
					href="/"
				>
					<Icon name="i-lucide-arrow-left" />
					Back to cases
				</NuxtLink>
			</div>
			<!-- Loading state -->
			<div
				v-if="pending"
				class="flex items-center justify-center h-96"
			>
				<div class="text-lg">
					Loading case...
				</div>
			</div>

			<!-- Error state -->
			<div
				v-else-if="error"
				class="flex items-center justify-center h-96"
			>
				<div class="text-red-500">
					{{ error.statusMessage || 'Failed to load case' }}
				</div>
			</div>

			<!-- Main content -->
			<div
				v-else-if="studyCase"
				class="space-y-6"
			>
				<!-- Learning Outcomes (shown at top after assessment) -->
				<div v-if="isAssessed(chat?.status) && chat?.learning_outcomes">
					<LearningOutcomes :learning-outcomes="chat.learning_outcomes" />
				</div>

				<!-- Case Story and Chat (always in 2-column layout) -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
					<!-- Left side: Case story -->
					<CaseStory
						:study-case="studyCase"
						:disabled="!chat || isAssessed(chat.status)"
						:is-submitting="isSubmitting"
						:submit-text="getSubmitButtonText(chat?.status)"
						@submit="submitChat"
					/>

					<!-- Right side: Chat Interface -->
					<div class="flex flex-col h-full relative">
						<ChatInterface
							v-model="newMessage"
							:agent="studyCase.agent_id"
							:messages="chat?.messages || []"
							:status="chat?.status || 'created'"
							:is-typing="isTyping"
							:disabled="isAssessed(chat?.status)"
							:is-sending="isSending"
							@send="sendMessage"
						/>

						<!-- Auth Overlay for unauthenticated users -->
						<AuthOverlay
							v-if="!user"
							:return-url="$route.fullPath"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Database } from '~/database.types';
import type { Chat, LearningOutcomes } from '~/server/types';

// Types
interface CaseWithAgent {
	id: string;
	title: string | null;
	description: string | null;
	story: string | null;
	slug: string;
	agent: string | null;
	agent_id?: {
		id: string;
		name: string;
		position: string | null;
		prompt: string | null;
	} | null;
}

type ChatData = Pick<Chat, 'id' | 'status' | 'messages' | 'learning_outcomes'>;

// Page metadata - No auth middleware, we handle auth with overlay
definePageMeta({});

// Get route params
const route = useRoute();
const slug = route.params.slug as string;

// Reactive data
const newMessage = ref('');
const isTyping = ref(false);
const isSending = ref(false);
const isSubmitting = ref(false);

// Fetch case data
const { data: studyCase, error, pending } = await useFetch<CaseWithAgent>(`/api/cases/${slug}`);

// Chat state
const chat = ref<ChatData | null>(null);
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

// Store current chat ID for channel cleanup
const currentChatId = ref<number | null>(null);

// Initialize chat when case is loaded
watchEffect(async () => {
	if (studyCase.value && user.value) {
		await initializeChat();
	}
});

// Cleanup subscription on unmount
onUnmounted(() => {
	if (currentChatId.value) {
		supabase.removeAllChannels();
	}
});

// Initialize chat
async function initializeChat() {
	if (!studyCase.value || !user.value) return;

	try {
		// Check if chat exists, create if not
		const response = await $fetch<ChatData>('/api/chats/create', {
			method: 'POST',
			body: {
				case_id: studyCase.value.id,
				agent_id: studyCase.value.agent,
			},
		});

		chat.value = response;
		currentChatId.value = response.id;

		// Subscribe to chat updates
		supabase
			.channel(`chat-${response.id}`)
			.on('postgres_changes', {
				event: 'UPDATE',
				schema: 'public',
				table: 'chats',
				filter: `id=eq.${response.id}`,
			}, (payload) => {
				chat.value = payload.new as ChatData;
			})
			.subscribe();
	}
	catch (error) {
		console.error('Failed to initialize chat:', error);
	}
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
			console.error('Failed to generate AI response:', error);
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
		console.error('Failed to send message:', error);
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
	if (!chat.value || isSubmitting.value) return;

	isSubmitting.value = true;

	try {
		const result = await $fetch(`/api/chats/${chat.value.id}/submit-case`, {
			method: 'POST',
			body: {
				finalReflection: '', // Could be enhanced to collect user's final reflection
			},
		});

		// Show success notification with assessment results
		console.log('Assessment complete:', result);

		// The chat will be updated through Supabase realtime subscription
		// so the UI will automatically reflect the new status and assessment message
	}
	catch (error) {
		console.error('Failed to submit and assess case:', error);
		// You might want to show an error toast/notification here
	}
	finally {
		isSubmitting.value = false;
	}
}

// Helper functions for assessment status
function isAssessed(status?: string): boolean {
	if (!status) return false;
	return ['submitted', 'passed', 'can_be_improved', 'not_passed'].includes(status);
}

function getSubmitButtonText(status?: string): string {
	if (!status) return 'Submit Case';

	switch (status) {
		case 'passed':
			return 'Passed ✓';
		case 'can_be_improved':
			return 'Can Be Improved';
		case 'not_passed':
			return 'Not Passed';
		case 'submitted':
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
