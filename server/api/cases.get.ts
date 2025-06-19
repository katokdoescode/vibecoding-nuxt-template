import { serverSupabaseClient } from '#supabase/server';
import type { Case } from '~/server/types';

export default defineEventHandler(async (event) => {
	const supabase = await serverSupabaseClient<{
		cases: Case[];
	}>(event);

	const { data: cases } = await supabase.from('cases').select().order('id', { ascending: true });
	return cases;
});
