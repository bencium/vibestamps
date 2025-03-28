import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Initialize the Google Generative AI provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || ''
});

export async function POST(request: Request) {
  try {
    const { srtContent } = await request.json();
    
    if (!srtContent || typeof srtContent !== 'string') {
      return Response.json({ error: 'Invalid SRT content provided' }, { status: 400 });
    }

    // Create a system prompt that explains what we want from the model
    const systemPrompt = `
      You are a tool that analyzes video/audio transcripts from SRT files.
      Your task is to identify key moments and create meaningful timestamps or chapter markers.
      For each important moment or topic change, provide:
      
      1. A timestamp (in format HH:MM:SS)
      2. A concise title/description (5-7 words)
      3. A brief summary (1-2 sentences)
      
      Format your response like this:
      
      ## 00:01:15 - Introduction to the Topic
      Brief summary of what happens at this timestamp.
      
      ## 00:03:42 - Key Point Discussed
      Brief summary of the key point being made.
      
      Identify 5-10 meaningful timestamps throughout the content.
      Focus on topic changes, key arguments, or significant moments.
    `;

    // Use streamText function from Vercel AI SDK with Google model
    return streamText({
      model: google('gemini-1.5-pro'),
      prompt: `${systemPrompt}\n\nHere is the transcript content from an SRT file. Please analyze it and generate meaningful timestamps with summaries:\n\n${srtContent}`,
      temperature: 0.7,
      maxTokens: 1500
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
