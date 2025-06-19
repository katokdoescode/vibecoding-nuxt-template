import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { requireAuth } from '~/server/utils/requireAuth';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~/database.types';
import type { Message } from '~/server/types';

const submitCaseSchema = z.object({
	finalReflection: z.string().optional(),
});

export default defineEventHandler(async (event) => {
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

	const body = await readBody(event);
	const { finalReflection } = submitCaseSchema.parse(body);

	const { openaiApiKey } = useRuntimeConfig();

	if (!openaiApiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'OpenAI API key not configured',
		});
	}

	const supabase = serverSupabaseServiceRole<Database>(event);

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
			`${msg.type === 'user' ? 'Student' : chatData.case_id.agent_id.name}: ${msg.text}`,
		).join('\n\n');

		// Create comprehensive assessment prompt based on the rubric pipeline
		const assessmentPrompt = `You are an expert educational assessor conducting a comprehensive case study evaluation.

CASE CONTEXT:
Title: ${chatData.case_id.title}
Description: ${chatData.case_id.description}
Story: ${chatData.case_id.story}

LEARNING OUTCOMES & CRITERIA:
${criteriaOutcomes ? JSON.stringify(criteriaOutcomes, null, 2) : 'General case study competencies'}

CONVERSATION HISTORY:
${conversationHistory}

${finalReflection ? `STUDENT'S FINAL REFLECTION:\n${finalReflection}\n` : ''}

ASSESSMENT FRAMEWORK:
Following evidence-based rubric development principles, conduct a holistic assessment that includes:

1. ANALYTICAL RUBRIC EVALUATION:
   - Assess each learning outcome/criteria systematically
   - Use descriptors ranging from exemplary (90-100%) to inadequate (0-20%)
   - Consider: understanding, application, analysis, synthesis, evaluation

2. COMPREHENSIVE FEEDBACK ANALYSIS:
   • BAD POINTS/AREAS FOR IMPROVEMENT: Identify specific weaknesses, misconceptions, or missed opportunities
   • REACHED GOALS/STRENGTHS: Highlight demonstrated competencies and successful applications
   • GROWTH POINTS: Suggest specific areas for development and next steps
   • OVERALL PERFORMANCE: Holistic view of student's engagement and learning

3. EVIDENCE-BASED SCORING:
   - Analyze student responses against learning objectives
   - Consider depth of understanding, critical thinking, and practical application
   - Weight different aspects based on case complexity and learning goals

Provide your assessment in this EXACT JSON format:
{
  "assessment_percentage": <number between 0-100>,
  "detailed_feedback": {
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "areas_for_improvement": ["<improvement 1>", "<improvement 2>", ...],
    "growth_points": ["<growth point 1>", "<growth point 2>", ...],
    "reached_goals": ["<goal 1>", "<goal 2>", ...],
    "overall_performance": "<comprehensive performance summary>"
  },
  "criteria_analysis": {
    "<criteria_name>": {
      "score_percentage": <0-100>,
      "feedback": "<specific feedback for this criteria>"
    }
  },
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...],
  "assessment_rationale": "<explanation of how the percentage was determined>"
}

Be thorough, fair, and constructive in your assessment. The percentage should reflect genuine learning achievement against the established criteria.`;

		// Create OpenAI client
		const openai = createOpenAI({
			apiKey: openaiApiKey,
		});

		// Generate comprehensive assessment
		const { text: assessmentResponse } = await generateText({
			model: openai('gpt-4-turbo'),
			prompt: assessmentPrompt,
			maxTokens: 2000,
			temperature: 0.3, // Lower temperature for more consistent assessment
		});

		// Parse the AI assessment response
		let assessmentData;
		try {
			// Extract JSON from the response (in case there's extra text)
			const jsonMatch = assessmentResponse.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No JSON found in assessment response');
			}
			assessmentData = JSON.parse(jsonMatch[0]);
		}
		catch (parseError) {
			console.error('Failed to parse assessment JSON:', parseError);
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to parse assessment results',
			});
		}

		const assessmentPercentage = Math.max(0, Math.min(100, assessmentData.assessment_percentage || 0));

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

		// Create assessment summary message for the chat
		const assessmentSummary = `## Assessment Complete! 🎓

**Overall Score: ${assessmentPercentage}%**
**Status: ${newStatus.replace('_', ' ').toUpperCase()}**

### Strengths:
${assessmentData.detailed_feedback.strengths.map((s: string) => `• ${s}`).join('\n')}

### Areas for Improvement:
${assessmentData.detailed_feedback.areas_for_improvement.map((a: string) => `• ${a}`).join('\n')}

### Growth Points:
${assessmentData.detailed_feedback.growth_points.map((g: string) => `• ${g}`).join('\n')}

### Overall Performance:
${assessmentData.detailed_feedback.overall_performance}

### Recommendations:
${assessmentData.recommendations.map((r: string) => `• ${r}`).join('\n')}`;

		// Add assessment message to chat
		const assessmentMessage: Message = {
			type: 'agent',
			text: assessmentSummary,
			timestamp: new Date().toISOString(),
		};

		const updatedMessages = [...messages, assessmentMessage];

		// Update chat with assessment results
		const { error: updateError } = await supabase
			.from('chats')
			.update({
				status: newStatus,
				assessment: assessmentPercentage,
				messages: updatedMessages,
				learning_outcomes: assessmentData,
			})
			.eq('id', chatId);

		if (updateError) {
			console.error('Failed to update chat with assessment:', updateError);
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to save assessment results',
			});
		}

		return {
			success: true,
			assessment_percentage: assessmentPercentage,
			status: newStatus,
			detailed_feedback: assessmentData.detailed_feedback,
			message: 'Case successfully assessed and submitted!',
		};
	}
	catch (error) {
		console.error('Error in case assessment:', error);

		if (error && typeof error === 'object' && 'statusCode' in error) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			statusMessage: `Assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
		});
	}
});
