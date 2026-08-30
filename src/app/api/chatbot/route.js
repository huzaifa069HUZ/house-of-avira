import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '@/data/chatbot-prompt';

// Initialize the Gemini API client
// Note: GoogleGenAI automatically picks up process.env.GEMINI_API_KEY if not explicitly passed
const ai = new GoogleGenAI({});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Prepare contents array for the SDK
    // The google/genai SDK expects { role: 'user' | 'model', parts: [{ text: '...' }] }
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Start a streaming chat session
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3, // Low temperature for factual consistency with policies
      }
    });

    // Create a ReadableStream to stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
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
