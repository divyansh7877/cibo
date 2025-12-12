import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  preferences: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    cuisine: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    dietaryRestrictions: v.optional(v.array(v.string())),
    groupSize: v.optional(v.number()),
    spiceLevel: v.optional(v.string()),
    occasion: v.optional(v.string()),
    location: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_session", ["sessionId"]),

  restaurants: defineTable({
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    cuisine: v.array(v.string()),
    priceRange: v.string(),
    rating: v.number(),
    description: v.string(),
    menuHighlights: v.array(v.string()),
    dietaryOptions: v.array(v.string()),
    spiceLevels: v.array(v.string()),
    distance: v.number(),
  }),

  orders: defineTable({
    userId: v.id("users"),
    restaurantId: v.id("restaurants"),
    preferenceId: v.id("preferences"),
    items: v.array(v.object({
      name: v.string(),
      price: v.number(),
      notes: v.optional(v.string()),
    })),
    status: v.string(),
    callTranscript: v.optional(v.string()),
    confirmationNumber: v.optional(v.string()),
    estimatedPickupTime: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  conversations: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number(),
    })),
    agentPhase: v.string(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),
});
