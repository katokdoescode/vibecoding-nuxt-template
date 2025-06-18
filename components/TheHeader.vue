<template>
  <header class="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow-sm">
    <ULink to="/" class="text-lg font-bold">
      Brand Name
    </ULink>
    <nav class="flex gap-2 items-center">
      <ULink to="/">
        Home
      </ULink>
      <ULink v-if="user" to="/dashboard">
        Dashboard
      </ULink>
    </nav>
    <div class="flex gap-2 items-center">
      <template v-if="user">
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ user.email }}</span>
        <UButton color="primary" variant="outline" @click="signOut">
          Sign Out
        </UButton>
      </template>
      <template v-else>
        <UButton color="primary" @click="openDialog('signIn')">
          Sign In
        </UButton>
        <UButton color="primary" variant="outline" @click="openDialog('signUp')">
          Sign Up
        </UButton>
      </template>
    </div>
    <AuthDialog />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { User } from '@supabase/supabase-js';
import { useSupabaseClient } from '#imports';
import { useAuthDialog } from '~/composables/useAuthDialog';

const user = ref<User | null>(null);
const supabase = useSupabaseClient();
const { setOpen, setMode } = useAuthDialog();

function openDialog(mode: 'signIn' | 'signUp') {
  setMode(mode);
  setOpen(true);
}

async function fetchUser() {
  const { data } = await supabase.auth.getUser();
  user.value = data?.user || null;
}

async function signOut() {
  await supabase.auth.signOut();
  user.value = null;
}

let listener = Object.create(null);
onMounted(async () => {
  await fetchUser();
  listener = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });
});
onUnmounted(() => {
  if (listener && listener.subscription && typeof listener.subscription.unsubscribe === 'function') {
    listener.subscription.unsubscribe();
  }
});
</script>
