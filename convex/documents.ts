import { action, internalQuery, internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";


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
    args: { embedding: v.array(v.float64()) },
    handler: async (ctx, args) => {

        // Perform vector search in Convex
        const results = await ctx.vectorSearch("documents", "by_embedding", {
            vector: args.embedding || [],
            limit: 3,
        });

        if (results.length === 0) {
            return "No relevant documents found.";
        }

        // Fetch the actual text content
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
