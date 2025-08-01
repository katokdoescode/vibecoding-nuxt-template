<template>
  <div>
    <header class="container mx-auto py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <Icon
            name="lucide:home"
            aria-hidden="true"
          />
          <a href="/">
            <span class="text-primary">My</span>
            <span class="text-primary">App</span>
          </a>
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <AuthDialog />
        <ColorMode />
      </div>
    </header>
    <main class="container mx-auto flex-1">
      <slot />
    </main>
    <footer
      v-if="$route.path === '/'"
      class="border-t bg-background"
    >
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-muted-foreground">
            © {{ new Date().getFullYear() }} My App. All rights reserved.
          </p>
          <div class="flex gap-4 text-sm">
            <NuxtLink
              to="/privacy"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
    <CookieConsentModal />
  </div>
</template>
