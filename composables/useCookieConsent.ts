export type CookieConsentChoice = 'all' | 'essential' | null;

const COOKIE_CONSENT_KEY = 'cookie-consent';

export const useCookieConsent = () => {
  const consentChoice = ref<CookieConsentChoice>(null);

  const getConsentChoice = (): CookieConsentChoice => {
    if (import.meta.client) {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      return (saved as CookieConsentChoice) || null;
    }
    return null;
  };

  const setConsentChoice = (choice: CookieConsentChoice) => {
    if (import.meta.client && choice) {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
      consentChoice.value = choice;
    }
  };

  const hasConsented = (): boolean => {
    return getConsentChoice() !== null;
  };

  const hasAnalyticsConsent = (): boolean => {
    return getConsentChoice() === 'all';
  };

  const hasEssentialConsent = (): boolean => {
    const choice = getConsentChoice();
    return choice === 'all' || choice === 'essential';
  };

  const clearConsent = () => {
    if (import.meta.client) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      consentChoice.value = null;
    }
  };

  // Initialize consent choice on client side
  onMounted(() => {
    consentChoice.value = getConsentChoice();

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      consentChoice.value = event.detail.choice;
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);

    // Cleanup listener
    onUnmounted(() => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    });
  });

  return {
    consentChoice: readonly(consentChoice),
    getConsentChoice,
    setConsentChoice,
    hasConsented,
    hasAnalyticsConsent,
    hasEssentialConsent,
    clearConsent,
  };
};
