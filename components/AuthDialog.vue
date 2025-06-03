<template>
  <UModal :title="mode === 'signIn' ? 'Sign In' : 'Sign Up'" :open="open" @update:open="onDialogUpdate">
    <template #body>
      <div class="flex flex-col gap-4">
        <UInput v-model="email" placeholder="Email" type="email" class="w-full" />
        <UInput v-model="password" placeholder="Password" type="password" class="w-full" />
        <UButton :loading="loading" class="mt-2 self-start" @click="handleAuth">
          {{ mode === 'signIn' ? 'Sign In' : 'Sign Up' }}
        </UButton>
        <div class="text-center text-xs mt-2">
          <span v-if="mode === 'signIn'">
            Don't have an account?
            <UButton variant="link" color="primary" size="xs" @click="mode = 'signUp'">Sign Up</UButton>
          </span>
          <span v-else>
            Already have an account?
            <UButton variant="link" color="primary" size="xs" @click="mode = 'signIn'">Sign In</UButton>
          </span>
        </div>
        <div v-if="error" class="text-red-500 text-xs text-center mt-2">
          {{ error }}
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useSupabaseClient } from '#imports';

const props = defineProps<{ open: boolean; mode?: 'signIn' | 'signUp' }>();
const emit = defineEmits(['update:open', 'update:mode']);

const mode = ref<'signIn' | 'signUp'>(props.mode || 'signIn');

watch(() => props.mode, (v) => {
  if (v) mode.value = v;
  console.log(mode.value);
});
watch(mode, v => emit('update:mode', v));

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const supabase = useSupabaseClient();

function onDialogUpdate(val: boolean) {
  emit('update:open', val);
}

function close() {
  emit('update:open', false);
  error.value = '';
  email.value = '';
  password.value = '';
}

async function handleAuth() {
  loading.value = true;
  error.value = '';
  try {
    if (mode.value === 'signIn') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value });
      if (signInError) throw signInError;
      close();
    }
    else {
      const { error: signUpError } = await supabase.auth.signUp({ email: email.value, password: password.value });
      if (signUpError) throw signUpError;
      close();
    }
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Authentication failed.';
  }
  finally {
    loading.value = false;
  }
}
</script>
