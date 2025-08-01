<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Cookie Consent</DialogTitle>
        <DialogDescription>
          We use cookies to enhance your experience and analyze site traffic. Choose your preferences below.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="space-y-2">
          <h4 class="text-sm font-medium">
            Essential Cookies
          </h4>
          <p class="text-sm text-muted-foreground">
            Required for the website to function properly. Cannot be disabled.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="text-sm font-medium">
            Analytics Cookies
          </h4>
          <p class="text-sm text-muted-foreground">
            Help us understand how you use our website to improve your experience.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="text-sm font-medium">
            Your Privacy
          </h4>
          <p class="text-sm text-muted-foreground">
            For more information about how we handle your data, please read our
            <NuxtLink
              to="/privacy"
              class="text-primary hover:underline"
              @click="isOpen = false"
            >Privacy Policy</NuxtLink>
            and
            <NuxtLink
              to="/terms"
              class="text-primary hover:underline"
              @click="isOpen = false"
            >Terms of Service</NuxtLink>.
          </p>
        </div>
      </div>

      <DialogFooter class="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          @click="handleEssentialOnly"
        >
          Essential Only
        </Button>
        <Button @click="handleAcceptAll">
          Accept All
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { useCookieConsent, type CookieConsentChoice } from '~/composables/useCookieConsent';

const { hasConsented, setConsentChoice } = useCookieConsent();
const isOpen = defineModel<boolean>({ default: false });

const handleAcceptAll = () => {
  setConsentChoice('all');
  isOpen.value = false;

  // Dispatch event for analytics to pick up
  if (import.meta.client) {
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { choice: 'all' as CookieConsentChoice },
    }));
  }
};

const handleEssentialOnly = () => {
  setConsentChoice('essential');
  isOpen.value = false;

  // Dispatch event for analytics to pick up
  if (import.meta.client) {
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { choice: 'essential' as CookieConsentChoice },
    }));
  }
};

onMounted(() => {
  if (!hasConsented()) {
    isOpen.value = true;
  }
});
</script>
