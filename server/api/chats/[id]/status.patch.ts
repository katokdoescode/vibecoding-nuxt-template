import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const chatIdParam = getRouterParam(event, 'id');
	const body = await readBody(event);

	const { status } = body;

	if (!chatIdParam || !status) {
		throw createError({
			statusCode: 400,
			statusMessage: 'chatId and status are required',
		});
	}

	const chatId = parseInt(chatIdParam);
	if (isNaN(chatId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid chat ID',
		});
	}

	const validStatuses = ['created', 'in progress', 'submitted'];
	if (!validStatuses.includes(status)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
		});
	}

	const supabase = await serverSupabaseClient<Database>(event);

	const { data: updatedChat, error } = await supabase
		.from('chats')
		.update({ status })
		.eq('id', chatId)
		.eq('user_id', user.id)
		.select()
		.single();

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to update chat status',
		});
	}

	return updatedChat;
});
