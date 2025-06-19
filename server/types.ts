import type { User } from '@supabase/supabase-js';
import type { Database } from '~/database.types';

export type Case = Database['public']['Tables']['cases']['Row'];
export type Agent = Database['public']['Tables']['agents']['Row'];
export type Chat = Database['public']['Tables']['chats']['Row'];

export type ExtendedChat = Omit<Chat, 'case_id' | 'agent_id' | 'user_id'> & {
	case_id: Case;
	agent_id: Agent;
	user_id: User;
};
