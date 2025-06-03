import OpenAI, { toFile } from 'openai';
import { defineEventHandler, readMultipartFormData } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const fileField = form?.find(f => f.name === 'file');

  if (!fileField || !fileField.data) {
    return { error: 'Missing audio file.' };
  }

  const config = useRuntimeConfig();
  const apiKey = config.openaiApiKey;
  if (!apiKey) {
    return { error: 'OpenAI API key not set.' };
  }

  const openai = new OpenAI({ apiKey });

  // fileField.data is a Buffer, fileField.filename is the name
  const file = await toFile(fileField.data, fileField.filename || 'audio.webm');

  try {
    const response = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'text',
    });
    return { text: response };
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message || 'Failed to transcribe audio.' };
    }

    return { error: 'Failed to transcribe audio.' };
  }
});
