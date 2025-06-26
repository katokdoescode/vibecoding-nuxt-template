import { generateText } from 'ai';
import { z } from 'zod';
import { requireAuth } from '~/server/utils/requireAuth';
import { serverSupabaseServiceRole } from '#supabase/server';
import { chatResponsePrompt, replaceTemplateVars } from '~/server/utils/prompts';
import type { Database } from '~/database.types';
import type { Message } from '~/server/types';

const generateResponseSchema = z.object({
	userMessage: z.string().min(1),
});

// Zod schema for the structured response
const generateResponseOutput = z.object({
	success: z.boolean(),
	message: z.string(),
	timestamp: z.string(),
	agent_name: z.string(),
});

type GenerateResponseOutput = z.infer<typeof generateResponseOutput>;

export default defineEventHandler(async (event): Promise<GenerateResponseOutput> => {
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
	const { userMessage } = generateResponseSchema.parse(body);

	const { openaiApiKey } = useRuntimeConfig();

	if (!openaiApiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.',
		});
	}

	const supabase = serverSupabaseServiceRole<Database>(event);

	try {
		// Get chat details with case and agent information
		const { data: chatData, error: chatError } = await supabase
			.from('chats')
			.select(`
				*,
				case_id:cases!inner(
					id,
					title,
					description,
					story,
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

		if (chatError) {
			// Extract only serializable properties from error for logging
			const errorMessage = chatError?.message || String(chatError);
			console.error('Database error fetching chat:', { message: errorMessage });
			throw createError({
				statusCode: 500,
				statusMessage: `Database error: ${chatError.message}`,
			});
		}

		if (!chatData) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Chat not found or you do not have access to it',
			});
		}

		// Get conversation history
		const messages = (chatData.messages as Message[]) || [];

		// Build conversation context
		const conversationHistory = messages.map(msg =>
			`${msg.type === 'user' ? 'User' : 'Agent'}: ${msg.text}`,
		).join('\n');

		// Prepare the templated prompt
		const systemPrompt = replaceTemplateVars(chatResponsePrompt, {
			agentName: chatData.case_id.agent_id.name || 'AI Assistant',
			agentPosition: chatData.case_id.agent_id.position || 'an AI assistant',
			agentPrompt: chatData.case_id.agent_id.prompt || 'Help the user with their case study.',
			caseTitle: chatData.case_id.title || 'Case Study',
			caseDescription: chatData.case_id.description || '',
			caseStory: chatData.case_id.story || '',
			conversationHistory: conversationHistory || 'No previous conversation.',
		});

		// Generate AI response
		const { text: aiResponse } = await generateText({
			model: 'google/gemini-2.0-flash-001',
			system: systemPrompt,
			prompt: `User: ${userMessage}`,
		});

		// Update the chat with the new agent message
		const timestamp = new Date().toISOString();
		const newMessage: Message = {
			type: 'agent',
			text: aiResponse,
			timestamp,
		};

		const updatedMessages = [...messages, newMessage];

		const { error: updateError } = await supabase
			.from('chats')
			.update({
				messages: updatedMessages,
			})
			.eq('id', chatId);

		if (updateError) {
			// Extract only serializable properties from error for logging
			const errorMessage = updateError?.message || String(updateError);
			console.error('Database error updating chat:', { message: errorMessage });
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to save agent response: ${updateError.message}`,
			});
		}

		// Return structured response
		return generateResponseOutput.parse({
			success: true,
			message: aiResponse,
			timestamp,
			agent_name: chatData.case_id.agent_id.name,
		});
	}
	catch (error) {
		// Extract only serializable properties from error for logging
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorStatus = error && typeof error === 'object' && 'statusCode' in error ? error.statusCode : undefined;
		console.error('Error generating AI response:', { message: errorMessage, status: errorStatus });

		// If it's already an H3 error, re-throw it
		if (error && typeof error === 'object' && 'statusCode' in error) {
			throw error;
		}

		// For other errors, provide more details
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`,
		});
	}
});
