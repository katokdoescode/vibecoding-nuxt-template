import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';
import type { Chat } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const chatIdParam = getRouterParam(event, 'id');
	const body = await readBody(event);

	const { message, type } = body;

	if (!chatIdParam || !message || !type) {
		throw createError({
			statusCode: 400,
			statusMessage: 'chatId, message and type are required',
		});
	}

	const chatId = parseInt(chatIdParam);
	if (isNaN(chatId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid chat ID',
		});
	}

	if (!['user', 'agent'].includes(type)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'type must be either "user" or "agent"',
		});
	}

	const supabase = await serverSupabaseClient<Database>(event);

	// Get current chat
	const { data: chat, error: fetchError } = await supabase
		.from('chats')
		.select('*')
		.eq('id', chatId)
		.eq('user_id', user.id)
		.single();

	if (fetchError || !chat) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Chat not found',
		});
	}

	// Add new message to messages array
	const newMessage = { type, text: message, timestamp: new Date().toISOString() };
	const updatedMessages = [...(chat.messages || []), newMessage];

	// Update status to "in progress" if this is the first user message
	const shouldUpdateStatus = chat.status === 'created' && type === 'user';

	const updateData: Partial<Chat> = {
		messages: updatedMessages,
	};

	if (shouldUpdateStatus) {
		updateData.status = 'in progress';
	}

	const { data: updatedChat, error: updateError } = await supabase
		.from('chats')
		.update(updateData)
		.eq('id', chatId)
		.select()
		.single();

	if (updateError) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to update chat',
		});
	}

	return updatedChat;
});
