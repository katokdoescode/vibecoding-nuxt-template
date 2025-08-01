import { track } from '@vercel/analytics';
import { useCookieConsent } from '~/composables/useCookieConsent';

export type AnalyticsEvent
  // Authentication events
  = | 'user_signed_up'
    | 'user_signed_in'
    | 'user_signed_out';

export interface AnalyticsProperties {
  user_email?: string;
  user_id?: string;
  page_path?: string;
  [key: string]: string | number | boolean | undefined;
}

export const useAnalytics = () => {
  const user = useSupabaseUser();
  const route = useRoute();
  const { hasAnalyticsConsent } = useCookieConsent();

  /**
   * Track an analytics event with user context
   */
  const trackEvent = (event: AnalyticsEvent, properties: AnalyticsProperties = {}) => {
    try {
      // Check if user has consented to analytics cookies
      if (!hasAnalyticsConsent()) {
        // Log in development for debugging
        if (import.meta.dev) {
          console.log('Analytics Event (not tracked - no consent):', event, properties);
        }
        return;
      }

      // Add user context if available
      const enrichedProperties: AnalyticsProperties = {
        ...properties,
        page_path: route.path,
        timestamp: Date.now(),
      };

      // Add user information if authenticated
      if (user.value) {
        enrichedProperties.user_email = user.value.email;
        enrichedProperties.user_id = user.value.id;
      }

      // Filter out undefined values for Vercel Analytics compatibility
      const cleanProperties: Record<string, string | number | boolean> = {};
      Object.entries(enrichedProperties).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanProperties[key] = value;
        }
      });

      // Track the event
      track(event, cleanProperties);

      // Log in development for debugging
      if (import.meta.dev) {
        console.log('Analytics Event:', event, cleanProperties);
      }
    }
    catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  /**
   * Track authentication events
   */
  const trackAuth = {
    signUp: (method: 'email' | 'google' = 'email') => {
      trackEvent('user_signed_up', { auth_method: method });
    },
    signIn: (method: 'email' | 'google' = 'email') => {
      trackEvent('user_signed_in', { auth_method: method });
    },
    signOut: () => {
      trackEvent('user_signed_out');
    },
  };

  return {
    trackEvent,
    trackAuth,
  };
};
