import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: { userId: v.id("users"), restaurantId: v.id("restaurants"), preferenceId: v.id("preferences") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", { ...args, items: [], status: "pending", createdAt: Date.now() });
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    callTranscript: v.optional(v.string()),
    confirmationNumber: v.optional(v.string()),
    estimatedPickupTime: v.optional(v.string()),
    items: v.optional(v.array(v.object({ name: v.string(), price: v.number(), notes: v.optional(v.string()) }))),
  },
  handler: async (ctx, args) => {
    const { orderId, ...updates } = args;
    const clean = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(orderId, clean);
  },
});

export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => await ctx.db.get(args.orderId),
});

export const getOrderWithDetails = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    const restaurant = await ctx.db.get(order.restaurantId);
    return { ...order, restaurant };
  },
});
