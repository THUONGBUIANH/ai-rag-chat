import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    text: v.string(),
    embedding: v.array(v.float64()), // Vector embedding
    metadata: v.any(), 
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 3072, // Google Gemini embedding dimensions
  }),
});
