import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { requireAuth } from '~/server/utils/requireAuth';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '~/database.types';
import type { Message } from '~/server/types';

const generateResponseSchema = z.object({
	userMessage: z.string().min(1),
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
		console.log('Fetching chat data for ID:', chatId, 'User ID:', user.id);

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
			console.error('Database error fetching chat:', chatError);
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

		console.log('Chat data retrieved successfully');

		// Get conversation history
		const messages = (chatData.messages as Message[]) || [];
		console.log('Current message count:', messages.length);

		// Build conversation context
		const conversationHistory = messages.map(msg =>
			`${msg.type === 'user' ? 'User' : 'Agent'}: ${msg.text}`,
		).join('\n');

		// Prepare the prompt with context
		const systemPrompt = `You are ${chatData.case_id.agent_id.name}, ${chatData.case_id.agent_id.position || 'an AI assistant'}.

Your role: ${chatData.case_id.agent_id.prompt || 'Help the user with their case study.'}

Case Context:
Title: ${chatData.case_id.title}
Description: ${chatData.case_id.description}
Story: ${chatData.case_id.story}

Previous conversation:
${conversationHistory}

Instructions:
- Stay in character as ${chatData.case_id.agent_id.name}
- Provide helpful, contextual responses based on the case study
- Be professional and supportive
- Draw from the case context when relevant
- Maintain continuity with the previous conversation`;

		// Create OpenAI client with API key
		const openai = createOpenAI({
			apiKey: openaiApiKey,
		});

		// Generate AI response
		const { text: aiResponse } = await generateText({
			model: openai('gpt-4-turbo'),
			system: systemPrompt,
			prompt: `User: ${userMessage}`,
			maxTokens: 1000,
			temperature: 0.7,
		});

		// Update the chat with the new agent message
		const newMessage: Message = {
			type: 'agent',
			text: aiResponse,
			timestamp: new Date().toISOString(),
		};

		const updatedMessages = [...messages, newMessage];

		const { error: updateError } = await supabase
			.from('chats')
			.update({
				messages: updatedMessages,
			})
			.eq('id', chatId);

		if (updateError) {
			console.error('Database error updating chat:', updateError);
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to save agent response: ${updateError.message}`,
			});
		}

		return {
			success: true,
			message: aiResponse,
		};
	}
	catch (error) {
		console.error('Error generating AI response:', error);

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
