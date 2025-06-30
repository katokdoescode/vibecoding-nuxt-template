import type { User } from '@supabase/supabase-js';
import type { Database } from '~/database.types';

export type RawCase = Database['public']['Tables']['cases']['Row'];
export type Agent = Database['public']['Tables']['agents']['Row'];
export type RawChat = Database['public']['Tables']['chats']['Row'];

export type Message = {
	type: 'user' | 'agent';
	text: string;
	timestamp: string;
};

export type LearningOutcomes = {
	recommendations: string[];
	criteria_analysis: {
		initiative_taken: {
			feedback: string;
			score_percentage: number;
		};
		communication_style: {
			feedback: string;
			score_percentage: number;
		};
		awareness_of_team_dynamics: {
			feedback: string;
			score_percentage: number;
		};
	};
	detailed_feedback: {
		strengths: string[];
		growth_points: string[];
		reached_goals: string[];
		overall_performance: string;
		areas_for_improvement: string[];
	};
	assessment_rationale: string;
	assessment_percentage: number;
};

export type CompetencyFeedback = {
	description: string;
	negative_feedback: string;
	positive_feedback: string;
};

export type CriteriaOutcomes = {
	prioritization_skill: CompetencyFeedback;
	stakeholder_management: CompetencyFeedback;
	technical_team_leadership: CompetencyFeedback;
};

export enum ChatStatus {
	CREATED = 'created',
	IN_PROGRESS = 'in progress',
	SUBMITTED = 'submitted',
	COMPLETED = 'completed',
	NOT_PASSED = 'not_passed',
	PASSED = 'passed',
	CAN_BE_IMPROVED = 'can_be_improved',
}

export type Case = Omit<RawCase, 'criteria_outcomes' | 'agent_id'> & {
	criteria_outcomes: CriteriaOutcomes | null;
	agent_id: Agent | null;
};

export type Chat = Omit<RawChat, 'learning_outcomes' | 'messages' | 'status'> & {
	learning_outcomes: LearningOutcomes | null;
	messages: Message[];
	status: ChatStatus;
};

export type ExtendedChat = Omit<Chat, 'case_id' | 'agent_id' | 'user_id'> & {
	case_id: Case;
	agent_id: Agent;
	user_id: User;
};

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
