import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMessage = mutation({
  args: { sessionId: v.string(), userId: v.id("users"), role: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("conversations").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).first();
    const message = { role: args.role, content: args.content, timestamp: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, { messages: [...existing.messages, message] });
      return existing._id;
    }
    return await ctx.db.insert("conversations", { userId: args.userId, sessionId: args.sessionId, messages: [message], agentPhase: "preference", createdAt: Date.now() });
  },
});

export const getConversation = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => await ctx.db.query("conversations").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).first(),
});

export const updateAgentPhase = mutation({
  args: { sessionId: v.string(), phase: v.string() },
  handler: async (ctx, args) => {
    const conv = await ctx.db.query("conversations").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).first();
    if (conv) await ctx.db.patch(conv._id, { agentPhase: args.phase });
  },
});
