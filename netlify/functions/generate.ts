import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, wrapLanguageModel, type LanguageModelV1Middleware } from 'ai';

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

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

// Simple validation function
function validateRequest(body: any): { success: boolean; data?: any; error?: string } {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }
  
  if (!body.srtContent || typeof body.srtContent !== 'string') {
    return { success: false, error: 'srtContent is required and must be a string' };
  }
  
  return { success: true, data: { srtContent: body.srtContent } };
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      } as { [key: string]: string },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      } as { [key: string]: string },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check request size
    const contentLength = event.headers['content-length'];
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return {
        statusCode: 413,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        } as { [key: string]: string },
        body: JSON.stringify({
          error: `Request too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB`
        }),
      };
    }

    const body = JSON.parse(event.body || '{}');

    // Validate request body
    const validationResult = validateRequest(body);

    if (!validationResult.success) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        } as { [key: string]: string },
        body: JSON.stringify({ error: validationResult.error }),
      };
    }

    const { srtContent } = validationResult.data;

    // Extract the last timestamp from the SRT content
    const timestampRegex = /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g;
    let maxTimestamp = "00:00:00";
    let match;

    // Find all timestamp pairs and get the latest end time
    while ((match = timestampRegex.exec(srtContent)) !== null) {
      const endTime = match[2]; // Second capture group is the end time
      // Convert to seconds for comparison
      const endTimeParts = endTime.split(/[,:]/);
      const endTimeSeconds =
        parseInt(endTimeParts[0]) * 3600 +
        parseInt(endTimeParts[1]) * 60 +
        parseInt(endTimeParts[2]) +
        parseInt(endTimeParts[3]) / 1000;

      const maxTimeParts = maxTimestamp.split(/[,:]/);
      const maxTimeSeconds =
        parseInt(maxTimeParts[0]) * 3600 +
        parseInt(maxTimeParts[1]) * 60 +
        parseInt(maxTimeParts[2] || "0") +
        parseInt(maxTimeParts[3] || "0") / 1000;

      if (endTimeSeconds > maxTimeSeconds) {
        // Format nicely for display: HH:MM:SS
        const hours = endTimeParts[0];
        const minutes = endTimeParts[1];
        const seconds = endTimeParts[2];

        // Keep only hours if non-zero, otherwise just show MM:SS
        maxTimestamp = hours !== "00" ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
      }
    }

    // Create more explicit constraints about the video end time
    const videoEndTimeInfo =
      maxTimestamp !== "00:00:00"
        ? `The video's maximum duration is ${maxTimestamp}. ANY TIMESTAMP BEYOND ${maxTimestamp} IS INVALID AND MUST NOT BE INCLUDED IN YOUR RESPONSE. Only generate timestamps within the range of 00:00 to ${maxTimestamp}.`
        : "";

    // Create the system prompt
    const systemPrompt = `
      # Enhanced Video Timestamp Generation with Smart Key Moment Detection

Generate precise, intelligent timestamps for video content with enhanced key moment detection and categorization.

**CRITICAL VIDEO LENGTH CONSTRAINT: ${videoEndTimeInfo}**

## Key Moment Detection Strategy

Analyze the transcript for these high-value moments:

### 🎬 **Structural Moments**
- **Opening Hook:** First 30 seconds - compelling introduction or teaser
- **Topic Transitions:** Clear shifts between major subjects (look for "now," "next," "let's move to")
- **Conclusions:** Summaries, takeaways, or wrap-up segments

### 🔥 **Content Peaks**
- **Demonstrations:** Hands-on examples, live coding, or practical applications
- **"Aha" Moments:** Key insights, breakthroughs, or important revelations
- **Problem-Solution Pairs:** When issues are identified and solutions provided
- **Visual Aids:** References to charts, diagrams, or on-screen elements

### 💡 **Learning Milestones**
- **Concept Introductions:** First mention of important terms or ideas
- **Complex Explanations:** Detailed breakdowns of difficult topics
- **Examples & Case Studies:** Real-world applications or scenarios
- **Tips & Best Practices:** Actionable advice or expert recommendations

### 🎯 **Engagement Signals**
- **Questions Posed:** Direct questions to audience or rhetorical queries
- **Emotional Language:** Excitement, emphasis, or passionate delivery
- **Interactive Elements:** Polls, calls-to-action, or audience participation
- **Surprising Information:** Unexpected facts, statistics, or revelations

## Enhanced Output Format

Generate 5-12 strategically selected timestamps with smart categorization:

🕒 Key moments:
00:00 [INTRO] Compelling opening hook
MM:SS [DEMO] Hands-on demonstration title
MM:SS [CONCEPT] Key concept explanation
MM:SS [TIP] Important best practice
MM:SS [EXAMPLE] Real-world application
MM:SS [CONCLUSION] Main takeaways

## Analysis Framework

1. **Video Length:** ${maxTimestamp} - NO TIMESTAMPS BEYOND THIS TIME

2. **Density Optimization:** 
   - Short videos (0-10 min): 3-6 timestamps
   - Medium videos (10-30 min): 5-9 timestamps  
   - Long videos (30+ min): 7-12 timestamps

3. **Smart Timing:** 
   - Prioritize moments 10-30 seconds BEFORE key content starts
   - Account for setup time in demonstrations
   - Target natural pause points in speech

4. **Description Quality:**
   - Lead with action verbs ("Building," "Explaining," "Demonstrating")
   - Include specific technologies/tools mentioned
   - Use present tense for immediacy
   - Maximum 6 words for mobile-friendly viewing

5. **Category Assignment:**
   - [INTRO] - Opening, introduction, overview
   - [DEMO] - Live demonstrations, hands-on examples
   - [CONCEPT] - Theory, explanations, definitions
   - [TIP] - Best practices, recommendations, advice
   - [EXAMPLE] - Case studies, real-world applications
   - [TOOL] - Software, technology, or resource introduction
   - [Q&A] - Questions, problems, troubleshooting
   - [CONCLUSION] - Summaries, wrap-up, next steps

6. **Quality Validation:**
   - Each timestamp must advance viewer understanding
   - Avoid redundant or overlapping content
   - Ensure logical progression through material
   - Verify timestamps capture the most valuable 15-20% of content

## Enhanced Example Output

\`\`\`
🕒 Key moments:
00:00 [INTRO] Welcome and project overview
02:45 [CONCEPT] Understanding API fundamentals
07:22 [DEMO] Building first API endpoint
12:18 [TIP] Authentication best practices
18:55 [EXAMPLE] Real-world use case
25:33 [TOOL] Introducing testing framework
31:07 [Q&A] Common debugging issues
37:42 [CONCLUSION] Next steps and resources
\`\`\`

Now analyze the transcript and generate intelligent timestamps with categories based on content value and viewer utility:

🕒 Key moments:
    `;

    // Use the model with fallback middleware
    const { textStream } = streamText({
      model: modelWithFallback,
      prompt: `${systemPrompt}\n\nHere is the transcript content from an SRT file. Please analyze it and generate meaningful timestamps with summaries:\n\n${srtContent}`,
      temperature: 0.1,
      maxTokens: 1500,
    });

    // Collect all chunks from the stream
    let fullText = '';
    for await (const chunk of textStream) {
      fullText += chunk;
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain; charset=utf-8',
      } as { [key: string]: string },
      body: fullText,
    };

  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      } as { [key: string]: string },
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};
