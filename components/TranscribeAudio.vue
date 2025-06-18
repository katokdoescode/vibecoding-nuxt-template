<template>
	<UCard class="max-w-xl mx-auto mt-12">
		<template #header>
			<h2 class="text-2xl font-bold text-primary mb-2">Voice to Text</h2>
		</template>
		<template #default>
			<div class="flex flex-col items-center gap-4 w-full">
				<UButton :loading="isLoading"
					:icon="isRecording ? 'i-heroicons-stop-circle-20-solid' : 'i-heroicons-microphone-20-solid'"
					:color="isRecording ? 'error' : 'primary'" size="xl"
					class="rounded-full h-20 w-20 flex items-center justify-center text-3xl shadow-lg transition-all duration-200"
					@click="toggleRecording" :aria-label="isRecording ? 'Stop recording' : 'Start recording'">
				</UButton>
			</div>

			<div v-if="transcription && !isLoading" class="w-full mt-4 p-4 rounded bg-gray-100 dark:bg-gray-800">
				<span class="block text-xs text-gray-500 mb-1">Transcription</span>
				<p class="text-base text-gray-900 dark:text-gray-100">{{ transcription }}</p>
			</div>
			<div v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isRecording = ref(false);
const isLoading = ref(false);
const audioBlob = ref<Blob | null>(null);
const transcription = ref('');
const error = ref('');
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
const streamRef = ref<MediaStream | null>(null);

const toggleRecording = async () => {
	if (isRecording.value) {
		await stopRecording();
	} else {
		await startRecording();
	}
};

const startRecording = async () => {
	error.value = '';
	transcription.value = '';
	audioBlob.value = null;
	audioChunks = [];
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		streamRef.value = stream;
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) audioChunks.push(e.data);
		};
		mediaRecorder.onstop = async () => {
			const blob = new Blob(audioChunks, { type: 'audio/webm' });
			audioBlob.value = blob;
			// Stop all tracks to release the mic
			if (streamRef.value) {
				streamRef.value.getTracks().forEach(track => track.stop());
				streamRef.value = null;
			}
			await transcribeAudio(); // Start transcription only after blob is created
		};
		mediaRecorder.start();
		isRecording.value = true;
	} catch (err: any) {
		error.value = 'Could not access microphone.';
	}
};

const stopRecording = async () => {
	if (mediaRecorder && isRecording.value) {
		mediaRecorder.stop();
		isRecording.value = false;
	}
};

const transcribeAudio = async () => {
	if (!audioBlob.value) return;
	isLoading.value = true;
	error.value = '';
	transcription.value = '';
	try {
		const formData = new FormData();
		formData.append('file', audioBlob.value, 'audio.webm');
		const res = await fetch('/api/openai-transcribe', {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();
		if (data.text) {
			transcription.value = data.text;
		} else {
			error.value = data.error || 'Failed to transcribe.';
		}
	} catch (err: any) {
		error.value = 'Failed to transcribe.';
	} finally {
		isLoading.value = false;
	}
};
</script>
