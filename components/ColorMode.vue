<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <UDropdownMenu>
    <UDropdownMenuTrigger as-child>
      <UButton variant="outline">
        <Icon name="lucide:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon name="lucide:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </UButton>
    </UDropdownMenuTrigger>
    <UDropdownMenuContent align="end">
      <UDropdownMenuItem @click="colorMode.preference = 'light'">
        Light
      </UDropdownMenuItem>
      <UDropdownMenuItem @click="colorMode.preference = 'dark'">
        Dark
      </UDropdownMenuItem>
      <UDropdownMenuItem @click="colorMode.preference = 'system'">
        System
      </UDropdownMenuItem>
    </UDropdownMenuContent>
  </UDropdownMenu>
</template>
