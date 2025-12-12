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

export const seedPreferences = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("preferences").first();
    if (existing) return { message: "Preferences already seeded" };

    const users = await ctx.db.query("users").collect();
    if (users.length === 0) return { message: "No users found. Create a user first." };

    const samplePreferences = [
      {
        userId: users[0]._id,
        sessionId: `session_${Date.now()}_1`,
        cuisine: ["Thai", "Vietnamese"],
        budget: "medium",
        dietaryRestrictions: ["vegetarian"],
        groupSize: 2,
        spiceLevel: "medium",
        occasion: "casual dinner",
        location: "Manhattan",
        createdAt: Date.now() - 86400000,
      },
      {
        userId: users[0]._id,
        sessionId: `session_${Date.now()}_2`,
        cuisine: ["Italian", "Pizza"],
        budget: "low",
        dietaryRestrictions: [],
        groupSize: 4,
        spiceLevel: "mild",
        occasion: "family meal",
        location: "Brooklyn",
        createdAt: Date.now() - 172800000,
      },
      {
        userId: users[0]._id,
        sessionId: `session_${Date.now()}_3`,
        cuisine: ["Indian", "Chinese"],
        budget: "high",
        dietaryRestrictions: ["vegan"],
        groupSize: 3,
        spiceLevel: "hot",
        occasion: "celebration",
        location: "Queens",
        createdAt: Date.now() - 259200000,
      },
    ];

    for (const pref of samplePreferences) {
      await ctx.db.insert("preferences", pref);
    }

    return { message: `Seeded ${samplePreferences.length} preferences` };
  },
});
