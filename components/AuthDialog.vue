<template>
  <UDialog>
    <UDialogTrigger as-child>
      <UButton>
        {{ mode === 'signIn' ? 'Sign In' : 'Sign Up' }}
      </UButton>
    </UDialogTrigger>
    <UDialogContent class="sm:max-w-[425px]">
      <UTabs
        v-model="mode"
        class="mt-4"
      >
        <UTabsList class="w-full">
          <UTabsTrigger value="signIn">
            Sign In
          </UTabsTrigger>
          <UTabsTrigger value="signUp">
            Sign Up
          </UTabsTrigger>
        </UTabsList>
      </UTabs>
      <UDialogHeader>
        <UDialogTitle>{{ mode === 'signIn' ? 'Sign In' : 'Sign Up' }}</UDialogTitle>
        <UDialogDescription>
          {{ mode === 'signIn' ? 'Sign in to your account' : 'Create a new account' }}
        </UDialogDescription>
      </UDialogHeader>
      <div class="flex flex-col gap-4 py-4">
        <div class="space-y-2">
          <ULabel for="email">
            Email
          </ULabel>
          <UInput
            id="email"
            v-model="email"
            placeholder="Email"
            type="email"
            class="w-full"
          />
        </div>
        <div class="space-y-2">
          <ULabel for="password">
            Password
          </ULabel>
          <UInput
            id="password"
            v-model="password"
            placeholder="Password"
            type="password"
            class="w-full"
          />
        </div>
        <UButton
          :disabled="loading"
          class="w-full"
          @click="handleAuth"
        >
          <span
            v-if="loading"
            class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {{ mode === 'signIn' ? 'Sign In' : 'Sign Up' }}
        </UButton>
        <div class="text-center text-sm">
          <span v-if="mode === 'signIn'">
            Don't have an account?
            <UButton
              variant="link"
              size="sm"
              class="p-0 h-auto"
              @click="mode = 'signUp'"
            >Sign Up</UButton>
          </span>
          <span v-else>
            Already have an account?
            <UButton
              variant="link"
              size="sm"
              class="p-0 h-auto"
              @click="mode = 'signIn'"
            >Sign In</UButton>
          </span>
        </div>
        <div
          v-if="error"
          class="text-sm text-destructive text-center"
        >
          {{ error }}
        </div>
      </div>
    </UDialogContent>
  </UDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const mode = ref<'signIn' | 'signUp'>('signIn');

const supabase = useSupabaseClient();

function close() {
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
