<template>
	<div class="flex gap-2 flex-shrink-0">
		<UInput
			:model-value="modelValue"
			placeholder="Type your message..."
			:disabled="disabled"
			class="flex-1"
			@update:model-value="handleInput"
			@keyup.enter="handleSend"
		/>
		<UButton
			:disabled="!modelValue.trim() || disabled"
			@click="handleSend"
		>
			{{ isSending ? 'Sending...' : 'Send' }}
		</UButton>
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

function handleInput(value: string | number) {
	emit('update:modelValue', String(value));
}

function handleSend() {
	const message = props.modelValue.trim();
	if (message) {
		emit('send', message);
	}
}
</script>
