import { action, internalQuery, internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";
import { generateEmbeddings } from "@/lib/ai/embedding";


const openai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });


export const ingest = mutation({
    args: { embeddings: v.array(v.object({ embedding: v.array(v.float64()), content: v.string() })) },
    handler: async (ctx, args) => {
        // Save to database (call internal mutation)
        args.embeddings.map(async ({ embedding, content }) =>
            await ctx.runMutation(internal.documents.saveDocument, {
                text: content,
                embedding,
            }))
    },
});

export const saveDocument = internalMutation({
    args: { text: v.string(), embedding: v.array(v.float64()) },
    handler: async (ctx, args) => {
        await ctx.db.insert("documents", {
            text: args.text,
            embedding: args.embedding,
            metadata: {
                ingestedAt: new Date().toISOString(),
            },
        });
    },
});

export const search = action({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        // 1. Embed the user's query
        console.log('searching for', args.query);
        const response = await openai.models.embedContent({
            model: "gemini-embedding-001",
            contents: args.query,
            config: {
                outputDimensionality: 1536,
                taskType: 'SEMANTIC_SIMILARITY'
            }
        });

        const embeddings = response.embeddings?.filter(e => e.values)[0].values;

        console.log('embeddings', embeddings);


        // 2. Perform vector search in Convex
        const results = await ctx.vectorSearch("documents", "by_embedding", {
            vector: embeddings || [],
            limit: 3,
        });

        if (results.length === 0) {
            return "No relevant documents found.";
        }

        // 3. Fetch the actual text content
        const descriptions: Awaited<ReturnType<typeof ctx.runQuery>>[] = await Promise.all(
            results.map((result) => ctx.runQuery(internal.documents.getDocument, { id: result._id }))
        );

        return descriptions.map((d) => d?.text).join("\n\n");
    },
});

export const getDocument = internalQuery({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
