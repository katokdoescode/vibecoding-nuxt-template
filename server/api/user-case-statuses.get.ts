import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	try {
		const supabase = await serverSupabaseClient<Database>(event);

		// Fetch all chats for the current user, ordered by creation date
		const { data: chats, error } = await supabase
			.from('chats')
			.select('case_id, status, id, created_at')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching user case statuses:', error);
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch case statuses',
			});
		}

		// Create a map of case_id to the most relevant chat status
		const caseStatuses: Record<string, { status: string; chatId: number }> = {};

		if (chats) {
			// Group chats by case_id using a plain object instead of Map
			const chatsByCase: Record<string, typeof chats> = {};

			chats.forEach((chat) => {
				if (chat.case_id) {
					if (!chatsByCase[chat.case_id]) {
						chatsByCase[chat.case_id] = [];
					}
					chatsByCase[chat.case_id].push(chat);
				}
			});

			// For each case, determine the most relevant chat to show
			Object.entries(chatsByCase).forEach(([caseId, caseChats]) => {
				// First, look for incomplete chats (created, in progress)
				const incompleteChat = caseChats.find(chat =>
					['created', 'in progress'].includes(chat.status),
				);

				if (incompleteChat) {
					// Show the most recent incomplete chat
					caseStatuses[caseId] = {
						status: incompleteChat.status,
						chatId: incompleteChat.id,
					};
				}
				else {
					// No incomplete chats, show the most recent completed chat
					const mostRecentChat = caseChats[0]; // Already ordered by created_at desc
					if (mostRecentChat) {
						caseStatuses[caseId] = {
							status: mostRecentChat.status,
							chatId: mostRecentChat.id,
						};
					}
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
