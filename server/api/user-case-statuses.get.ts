import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';

export default defineEventHandler(async (event) => {
	try {
		const user = await requireAuth(event);
		const supabase = await serverSupabaseClient<Database>(event);

		// Fetch all chats for the current user
		const { data: chats, error } = await supabase
			.from('chats')
			.select('case_id, status, id')
			.eq('user_id', user.id);

		if (error) {
			console.error('Error fetching user case statuses:', error);
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch case statuses',
			});
		}

		// Create a map of case_id to chat status
		const caseStatuses: Record<string, { status: string; chatId: number }> = {};

		if (chats) {
			chats.forEach((chat) => {
				if (chat.case_id) {
					caseStatuses[chat.case_id] = {
						status: chat.status,
						chatId: chat.id,
					};
				}
			});
		}

		return caseStatuses;
	}
	catch (error) {
		console.error('Error in user-case-statuses endpoint:', error);

		// If it's already an H3 error, re-throw it
		if (error && typeof error === 'object' && 'statusCode' in error) {
			throw error;
		}

		// For other errors, return empty object to prevent breaking the UI
		return {};
	}
});
