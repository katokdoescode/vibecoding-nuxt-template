import { serverSupabaseClient } from '#supabase/server';
import type { ExtendedChat } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	const query = getQuery(event);

	const supabase = await serverSupabaseClient<{
		chat: ExtendedChat;
	}>(event);

	const caseId = query.case_id?.toString();

	if (!caseId) {
		return null;
	}

	const { data: chat } = await supabase
		.from('chats')
		.select('*, case_id(*), agent_id(*), user_id(*)')
		.eq('user_id', user.id)
		.eq('case_id', caseId)
		.single();

	return chat;
});
