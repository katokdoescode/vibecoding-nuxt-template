<template>
	<BackgroundGradient>
		<div class="flex min-h-screen">
			<AsidePanel />
			<main class="flex-1 p-4 relative">
				<!-- Button to open AsidePanel slideover -->
				<UButton icon="i-heroicons-bars-3" color="primary" variant="soft" class="absolute top-4 left-4 z-20"
					@click="asideOpen = true" aria-label="Open menu" />
				<slot />
			</main>
		</div>
	</BackgroundGradient>
</template>

<script setup lang="ts">
import { useState } from '#imports'
const asideOpen = useState('asideOpen', () => false)
</script>
