import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import { ChatStatus, type Chat } from '~/server/types';

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

	const supabase = await serverSupabaseClient<Chat>(event);

	// Get all chats for this user and case
	const { data: chats, error } = await supabase
		.from('chats')
		.select('*')
		.eq('user_id', user.id)
		.eq('case_id', caseId)
		.order('created_at', { ascending: false });

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch chat status',
		});
	}

	const allChats = chats || [];

	// Find active chat (created or in progress)
	const activeChat = allChats.find(chat =>
		chat.is_archived === false,
	);

	// Check if there's any chat history
	const hasHistory = allChats.length > 0;
	const hasCompletedHistory = allChats.some(chat =>
		chat.is_archived === true,
	);

	let lastActiveChat = null;

	if (!activeChat) {
		lastActiveChat = allChats.find(chat =>
			chat.is_archived === true && [ChatStatus.SUBMITTED, ChatStatus.PASSED, ChatStatus.CAN_BE_IMPROVED, ChatStatus.NOT_PASSED].includes(chat.status),
		);
	}

	return {
		activeChat: activeChat || lastActiveChat,
		hasHistory,
		hasCompletedHistory,
		totalChats: allChats.length,
	};
});
