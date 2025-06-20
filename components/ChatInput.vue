<template>
	<div class="flex gap-3 flex-shrink-0">
		<div class="flex-1 relative">
			<UTextarea
				ref="inputRef"
				:model-value="modelValue"
				placeholder="Type your message..."
				:disabled="disabled"
				class="flex-1 pr-12 min-h-[44px] border-2 focus:border-primary transition-colors"
				@update:model-value="handleInput"
				@keydown.enter="handleKeyDown"
			/>
			<UButton
				variant="ghost"
				size="sm"
				class="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
				:disabled="!modelValue.trim() || disabled"
				@click="handleSend"
			>
				<Icon
					name="lucide:send"
					class="h-4 w-4"
					:class="isSending ? 'animate-pulse' : ''"
				/>
			</UButton>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	modelValue: string;
	disabled?: boolean;
	isSending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
	isSending: false,
});

const emit = defineEmits<{
	'update:modelValue': [value: string];
	'send': [message: string];
}>();

// Template ref for input focus management
const inputRef = ref<HTMLInputElement>();

function handleInput(value: string | number) {
	emit('update:modelValue', String(value));
}

function handleKeyDown(event: KeyboardEvent) {
	// If Shift+Enter, allow default behavior (new line)
	if (event.shiftKey) {
		return;
	}

	// If just Enter (no shift), prevent default and send message
	event.preventDefault();
	handleSend();
}

function handleSend() {
	const message = props.modelValue.trim();
	if (message) {
		emit('send', message);
		// Keep focus on input after sending message
		nextTick(() => {
			inputRef.value?.focus();
		});
	}
}
</script>
