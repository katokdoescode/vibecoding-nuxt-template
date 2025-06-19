import type { H3Event } from 'h3';
import { serverSupabaseClient } from '#supabase/server';

export async function requireAuth(event: H3Event) {
	const supabase = await serverSupabaseClient(event);
	const { data: { user }, error } = await supabase.auth.getUser();

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
			data: { error: error?.message || 'Auth session missing!' },
		});
	}

	return user;
}
