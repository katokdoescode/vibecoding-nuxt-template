<script setup lang="ts">
// Unified background gradient wrapper
</script>

<template>
  <BackgroundGradient>
    <div class="flex flex-col gap-4">
      <TheHeader />
      <main>
        <slot />
      </main>
      <TheFooter />
    </div>
  </BackgroundGradient>
</template>
