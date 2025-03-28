import { generateApiRequestSchema } from "@/lib/schemas";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, wrapLanguageModel, type LanguageModelV1Middleware } from "ai";
import { NextResponse } from "next/server";

// Max request size in bytes (35 KB) - maintaining consistency
const MAX_REQUEST_SIZE = 35 * 1024;

// Initialize the Google Generative AI provider
const googleBase = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

// Create a fallback middleware
const fallbackMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    try {
      return await doGenerate();
    } catch (error) {
      console.warn("Primary model failed, falling back to gemini-2.5-pro-exp-03-25:", error);

      // Create the fallback model
      const fallbackModel = googleBase("gemini-2.5-pro-exp-03-25");

      // Call the fallback model with the same parameters
      return await fallbackModel.doGenerate(params);
    }
  },

  wrapStream: async ({ doStream, params }) => {
    try {
      return await doStream();
    } catch (error) {
      console.warn(
        "Primary model failed in streaming, falling back to gemini-2.5-pro-exp-03-25:",
        error
      );

      // Create the fallback model
      const fallbackModel = googleBase("gemini-2.5-pro-exp-03-25");

      // Call the fallback model with the same parameters
      return await fallbackModel.doStream(params);
    }
  },
};

// Create our primary model with fallback middleware
const primaryModel = googleBase("gemini-1.5-pro");
const modelWithFallback = wrapLanguageModel({
  model: primaryModel,
  middleware: fallbackMiddleware,
});

export async function POST(request: Request) {
  try {
    // Check request size before parsing
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: `Request too large. Maximum size is ${MAX_REQUEST_SIZE / 1024}KB` },
        { status: 413 } // 413 Payload Too Large
      );
    }

    const body = await request.json();

    // Validate request body with Zod
    const validationResult = generateApiRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { srtContent } = validationResult.data;

    // Create a system prompt that explains what we want from the model
    const systemPrompt = `
      You are a tool that analyzes video/audio transcripts from SRT files.
      Your task is to identify key moments and create meaningful timestamps or chapter markers.
      For each important moment or topic change, provide:
      
      1. A timestamp (in format HH:MM:SS)
      2. A concise title/description (5-7 words)
      
      Format your response exactly like this:
      
      00:00:00 - Introduction to the Video
      00:01:15 - First Important Topic
      00:03:42 - Next Key Point Discussed
      
      IMPORTANT: The first timestamp MUST start with 00:00:00 as this is required for YouTube chapters to work properly.
      
      Identify 5-10 meaningful timestamps throughout the content.
      Focus on topic changes, key arguments, or significant moments.
      Do not add any markdown formatting, headings, or additional text - just the timestamps in the format shown above.
    `;

    // Use the model with fallback middleware
    const { textStream } = streamText({
      model: modelWithFallback,
      prompt: `${systemPrompt}\n\nHere is the transcript content from an SRT file. Please analyze it and generate meaningful timestamps with summaries:\n\n${srtContent}`,
      temperature: 0.7,
      maxTokens: 1500,
    });

    return new Response(textStream);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
