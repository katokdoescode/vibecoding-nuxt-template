import { computed, onMounted, watch } from 'vue';
import type { User } from '@supabase/supabase-js';

interface UserState {
	user: User | null;
	data: unknown;
	loading: boolean;
	error: Error | null;
}

const USER_STORAGE_KEY = 'user-state';

export const useUser = async (user: User | null) => {
	const state = useState<UserState>('user', () => ({
		user: user || null,
		data: null,
		loading: true,
		error: null,
	}));

	// Initialize from localStorage on client side
	onMounted(async () => {
		try {
			const stored = localStorage.getItem(USER_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				state.value = {
					...state.value,
					user: parsed.user,
					data: parsed.data,
					loading: false,
				};
			}
			else {
				state.value.data = null;
				state.value.loading = false;
				state.value.error = null;
				state.value.user = user || null;
			}
		}
		catch (error) {
			console.error('Error loading user from storage:', error);
			state.value.data = null;
			state.value.loading = false;
		}
	});

	// Watch for changes and sync to localStorage
	watch(
		() => state.value,
		(newState) => {
			if (import.meta.client) {
				localStorage.setItem(
					USER_STORAGE_KEY,
					JSON.stringify(newState),
				);
			}
		},
		{ deep: true },
	);

	const setUser = (user: User | null) => {
		state.value.user = user;
		state.value.error = null;
	};

	const clearUser = () => {
		state.value.user = null;
		state.value.error = null;
		if (import.meta.client) {
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	};

	const setError = (error: Error) => {
		state.value.error = error;
	};

	const setData = (data: unknown) => {
		state.value.data = data;
	};

	return {
		// State
		user: computed(() => state.value.user),
		loading: computed(() => state.value.loading),
		error: computed(() => state.value.error),
		data: computed(() => state.value.data),

		// Methods
		setUser,
		clearUser,
		setError,
		setData,
		// Computed
		isAuthenticated: computed(() => !!state.value.user),
	};
};
