import { serverSupabaseClient } from '#supabase/server';
import type { Case } from '~/server/types';

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, 'slug');

	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is required',
		});
	}

	const supabase = await serverSupabaseClient<{
		cases: Case[];
	}>(event);

	const { data: studyCase, error } = await supabase
		.from('cases')
		.select('*, agent_id:agent(*)')
		.eq('slug', slug)
		.single();

	if (error) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Case not found',
		});
	}

	return studyCase;
});
