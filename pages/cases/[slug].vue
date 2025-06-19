<template>
	<div class="min-h-screen bg-background">
		<div class="container mx-auto p-6">
			<div class="flex items-center gap-2 mb-4">
				<UButton
					variant="outline"
					size="sm"
					@click="$router.back()"
				>
					<Icon name="i-lucide-arrow-left" />
					Back to cases
				</UButton>
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
				class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]"
			>
				<!-- Left side: Case story -->
				<CaseStory
					:study-case="studyCase"
					:disabled="!chat || chat.status === 'submitted'"
					:is-submitting="isSubmitting"
					:submit-text="chat?.status === 'submitted' ? 'Submitted' : 'Submit Case'"
					@submit="submitChat"
				/>

				<!-- Right side: Chat -->
				<div class="flex flex-col h-full">
					<ChatInterface
						v-model="newMessage"
						:agent="studyCase.agent_id"
						:messages="chat?.messages || []"
						:status="chat?.status || 'created'"
						:is-typing="isTyping"
						:disabled="chat?.status === 'submitted'"
						:is-sending="isSending"
						@send="sendMessage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Database } from '~/database.types';

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

interface ChatData {
	id: number;
	status: string;
	messages: Array<{
		type: 'user' | 'agent';
		text: string;
		timestamp: string;
	}>;
}

// Page metadata
definePageMeta({
	middleware: 'auth',
});

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

		// Simulate agent typing
		isTyping.value = true;

		// TODO: Here you would call your AI service to generate agent response
		// For now, simulate a delay and send a mock response
		setTimeout(async () => {
			isTyping.value = false;

			try {
				await $fetch(`/api/chats/${chat.value!.id}/messages`, {
					method: 'POST',
					body: {
						message: `Thank you for your message: "${text}". I'm here to help you with this case.`,
						type: 'agent',
					},
				});
			}
			catch (error) {
				console.error('Failed to send agent message:', error);
			}
		}, 2000);
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

// Submit chat
async function submitChat() {
	if (!chat.value || isSubmitting.value) return;

	isSubmitting.value = true;

	try {
		await $fetch(`/api/chats/${chat.value.id}/status`, {
			method: 'PATCH',
			body: {
				status: 'submitted',
			},
		});
	}
	catch (error) {
		console.error('Failed to submit chat:', error);
	}
	finally {
		isSubmitting.value = false;
	}
}

// Set page title
useHead({
	title: computed(() => studyCase.value?.title || 'Case'),
});
</script>
