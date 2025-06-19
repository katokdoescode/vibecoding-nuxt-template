import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const body = await readBody(event);

	const { case_id, agent_id } = body;

	if (!case_id || !agent_id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'case_id and agent_id are required',
		});
	}

	const supabase = await serverSupabaseClient<Database>(event);

	// Check if chat already exists for this user and case
	const { data: existingChat } = await supabase
		.from('chats')
		.select('*')
		.eq('user_id', user.id)
		.eq('case_id', case_id)
		.single();

	if (existingChat) {
		return existingChat;
	}

	// Create new chat
	const { data: newChat, error } = await supabase
		.from('chats')
		.insert({
			user_id: user.id,
			case_id,
			agent_id,
			status: 'created',
			messages: [],
		})
		.select()
		.single();

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to create chat',
		});
	}

	return newChat;
});
