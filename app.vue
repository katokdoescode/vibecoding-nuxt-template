<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports';
import { useUser } from '~/composables/useUser';

const supabase = useSupabaseClient();
const { data: { user: userData } } = await supabase.auth.getUser();
const { user, data: userAppData } = await useUser(userData);

onMounted(() => {
	console.info('User:', user.value);
	console.info('User App Data:', userAppData.value);
});
</script>
