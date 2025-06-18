<template>
	<UContainer>
		<UCard class="max-w-xl mx-auto mt-10">
			<template #header>
				<h1 class="text-2xl font-bold">Welcome to your Dashboard</h1>
			</template>
			<p class="text-gray-700 dark:text-gray-300">This page is only accessible to authorized users.</p>
		</UCard>
		<TranscribeAudio />
	</UContainer>
</template>

<script setup lang="ts">

definePageMeta({
	layout: 'authorized',
	middleware: ['auth'],
})
</script>
