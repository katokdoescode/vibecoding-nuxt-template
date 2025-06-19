<template>
	<UCard class="flex flex-col">
		<UCardHeader class="flex-shrink-0">
			<UCardTitle class="flex items-center gap-2">
				<UAvatar class="h-8 w-8">
					<UAvatarFallback>{{ agent?.name?.charAt(0) || 'A' }}</UAvatarFallback>
				</UAvatar>
				Chat with {{ agent?.name }}
				<UBadge
					:variant="getStatusVariant(status)"
					class="ml-auto"
				>
					{{ getDisplayStatus(status) }}
				</UBadge>
			</UCardTitle>
			<UCardDescription v-if="agent?.position">
				{{ agent.position }}
			</UCardDescription>
		</UCardHeader>

		<UCardContent class="flex-1 flex flex-col min-h-0">
			<!-- Chat messages -->
			<div class="flex-1 overflow-auto space-y-4 mb-4 min-h-0 max-h-[700px]">
				<div
					v-if="messages.length === 0"
					class="text-center text-muted-foreground py-8"
				>
					Start a conversation with {{ agent?.name }}
				</div>

				<ChatMessage
					v-for="(message, index) in messages"
					:key="index"
					:message="message"
				/>

				<div
					v-if="isTyping"
					class="flex justify-start"
				>
					<div class="bg-muted rounded-lg px-4 py-2 text-sm">
						{{ agent?.name }} is typing...
					</div>
				</div>
			</div>
		</UCardContent>
		<UCardFooter>
			<!-- Chat input -->
			<ChatInput
				v-model="inputMessage"
				class="w-full"
				:disabled="disabled || isSending"
				:is-sending="isSending"
				@send="handleSend"
			/>
		</UCardFooter>
	</UCard>
</template>

<script setup lang="ts">
interface Agent {
	name: string;
	position: string | null;
}

interface Message {
	type: 'user' | 'agent';
	text: string;
	timestamp: string;
}

interface Props {
	agent?: Agent | null;
	messages?: Message[];
	status?: string;
	isTyping?: boolean;
	disabled?: boolean;
	isSending?: boolean;
}

withDefaults(defineProps<Props>(), {
	messages: () => [],
	status: 'created',
	isTyping: false,
	disabled: false,
	isSending: false,
});

const emit = defineEmits<{
	send: [message: string];
}>();

const inputMessage = defineModel<string>({ default: '' });

function handleSend(message: string) {
	emit('send', message);
}

function getStatusVariant(status: string) {
	switch (status) {
		case 'created': return 'secondary';
		case 'in progress': return 'default';
		case 'submitted': return 'outline';
		case 'passed': return 'default';
		case 'can_be_improved': return 'secondary';
		case 'not_passed': return 'destructive';
		default: return 'secondary';
	}
}

function getDisplayStatus(status: string) {
	switch (status) {
		case 'created': return 'Created';
		case 'in progress': return 'In Progress';
		case 'submitted': return 'Submitted';
		case 'passed': return 'Passed ✓';
		case 'can_be_improved': return 'Can Be Improved';
		case 'not_passed': return 'Not Passed';
		default: return status;
	}
}
</script>
