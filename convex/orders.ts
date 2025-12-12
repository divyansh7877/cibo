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

export const seedOrders = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("orders").first();
    if (existing) return { message: "Orders already seeded" };

    const users = await ctx.db.query("users").collect();
    const restaurants = await ctx.db.query("restaurants").collect();
    const preferences = await ctx.db.query("preferences").collect();

    if (users.length === 0) return { message: "No users found. Create a user first." };
    if (restaurants.length === 0) return { message: "No restaurants found. Seed restaurants first." };
    if (preferences.length === 0) return { message: "No preferences found. Seed preferences first." };

    const sampleOrders = [
      {
        userId: users[0]._id,
        restaurantId: restaurants[0]._id,
        preferenceId: preferences[0]._id,
        items: [
          { name: "Pad Thai", price: 14.99 },
          { name: "Green Curry", price: 15.99, notes: "Extra spicy" },
          { name: "Spring Rolls", price: 6.99 },
        ],
        status: "completed",
        callTranscript: "Customer ordered Pad Thai and Green Curry with extra spice...",
        confirmationNumber: "CONF-12345",
        estimatedPickupTime: "6:30 PM",
        createdAt: Date.now() - 86400000,
      },
      {
        userId: users[0]._id,
        restaurantId: restaurants[3]._id,
        preferenceId: preferences[1]._id,
        items: [
          { name: "Margherita Pizza", price: 12.99 },
          { name: "Pepperoni Pizza", price: 14.99 },
          { name: "Caesar Salad", price: 8.99 },
        ],
        status: "completed",
        callTranscript: "Family order with two pizzas and a salad...",
        confirmationNumber: "CONF-67890",
        estimatedPickupTime: "7:15 PM",
        createdAt: Date.now() - 172800000,
      },
      {
        userId: users[0]._id,
        restaurantId: restaurants[1]._id,
        preferenceId: preferences[2]._id,
        items: [
          { name: "Tikka Masala", price: 16.99, notes: "Mild spice" },
          { name: "Garlic Naan", price: 3.99 },
          { name: "Samosas", price: 5.99 },
        ],
        status: "pending",
        createdAt: Date.now() - 3600000,
      },
    ];

    for (const order of sampleOrders) {
      await ctx.db.insert("orders", order);
    }

    return { message: `Seeded ${sampleOrders.length} orders` };
  },
});
