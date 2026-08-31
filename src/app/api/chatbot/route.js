import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '@/data/chatbot-prompt';

export const runtime = 'edge';

export async function POST(req) {
  try {
    // Initialize inside the request handler to avoid Edge runtime build errors
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Convert message history to a flat string transcript for the Interactions API
    const input = messages.map(msg => 
      `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`
    ).join('\n\n') + '\n\nAssistant:';

    // Start a streaming chat session using the Interactions API
    const responseStream = await ai.interactions.create({
      model: 'gemini-3.5-flash-lite',
      input: input,
      system_instruction: SYSTEM_PROMPT,
      stream: true,
    });

    // Create a ReadableStream to stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of responseStream) {
            if (event.event_type === "step.delta" && event.delta && event.delta.type === "text") {
              if (event.delta.text) {
                controller.enqueue(new TextEncoder().encode(event.delta.text));
              }
            }
          }
        } catch (error) {
          console.error('Error during streaming:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
