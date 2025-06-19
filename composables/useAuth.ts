import { useSupabaseClient, useSupabaseUser } from '#imports';
import { useUser } from '~/composables/useUser';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  /**
	 * Sign in with email and password
	 * @param email - User's email address
	 * @param password - User's password
	 * @returns Promise<{ success: boolean, error?: string }>
	 */
  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    }
    catch (err: unknown) {
      console.error('Sign in error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to sign in',
      };
    }
  };

  /**
	 * Sign up with email and password
	 * @param email - User's email address
	 * @param password - User's password
	 * @param confirmPassword - Password confirmation
	 * @returns Promise<{ success: boolean, error?: string }>
	 */
  const signUp = async (email: string, password: string, confirmPassword: string) => {
    try {
      // Validation
      if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Get origin safely for SSR
      const origin = import.meta.client ? window.location.origin : '';

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true };
    }
    catch (err: unknown) {
      console.error('Sign up error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create account',
      };
    }
  };

  /**
	 * Sign in with Google OAuth
	 * @returns Promise<{ success: boolean, error?: string }>
	 */
  const signInWithGoogle = async () => {
    try {
      // Get origin safely for SSR
      const origin = import.meta.client ? window.location.origin : '';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true };
    }
    catch (err: unknown) {
      console.error('Google sign in error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to sign in with Google',
      };
    }
  };

  /**
	 * Sign out the current user
	 * Clears all authentication state
	 * Note: Navigation should be handled by the calling component
	 * @returns Promise<{ success: boolean, error?: string }>
	 */
  const signOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear user state from our composable
      const { clearUser } = await useUser(null);
      clearUser();

      // Clear any other local storage or state if needed
      if (import.meta.client) {
        // Clear any additional auth-related items from localStorage
        localStorage.removeItem('user-state');
      }

      return { success: true };
    }
    catch (err: unknown) {
      console.error('Sign out error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to sign out',
      };
    }
  };

  /**
	 * Check if user is currently authenticated
	 */
  const isAuthenticated = computed(() => !!user.value);

  return {
    // Authentication methods
    signInWithEmail,
    signUp,
    signInWithGoogle,
    signOut,

    // State
    isAuthenticated,
    user: readonly(user),
  };
};
