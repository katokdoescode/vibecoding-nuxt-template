export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never
		};
		Views: {
			[_ in never]: never
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never
		};
		CompositeTypes: {
			[_ in never]: never
		};
	};
	public: {
		Tables: {
			agents: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					position: string | null;
					prompt: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					id?: string;
					name: string;
					position?: string | null;
					prompt?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					position?: string | null;
					prompt?: string | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
			cases: {
				Row: {
					agent: string | null;
					can_be_done_after: string | null;
					created_at: string;
					criteria_outcomes: Json | null;
					description: string | null;
					difficulty: number | null;
					id: string;
					is_public: boolean;
					slug: string;
					story: string | null;
					tags: string[];
					title: string | null;
					user_id: string | null;
				};
				Insert: {
					agent?: string | null;
					can_be_done_after?: string | null;
					created_at?: string;
					criteria_outcomes?: Json | null;
					description?: string | null;
					difficulty?: number | null;
					id?: string;
					is_public?: boolean;
					slug?: string;
					story?: string | null;
					tags?: string[];
					title?: string | null;
					user_id?: string | null;
				};
				Update: {
					agent?: string | null;
					can_be_done_after?: string | null;
					created_at?: string;
					criteria_outcomes?: Json | null;
					description?: string | null;
					difficulty?: number | null;
					id?: string;
					is_public?: boolean;
					slug?: string;
					story?: string | null;
					tags?: string[];
					title?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'cases_agent_fkey';
						columns: ['agent'];
						isOneToOne: false;
						referencedRelation: 'agents';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'cases_can_be_done_after_fkey';
						columns: ['can_be_done_after'];
						isOneToOne: false;
						referencedRelation: 'cases';
						referencedColumns: ['id'];
					},
				];
			};
			chats: {
				Row: {
					agent_id: string | null;
					assessment: number | null;
					case_id: string | null;
					created_at: string;
					id: number;
					is_archived: boolean;
					learning_outcomes: Json | null;
					messages: Json[];
					status: string;
					user_id: string | null;
					user_rating: number | null;
				};
				Insert: {
					agent_id?: string | null;
					assessment?: number | null;
					case_id?: string | null;
					created_at?: string;
					id?: number;
					is_archived?: boolean;
					learning_outcomes?: Json | null;
					messages?: Json[];
					status?: string;
					user_id?: string | null;
					user_rating?: number | null;
				};
				Update: {
					agent_id?: string | null;
					assessment?: number | null;
					case_id?: string | null;
					created_at?: string;
					id?: number;
					is_archived?: boolean;
					learning_outcomes?: Json | null;
					messages?: Json[];
					status?: string;
					user_id?: string | null;
					user_rating?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'chats_agent_id_fkey';
						columns: ['agent_id'];
						isOneToOne: false;
						referencedRelation: 'agents';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'chats_case_id_fkey';
						columns: ['case_id'];
						isOneToOne: false;
						referencedRelation: 'cases';
						referencedColumns: ['id'];
					},
				];
			};
			subscriptions: {
				Row: {
					created_at: string;
					current_period_end: string | null;
					current_period_start: string | null;
					id: string;
					plan: Database['public']['Enums']['subscription_type'];
					status: string;
					stripe_customer_id: string | null;
					stripe_price_id: string | null;
					stripe_subscription_id: string | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					current_period_end?: string | null;
					current_period_start?: string | null;
					id?: string;
					plan?: Database['public']['Enums']['subscription_type'];
					status?: string;
					stripe_customer_id?: string | null;
					stripe_price_id?: string | null;
					stripe_subscription_id?: string | null;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					current_period_end?: string | null;
					current_period_start?: string | null;
					id?: string;
					plan?: Database['public']['Enums']['subscription_type'];
					status?: string;
					stripe_customer_id?: string | null;
					stripe_price_id?: string | null;
					stripe_subscription_id?: string | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never
		};
		Functions: {
			[_ in never]: never
		};
		Enums: {
			subscription_type: 'free' | 'pro';
		};
		CompositeTypes: {
			[_ in never]: never
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
	| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
	| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
		Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
			? R
			: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
		DefaultSchema['Views'])
		? (DefaultSchema['Tables'] &
			DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
				? R
				: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
	| keyof DefaultSchema['Tables']
	| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
		Insert: infer I;
	}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
		}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
	| keyof DefaultSchema['Tables']
	| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
		Update: infer U;
	}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
		}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
	| keyof DefaultSchema['Enums']
	| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
	| keyof DefaultSchema['CompositeTypes']
	| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			subscription_type: ['free', 'pro'],
		},
	},
} as const;
