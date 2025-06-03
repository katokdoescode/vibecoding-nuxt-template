<template>
  <UContainer class="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
    <UCard class="max-w-lg w-full p-8 flex flex-col items-center gap-4 shadow-lg bg-white/80 dark:bg-gray-900/80">
      <h1 class="text-4xl font-extrabold text-primary">MuteTutor</h1>
      <p class="text-lg text-gray-700 dark:text-gray-300">Your cozy space to learn, practice, and grow in silence.</p>
    </UCard>
  </UContainer>

  <!-- Features Section -->
  <UContainer class="mt-12 flex flex-col items-center gap-8">
    <h2 class="text-2xl font-bold text-primary">Why MuteTutor?</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
      <UCard>
        <div class="flex flex-col items-center gap-2 p-6 bg-white/70 dark:bg-gray-900/70">
          <UIcon name="i-heroicons-sparkles" class="text-3xl text-primary" />
          <span class="font-semibold">Distraction-Free</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">Focus on learning in a calm, silent environment.</span>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col items-center gap-2 p-6 bg-white/70 dark:bg-gray-900/70">
          <UIcon name="i-heroicons-academic-cap" class="text-3xl text-primary" />
          <span class="font-semibold">Personalized Practice</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">Tailor your study sessions to your needs and
            pace.</span>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col items-center gap-2 p-6 bg-white/70 dark:bg-gray-900/70">
          <UIcon name="i-heroicons-heart" class="text-3xl text-primary" />
          <span class="font-semibold">Supportive Community</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">Grow together with like-minded learners.</span>
        </div>
      </UCard>
    </div>
  </UContainer>

  <!-- How It Works Section -->
  <UContainer>
    <div class="mt-16 flex flex-col items-center gap-8">
      <h2 class="text-2xl font-bold text-primary">How It Works</h2>
      <div class="flex flex-col sm:flex-row gap-8 w-full max-w-4xl justify-center items-center">
        <UCard class="flex-1 p-6 bg-white/70 dark:bg-gray-900/70">
          <span class="font-semibold">1. Sign Up</span>
          <p class="text-sm text-gray-600 dark:text-gray-400">Create your free account and join the community.</p>
        </UCard>
        <UCard class="flex-1 p-6 bg-white/70 dark:bg-gray-900/70">
          <span class="font-semibold">2. Set Your Goals</span>
          <p class="text-sm text-gray-600 dark:text-gray-400">Choose what you want to learn and how you want to grow.
          </p>
        </UCard>
        <UCard class="flex-1 p-6 bg-white/70 dark:bg-gray-900/70">
          <span class="font-semibold">3. Start Practicing</span>
          <p class="text-sm text-gray-600 dark:text-gray-400">Enjoy focused, silent sessions and track your progress.
          </p>
        </UCard>
      </div>
    </div>
  </UContainer>

  <!-- Call to Action Section -->
  <UContainer class="mt-16 flex flex-col items-center gap-6 mb-16">
    <UCard class="bg-primary/90 text-white">
      <div class="max-w-xl w-full p-8 flex flex-col items-center gap-4">
        <h3 class="text-2xl font-bold">Ready to start your silent learning journey?</h3>
      </div>
    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
