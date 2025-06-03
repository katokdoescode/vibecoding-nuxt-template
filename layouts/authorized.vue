<template>
	<div class="flex min-h-screen">
		<!-- Side Panel -->
		<aside class="bg-gray-100 dark:bg-gray-900 p-4 flex flex-col gap-4 w-20 sm:w-48">
			<h2 class="text-2xl font-bold">Menu</h2>
			<nav aria-label="Main navigation"></nav>
			<ULink to="/" class="flex items-center gap-2">
				<UIcon name="i-heroicons-home" />
				<span>Home</span>
			</ULink>
			<ULink to="/dashboard" class="flex items-center gap-2">
				<UIcon name="i-heroicons-home" />
				<span>Dashboard</span>
			</ULink>
			<UButton color="error" variant="solid" class="w-full mt-auto" @click="signOut">
				Sign Out
			</UButton>
		</aside>
		<!-- Main Content -->
		<main class="flex-1 p-4">
			<slot />
		</main>
	</div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const signOut = async () => {
	await supabase.auth.signOut()
	await navigateTo('/')
}
</script>
