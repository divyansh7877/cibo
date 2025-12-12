import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const savePreferences = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
    preferences: v.object({
      cuisine: v.optional(v.array(v.string())),
      budget: v.optional(v.string()),
      dietaryRestrictions: v.optional(v.array(v.string())),
      groupSize: v.optional(v.number()),
      spiceLevel: v.optional(v.string()),
      occasion: v.optional(v.string()),
      location: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("preferences", {
      userId: args.userId,
      sessionId: args.sessionId,
      ...args.preferences,
      createdAt: Date.now(),
    });
  },
});

export const getPreferencesBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("preferences")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});
