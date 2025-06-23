import { serverSupabaseClient } from '#supabase/server';
import { requireAuth } from '~/server/utils/requireAuth';
import type { Database } from '~/database.types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const body = await readBody(event);

	const { case_id, agent_id, force_new = false } = body;

	if (!case_id || !agent_id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'case_id and agent_id are required',
		});
	}

	const supabase = await serverSupabaseClient<Database>(event);

	// If not forcing new chat, check if there's an existing active chat (not assessed)
	if (!force_new) {
		const { data: existingChat } = await supabase
			.from('chats')
			.select('*')
			.eq('user_id', user.id)
			.eq('case_id', case_id)
			.not('status', 'in', '(submitted,passed,can_be_improved,not_passed)')
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		if (existingChat) {
			return existingChat;
		}
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
