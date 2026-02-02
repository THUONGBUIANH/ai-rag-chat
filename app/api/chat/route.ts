
import {
    convertToModelMessages,
    stepCountIs,
    streamText,
    tool,
    UIMessage
} from 'ai';

import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { generateEmbeddings } from '@/lib/ai/embedding';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: google('gemini-2.0-flash'),
        messages: await convertToModelMessages(messages),
        stopWhen: stepCountIs(5),
        system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
        tools: {
            addResource: tool({
                description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
                inputSchema: z.object({
                    content: z
                        .string()
                        .describe('the content or resource to add to the knowledge base'),
                }),
                execute: async ({ content }) => {
                    const embeddings = await generateEmbeddings(content);
                    await fetchMutation(api.documents.ingest, { embeddings });
                },
            }),

        }
    });



    return result.toUIMessageStreamResponse();
}