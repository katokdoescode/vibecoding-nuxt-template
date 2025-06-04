<template>
	<USlideover v-model:open="asideOpen" :side="'left'">
		<template #title>
			<h2 class="text-2xl font-bold">Menu</h2>
		</template>
		<template #body>
			<aside class="w-full h-full flex flex-col justify-between">
				<nav aria-label="Main navigation" class="flex flex-col gap-2 mt-2">
					<ULink to="/" class="flex items-center gap-2">
						<UIcon name="i-heroicons-home" />
						<span>Home</span>
					</ULink>
					<ULink to="/dashboard" class="flex items-center gap-2">
						<UIcon name="i-heroicons-home" />
						<span>Dashboard</span>
					</ULink>
				</nav>
				<div class="flex flex-col gap-2">
					<UButton color="error" variant="solid" @click="signOut">
						Sign Out
						<UIcon name="i-heroicons-arrow-right-on-rectangle" class="ml-auto" />
					</UButton>
				</div>
			</aside>
		</template>
	</USlideover>
</template>

<script setup lang="ts">
import { useState } from '#imports'

const asideOpen = useState('asideOpen', () => false)
const supabase = useSupabaseClient()

const signOut = async () => {
	await supabase.auth.signOut()
	await navigateTo('/')
}

onMounted(() => {
	asideOpen.value = false
})

onBeforeRouteUpdate(() => {
	asideOpen.value = false
})
</script>
