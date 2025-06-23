import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const query = getQuery(event);

	const caseId = query.case_id?.toString();

	if (!caseId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'case_id is required',
		});
	}

	const supabase = await serverSupabaseClient<Database>(event);

	// Get all chats for this user and case, ordered by creation date (newest first)
	const { data: chats, error } = await supabase
		.from('chats')
		.select('*')
		.eq('user_id', user.id)
		.eq('case_id', caseId)
		.order('created_at', { ascending: false });

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch chat history',
		});
	}

	return chats || [];
});
