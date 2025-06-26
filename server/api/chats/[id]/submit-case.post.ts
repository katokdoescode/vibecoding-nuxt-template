import { generateText } from 'ai';
import { z } from 'zod';
import { requireAuth } from '~/server/utils/requireAuth';
import { serverSupabaseServiceRole } from '#supabase/server';
import { caseAssessmentPrompt, replaceTemplateVars } from '~/server/utils/prompts';
import type { Chat, Message } from '~/server/types';

// Zod schema for assessment response from AI
const assessmentResponseSchema = z.object({
	assessment_percentage: z.number().min(0).max(100),
	detailed_feedback: z.object({
		strengths: z.array(z.string()),
		areas_for_improvement: z.array(z.string()),
		growth_points: z.array(z.string()),
		reached_goals: z.array(z.string()),
		overall_performance: z.string(),
	}),
	criteria_analysis: z.record(z.object({
		score_percentage: z.number().min(0).max(100),
		feedback: z.string(),
	})),
	recommendations: z.array(z.string()),
	assessment_rationale: z.string(),
});

export default defineEventHandler(async (event): Promise<Chat> => {
	const user = await requireAuth(event);
	const chatIdParam = getRouterParam(event, 'id');

	if (!chatIdParam) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Chat ID is required',
		});
	}

	const chatId = parseInt(chatIdParam);
	if (isNaN(chatId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid chat ID',
		});
	}

	const { openaiApiKey } = useRuntimeConfig();

	if (!openaiApiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'OpenAI API key not configured',
		});
	}

	const supabase = serverSupabaseServiceRole<{
		chats: Chat[];
	}>(event);

	try {
		// Get chat details with case, agent, and criteria information
		const { data: chatData, error: chatError } = await supabase
			.from('chats')
			.select(`
				*,
				case_id:cases!inner(
					id,
					title,
					description,
					story,
					criteria_outcomes,
					agent_id:agents!inner(
						id,
						name,
						position,
						prompt
					)
				)
			`)
			.eq('id', chatId)
			.eq('user_id', user.id)
			.single();

		if (chatError || !chatData) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Chat not found or access denied',
			});
		}

		// Check if already submitted
		if (chatData.status === 'submitted' || chatData.status === 'passed' || chatData.status === 'can_be_improved' || chatData.status === 'not_passed') {
			throw createError({
				statusCode: 400,
				statusMessage: 'Case has already been submitted',
			});
		}

		const messages = (chatData.messages as Message[]) || [];
		const criteriaOutcomes = chatData.case_id.criteria_outcomes;

		// Build conversation history for assessment
		const conversationHistory = messages.map(msg =>
			`${msg.type === 'user' ? 'Student' : chatData.case_id.agent_id.name || 'Agent'}: ${msg.text}`,
		).join('\n\n');

		// Prepare the templated assessment prompt
		const assessmentPromptText = replaceTemplateVars(caseAssessmentPrompt, {
			caseTitle: chatData.case_id.title || 'Case Study',
			caseDescription: chatData.case_id.description || '',
			caseStory: chatData.case_id.story || '',
			criteriaOutcomes: criteriaOutcomes
				? JSON.stringify(criteriaOutcomes, null, 2)
				: 'General case study competencies',
			conversationHistory: conversationHistory || 'No conversation history available.',
		});

		// Generate comprehensive assessment
		const { text: assessmentResponse } = await generateText({
			model: 'openai/gpt-4o-mini',
			prompt: assessmentPromptText,
		});

		// Parse the AI assessment response
		let assessmentData;
		try {
			// Extract JSON from the response (in case there's extra text)
			const jsonMatch = assessmentResponse.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No JSON found in assessment response');
			}
			const rawAssessment = JSON.parse(jsonMatch[0]);

			// Validate using Zod schema
			assessmentData = assessmentResponseSchema.parse(rawAssessment);
		}
		catch (parseError) {
			// Extract only serializable properties from error for logging
			const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
			console.error('Failed to parse assessment JSON:', { message: errorMessage });
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to parse assessment results',
			});
		}

		const assessmentPercentage = Math.max(0, Math.min(100, assessmentData.assessment_percentage));

		// Determine status based on assessment percentage
		let newStatus: string;
		if (assessmentPercentage < 20) {
			newStatus = 'not_passed';
		}
		else if (assessmentPercentage <= 70) {
			newStatus = 'can_be_improved';
		}
		else {
			newStatus = 'passed';
		}

		// Update chat with assessment results
		const { data: updateData, error: updateError } = await supabase
			.from('chats')
			.update({
				status: newStatus,
				assessment: assessmentPercentage,
				learning_outcomes: assessmentData,
				is_archived: true,
			})
			.eq('id', chatId)
			.select()
			.single();

		if (updateError) {
			// Extract only serializable properties from error for logging
			const errorMessage = updateError?.message || String(updateError);
			console.error('Failed to update chat with assessment:', { message: errorMessage });
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to save assessment results',
			});
		}

		// Return structured response
		return updateData;
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorStatus = error && typeof error === 'object' && 'statusCode' in error ? error.statusCode : undefined;
		console.error('Error in case assessment:', { message: errorMessage, status: errorStatus });

		if (error && typeof error === 'object' && 'statusCode' in error) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			statusMessage: `Assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
		});
	}
});
