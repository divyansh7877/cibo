# FoodAgent: Multi-Agent Voice Food Ordering System

## Product Specification Document
**Version:** 1.0
**Date:** December 11, 2025
**Hackathon:** ElevenLabs Worldwide Hackathon

---

## Executive Summary

FoodAgent is a multi-agent conversational AI system that helps users decide what to eat and places orders on their behalf. The system uses three coordinated AI agents: a Preference Agent that learns what the user wants through natural conversation, a Discovery Agent that matches preferences to restaurants, and an Ordering Agent that calls restaurants to place orders via voice.

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite + TypeScript | Web application |
| Styling | Tailwind CSS | UI styling |
| Backend | Convex | Real-time database, serverless functions |
| Authentication | Clerk | User authentication with Google OAuth |
| Voice AI | ElevenLabs Conversational AI | Voice agents for preference collection and ordering |
| Orchestration | N8N | Multi-agent workflow coordination |
| Deployment | Vercel/Netlify | Frontend hosting |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Voice)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              ElevenLabs WebSocket Connection             │   │
│  │                   (Preference Agent)                     │   │
│  │  "What are you in the mood for? Any dietary needs?"      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ Tool Call: savePreferences()     │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                        CONVEX                            │   │
│  │  savePreferences() → getRecommendations() → Real-time   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ Returns top 3 restaurants        │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Restaurant Recommendation Cards             │   │
│  │                  [Order This →] Button                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
└──────────────────────────────│──────────────────────────────────┘
                               │
                               │ POST to N8N Webhook
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          N8N CLOUD                              │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │ Webhook  │ → │ Prepare  │ → │ElevenLabs│ → │ Update   │    │
│  │ Trigger  │   │ Context  │   │ Outbound │   │ Convex   │    │
│  │          │   │          │   │ Call API │   │          │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│                                      │                         │
└──────────────────────────────────────│─────────────────────────┘
                                       │
                                       │ Initiates phone call
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              ORDERING AGENT (ElevenLabs Outbound Call)          │
│  Calls restaurant phone number, places order via voice          │
└─────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Calls
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                 MOCK RESTAURANT (Teammate's Phone)              │
│                 OR Second ElevenLabs Agent                      │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow Summary:**
1. User speaks to Preference Agent via WebSocket (direct ElevenLabs connection)
2. Agent saves preferences to Convex via tool call
3. Frontend queries Convex for restaurant recommendations
4. User clicks "Order This" → Frontend POSTs to N8N webhook
5. N8N triggers ElevenLabs outbound call API
6. Ordering Agent calls restaurant and places order
7. Call completion webhook updates order status in Convex
8. Frontend receives real-time update via Convex subscription

---

## Core Features

### 1. User Authentication
- Google OAuth sign-in via Clerk
- Persistent user sessions
- User preference history stored per account

### 2. Preference Agent Conversation
- Voice-based conversational interface
- Collects: cuisine type, budget, dietary restrictions, group size, location preference, mood/occasion
- Real-time transcription display
- Saves preferences to Convex database

### 3. Restaurant Discovery
- Matches user preferences against seeded restaurant database
- Returns top 3 restaurant recommendations
- Displays restaurant cards with key info

### 4. Order Placement
- Initiates outbound voice call to restaurant
- AI agent places order on user's behalf
- Real-time call status updates
- Order confirmation display

---

## User Interface Specification

### Screen 1: Landing/Auth Page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         🍽️ FoodAgent                            │
│                                                                 │
│              "Tell me what you're craving.                      │
│               I'll find it and order it."                       │
│                                                                 │
│                  ┌─────────────────────┐                        │
│                  │  Sign in with Google │                       │
│                  └─────────────────────┘                        │
│                                                                 │
│         Built with ElevenLabs • Convex • Clerk • N8N           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Logo and tagline
- Clerk `<SignInButton>` component
- Footer with sponsor logos

---

### Screen 2: Main Dashboard (Post-Auth)

```
┌─────────────────────────────────────────────────────────────────┐
│  FoodAgent                                    [User Avatar] ▼   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                    Agent Status Panel                     │  │
│  │                                                           │  │
│  │    [🎯 Preferences]  →  [🔍 Discovery]  →  [📞 Ordering] │  │
│  │         ●                    ○                  ○         │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                  Conversation Panel                       │  │
│  │                                                           │  │
│  │  Agent: "Hey! I'm here to help you find the perfect      │  │
│  │          meal. What kind of food are you in the mood     │  │
│  │          for today?"                                      │  │
│  │                                                           │  │
│  │  You: "I'm thinking something spicy, maybe Thai or       │  │
│  │        Indian..."                                         │  │
│  │                                                           │  │
│  │  Agent: "Great choice! Are you eating alone or with      │  │
│  │          a group?"                                        │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│           ┌─────────────────────────────────────┐               │
│           │  🎤  Tap to speak   [Speaking...]   │               │
│           └─────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Header with user menu (Clerk `<UserButton>`)
- Agent Status Panel showing 3-stage pipeline with active indicator
- Conversation Panel with scrollable message history
- Voice input button with state (idle/listening/processing)
- Real-time transcription display

---

### Screen 3: Restaurant Recommendations

```
┌─────────────────────────────────────────────────────────────────┐
│  FoodAgent                                    [User Avatar] ▼   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    [🎯 Preferences]  →  [🔍 Discovery]  →  [📞 Ordering]       │
│         ✓                    ●                  ○               │
│                                                                 │
│  Based on your preferences, here are my top picks:              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🏆 Top Match: Thai Basil Kitchen                       │    │
│  │  ⭐ 4.7 • $$ • Thai • 0.3 mi                            │    │
│  │  "Authentic Bangkok street food, famous for Pad Kra Pao"│    │
│  │                                    [Order This →]       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  #2: Spice Route Indian                                 │    │
│  │  ⭐ 4.5 • $$ • Indian • 0.5 mi                          │    │
│  │  "Northern Indian cuisine with excellent vindaloo"      │    │
│  │                                    [Order This →]       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  #3: Sichuan House                                      │    │
│  │  ⭐ 4.6 • $$ • Chinese • 0.4 mi                         │    │
│  │  "Fiery Sichuan specialties, try the mapo tofu"         │    │
│  │                                    [Order This →]       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│              [🔄 Start Over]  [🎤 Refine Preferences]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Restaurant cards with: name, rating, price range, cuisine, distance, description
- "Order This" CTA button on each card
- Match ranking indicator
- Start Over and Refine options

---

### Screen 4: Order Placement (Call in Progress)

```
┌─────────────────────────────────────────────────────────────────┐
│  FoodAgent                                    [User Avatar] ▼   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    [🎯 Preferences]  →  [🔍 Discovery]  →  [📞 Ordering]       │
│         ✓                    ✓                  ●               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                   📞 Calling...                           │  │
│  │                                                           │  │
│  │                Thai Basil Kitchen                         │  │
│  │                  (212) 555-0123                           │  │
│  │                                                           │  │
│  │              ◉ ◉ ◉  Connected  ◉ ◉ ◉                     │  │
│  │                     0:42                                  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Live Transcript:                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Agent: "Hi, I'd like to place a pickup order please."   │  │
│  │                                                           │  │
│  │  Restaurant: "Sure, what can I get for you?"             │  │
│  │                                                           │  │
│  │  Agent: "I'd like one Pad Thai with chicken, medium      │  │
│  │          spice, and one order of Thai iced tea."         │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                      [❌ Cancel Call]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Call status indicator (Connecting/Connected/Completed)
- Restaurant name and phone number
- Call duration timer
- Live transcript of the conversation
- Cancel button

---

### Screen 5: Order Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│  FoodAgent                                    [User Avatar] ▼   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    [🎯 Preferences]  →  [🔍 Discovery]  →  [📞 Ordering]       │
│         ✓                    ✓                  ✓               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                    ✅ Order Placed!                       │  │
│  │                                                           │  │
│  │  Thai Basil Kitchen                                       │  │
│  │  123 Main Street, New York, NY                            │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────                    │  │
│  │  1x Pad Thai (Chicken, Medium Spice)         $14.95      │  │
│  │  1x Thai Iced Tea                             $4.50      │  │
│  │  ─────────────────────────────────────                    │  │
│  │  Estimated Pickup: 25-30 minutes                          │  │
│  │                                                           │  │
│  │  Order #: TBK-2024-1234                                   │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                    [🍽️ Start New Order]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Success indicator
- Order summary with items and prices
- Pickup time estimate
- Order confirmation number
- Start New Order button

---

## Data Models (Convex Schema)

### Users Table
```typescript
// convex/schema.ts
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
    budget: v.optional(v.string()), // "low" | "medium" | "high"
    dietaryRestrictions: v.optional(v.array(v.string())),
    groupSize: v.optional(v.number()),
    spiceLevel: v.optional(v.string()),
    occasion: v.optional(v.string()),
    location: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  restaurants: defineTable({
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    cuisine: v.array(v.string()),
    priceRange: v.string(), // "$" | "$$" | "$$$"
    rating: v.number(),
    description: v.string(),
    menuHighlights: v.array(v.string()),
    dietaryOptions: v.array(v.string()), // "vegetarian", "vegan", "gluten-free"
    spiceLevels: v.array(v.string()),
    distance: v.number(), // miles
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
    status: v.string(), // "pending" | "calling" | "confirmed" | "failed"
    callTranscript: v.optional(v.string()),
    confirmationNumber: v.optional(v.string()),
    estimatedPickupTime: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  conversations: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    messages: v.array(v.object({
      role: v.string(), // "agent" | "user"
      content: v.string(),
      timestamp: v.number(),
    })),
    agentPhase: v.string(), // "preference" | "discovery" | "ordering" | "complete"
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),
});
```

---

## Convex Functions

### Core Functions
```typescript
// convex/users.ts
export const getOrCreateUser = mutation({
  args: { clerkId: v.string(), email: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existing) return existing._id;
    
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// convex/preferences.ts
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

// convex/restaurants.ts
export const getRecommendations = query({
  args: { preferenceId: v.id("preferences") },
  handler: async (ctx, args) => {
    const preference = await ctx.db.get(args.preferenceId);
    if (!preference) return [];

    const allRestaurants = await ctx.db.query("restaurants").collect();
    
    // Score restaurants based on preference matching
    const scored = allRestaurants.map((restaurant) => {
      let score = 0;
      
      // Cuisine match
      if (preference.cuisine?.some(c => 
        restaurant.cuisine.map(rc => rc.toLowerCase()).includes(c.toLowerCase())
      )) {
        score += 30;
      }
      
      // Budget match
      const budgetMap = { low: "$", medium: "$$", high: "$$$" };
      if (preference.budget && restaurant.priceRange === budgetMap[preference.budget]) {
        score += 20;
      }
      
      // Dietary match
      if (preference.dietaryRestrictions?.some(d =>
        restaurant.dietaryOptions.map(rd => rd.toLowerCase()).includes(d.toLowerCase())
      )) {
        score += 25;
      }
      
      // Spice level match
      if (preference.spiceLevel && 
        restaurant.spiceLevels.includes(preference.spiceLevel)) {
        score += 15;
      }
      
      // Rating bonus
      score += restaurant.rating * 2;
      
      return { ...restaurant, score };
    });
    
    // Return top 3
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  },
});

// convex/orders.ts
export const createOrder = mutation({
  args: {
    userId: v.id("users"),
    restaurantId: v.id("restaurants"),
    preferenceId: v.id("preferences"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      items: [],
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    callTranscript: v.optional(v.string()),
    confirmationNumber: v.optional(v.string()),
    estimatedPickupTime: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
      notes: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const { orderId, ...updates } = args;
    await ctx.db.patch(orderId, updates);
  },
});

// convex/conversations.ts
export const addMessage = mutation({
  args: {
    sessionId: v.string(),
    userId: v.id("users"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const message = {
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        messages: [...existing.messages, message],
      });
      return existing._id;
    }

    return await ctx.db.insert("conversations", {
      userId: args.userId,
      sessionId: args.sessionId,
      messages: [message],
      agentPhase: "preference",
      createdAt: Date.now(),
    });
  },
});

export const updateAgentPhase = mutation({
  args: {
    sessionId: v.string(),
    phase: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    
    if (conversation) {
      await ctx.db.patch(conversation._id, { agentPhase: args.phase });
    }
  },
});
```

---

## Seed Data (Restaurants)

```typescript
// convex/seed.ts
export const seedRestaurants = mutation({
  handler: async (ctx) => {
    const restaurants = [
      {
        name: "Thai Basil Kitchen",
        phone: "+1-212-555-0101",
        address: "123 Main St, New York, NY 10001",
        cuisine: ["Thai", "Asian"],
        priceRange: "$$",
        rating: 4.7,
        description: "Authentic Bangkok street food, famous for Pad Kra Pao and hand-pulled noodles",
        menuHighlights: ["Pad Thai", "Green Curry", "Mango Sticky Rice", "Tom Yum Soup"],
        dietaryOptions: ["vegetarian", "vegan", "gluten-free"],
        spiceLevels: ["mild", "medium", "hot", "thai-hot"],
        distance: 0.3,
      },
      {
        name: "Spice Route Indian",
        phone: "+1-212-555-0102",
        address: "456 Oak Ave, New York, NY 10002",
        cuisine: ["Indian", "South Asian"],
        priceRange: "$$",
        rating: 4.5,
        description: "Northern Indian cuisine with excellent vindaloo and fresh naan from tandoor oven",
        menuHighlights: ["Chicken Tikka Masala", "Lamb Vindaloo", "Garlic Naan", "Biryani"],
        dietaryOptions: ["vegetarian", "vegan", "halal"],
        spiceLevels: ["mild", "medium", "hot"],
        distance: 0.5,
      },
      {
        name: "Sichuan House",
        phone: "+1-212-555-0103",
        address: "789 Elm Blvd, New York, NY 10003",
        cuisine: ["Chinese", "Sichuan", "Asian"],
        priceRange: "$$",
        rating: 4.6,
        description: "Fiery Sichuan specialties with authentic málà flavors, try the mapo tofu",
        menuHighlights: ["Mapo Tofu", "Kung Pao Chicken", "Dan Dan Noodles", "Hot Pot"],
        dietaryOptions: ["vegetarian"],
        spiceLevels: ["mild", "medium", "hot", "sichuan-hot"],
        distance: 0.4,
      },
      {
        name: "Napoli Pizza Co",
        phone: "+1-212-555-0104",
        address: "321 Pine St, New York, NY 10004",
        cuisine: ["Italian", "Pizza"],
        priceRange: "$",
        rating: 4.4,
        description: "Wood-fired Neapolitan pizza with imported Italian ingredients",
        menuHighlights: ["Margherita", "Pepperoni", "Quattro Formaggi", "Tiramisu"],
        dietaryOptions: ["vegetarian", "gluten-free"],
        spiceLevels: ["mild"],
        distance: 0.2,
      },
      {
        name: "Sakura Sushi",
        phone: "+1-212-555-0105",
        address: "555 Cherry Ln, New York, NY 10005",
        cuisine: ["Japanese", "Sushi", "Asian"],
        priceRange: "$$$",
        rating: 4.8,
        description: "Premium omakase and fresh sashimi flown in daily from Tsukiji market",
        menuHighlights: ["Omakase", "Salmon Sashimi", "Dragon Roll", "Wagyu Beef"],
        dietaryOptions: ["gluten-free", "pescatarian"],
        spiceLevels: ["mild"],
        distance: 0.6,
      },
      {
        name: "El Mariachi Tacos",
        phone: "+1-212-555-0106",
        address: "888 Cactus Way, New York, NY 10006",
        cuisine: ["Mexican", "Latin"],
        priceRange: "$",
        rating: 4.3,
        description: "Street-style tacos and burritos with house-made salsas and fresh guacamole",
        menuHighlights: ["Carne Asada Tacos", "Al Pastor", "Churros", "Horchata"],
        dietaryOptions: ["vegetarian", "vegan", "gluten-free"],
        spiceLevels: ["mild", "medium", "hot"],
        distance: 0.3,
      },
      {
        name: "Mediterranean Grill",
        phone: "+1-212-555-0107",
        address: "222 Olive Dr, New York, NY 10007",
        cuisine: ["Mediterranean", "Greek", "Middle Eastern"],
        priceRange: "$$",
        rating: 4.5,
        description: "Fresh Mediterranean platters with house-made hummus and grilled meats",
        menuHighlights: ["Lamb Gyro", "Falafel Plate", "Hummus", "Baklava"],
        dietaryOptions: ["vegetarian", "vegan", "halal", "gluten-free"],
        spiceLevels: ["mild", "medium"],
        distance: 0.4,
      },
      {
        name: "Seoul Kitchen",
        phone: "+1-212-555-0108",
        address: "999 Kimchi Blvd, New York, NY 10008",
        cuisine: ["Korean", "Asian", "BBQ"],
        priceRange: "$$",
        rating: 4.6,
        description: "Authentic Korean BBQ with tabletop grills and traditional banchan",
        menuHighlights: ["Korean BBQ", "Bibimbap", "Kimchi Jjigae", "Bulgogi"],
        dietaryOptions: ["vegetarian", "gluten-free"],
        spiceLevels: ["mild", "medium", "hot"],
        distance: 0.5,
      },
      {
        name: "Burger & Brew",
        phone: "+1-212-555-0109",
        address: "444 Patty Lane, New York, NY 10009",
        cuisine: ["American", "Burgers"],
        priceRange: "$",
        rating: 4.2,
        description: "Craft burgers with locally sourced beef and artisanal buns",
        menuHighlights: ["Classic Smash Burger", "Truffle Fries", "Milkshakes", "Onion Rings"],
        dietaryOptions: ["vegetarian", "gluten-free"],
        spiceLevels: ["mild"],
        distance: 0.2,
      },
      {
        name: "Pho Vietnam",
        phone: "+1-212-555-0110",
        address: "777 Noodle St, New York, NY 10010",
        cuisine: ["Vietnamese", "Asian"],
        priceRange: "$",
        rating: 4.5,
        description: "Traditional pho with 24-hour bone broth and fresh herbs",
        menuHighlights: ["Pho Bo", "Banh Mi", "Spring Rolls", "Vietnamese Coffee"],
        dietaryOptions: ["vegetarian", "gluten-free"],
        spiceLevels: ["mild", "medium", "hot"],
        distance: 0.3,
      },
    ];

    for (const restaurant of restaurants) {
      await ctx.db.insert("restaurants", restaurant);
    }
  },
});
```

---

## React Component Structure

```
src/
├── main.tsx
├── App.tsx
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── Auth/
│   │   └── AuthScreen.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── AgentStatusPanel.tsx
│   │   └── ConversationPanel.tsx
│   ├── Voice/
│   │   ├── VoiceButton.tsx
│   │   └── TranscriptDisplay.tsx
│   ├── Restaurants/
│   │   ├── RecommendationList.tsx
│   │   └── RestaurantCard.tsx
│   ├── Order/
│   │   ├── CallInProgress.tsx
│   │   └── OrderConfirmation.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── hooks/
│   ├── useVoiceAgent.ts
│   ├── useConversation.ts
│   └── useOrder.ts
├── lib/
│   ├── elevenlabs.ts
│   └── utils.ts
├── convex/
│   └── _generated/
└── styles/
    └── globals.css
```

---

## Key React Components

### App.tsx
```tsx
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthScreen } from "./components/Auth/AuthScreen";
import { Dashboard } from "./components/Dashboard/Dashboard";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export default function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProvider client={convex}>
        <SignedOut>
          <AuthScreen />
        </SignedOut>
        <SignedIn>
          <Dashboard />
        </SignedIn>
      </ConvexProvider>
    </ClerkProvider>
  );
}
```

### Dashboard.tsx
```tsx
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Header } from "../Layout/Header";
import { AgentStatusPanel } from "./AgentStatusPanel";
import { ConversationPanel } from "./ConversationPanel";
import { VoiceButton } from "../Voice/VoiceButton";
import { RecommendationList } from "../Restaurants/RecommendationList";
import { CallInProgress } from "../Order/CallInProgress";
import { OrderConfirmation } from "../Order/OrderConfirmation";

type Phase = "preference" | "discovery" | "ordering" | "complete";

export function Dashboard() {
  const { user } = useUser();
  const [phase, setPhase] = useState<Phase>("preference");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AgentStatusPanel currentPhase={phase} />
        
        {phase === "preference" && (
          <>
            <ConversationPanel sessionId={sessionId} />
            <VoiceButton 
              sessionId={sessionId}
              onPreferencesComplete={(prefId) => {
                setPreferenceId(prefId);
                setPhase("discovery");
              }}
            />
          </>
        )}
        
        {phase === "discovery" && preferenceId && (
          <RecommendationList 
            preferenceId={preferenceId}
            onSelectRestaurant={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setPhase("ordering");
            }}
            onRefine={() => setPhase("preference")}
          />
        )}
        
        {phase === "ordering" && selectedRestaurant && (
          <CallInProgress 
            restaurant={selectedRestaurant}
            onComplete={(order) => {
              setOrderId(order._id);
              setPhase("complete");
            }}
            onCancel={() => setPhase("discovery")}
          />
        )}
        
        {phase === "complete" && orderId && (
          <OrderConfirmation 
            orderId={orderId}
            onNewOrder={() => {
              setPhase("preference");
              setPreferenceId(null);
              setSelectedRestaurant(null);
              setOrderId(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
```

### VoiceButton.tsx
```tsx
import { useState, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

type VoiceState = "idle" | "listening" | "processing";

interface VoiceButtonProps {
  sessionId: string;
  onPreferencesComplete: (preferenceId: string) => void;
}

export function VoiceButton({ sessionId, onPreferencesComplete }: VoiceButtonProps) {
  const [state, setState] = useState<VoiceState>("idle");

  const handleClick = useCallback(async () => {
    if (state === "idle") {
      setState("listening");
      // Initialize ElevenLabs conversation
      // This will be connected to the ElevenLabs SDK
    } else if (state === "listening") {
      setState("processing");
      // End conversation and process
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <button
        onClick={handleClick}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-lg
          ${state === "idle" 
            ? "bg-blue-500 hover:bg-blue-600" 
            : state === "listening"
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-gray-400"
          }
        `}
        disabled={state === "processing"}
      >
        {state === "idle" && <Mic className="w-8 h-8 text-white" />}
        {state === "listening" && <MicOff className="w-8 h-8 text-white" />}
        {state === "processing" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
      </button>
      <span className="text-sm text-gray-600">
        {state === "idle" && "Tap to speak"}
        {state === "listening" && "Listening... tap to stop"}
        {state === "processing" && "Processing..."}
      </span>
    </div>
  );
}
```

### RestaurantCard.tsx
```tsx
import { Star } from "lucide-react";

interface Restaurant {
  _id: string;
  name: string;
  phone: string;
  address: string;
  cuisine: string[];
  priceRange: string;
  rating: number;
  description: string;
  distance: number;
  score?: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  rank: number;
  onSelect: () => void;
}

export function RestaurantCard({ restaurant, rank, onSelect }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            {rank === 1 && <span className="text-yellow-500">🏆</span>}
            <span className="text-sm text-gray-500 font-medium">
              {rank === 1 ? "Top Match" : `#${rank}`}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-1">
            {restaurant.name}
          </h3>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {restaurant.rating}
        </span>
        <span>{restaurant.priceRange}</span>
        <span>{restaurant.cuisine[0]}</span>
        <span>{restaurant.distance} mi</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        {restaurant.description}
      </p>
      
      <button
        onClick={onSelect}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Order This →
      </button>
    </div>
  );
}
```

---

## ElevenLabs Integration

### Preference Agent Configuration
```typescript
// lib/elevenlabs.ts
export const PREFERENCE_AGENT_CONFIG = {
  agent_id: "YOUR_AGENT_ID", // Created in ElevenLabs dashboard
  
  // System prompt for the preference agent
  system_prompt: `You are a friendly food concierge helping someone decide what to eat. Your goal is to gather their preferences through natural conversation.

You need to learn:
1. What cuisine(s) they're interested in
2. Their budget (low=$, medium=$$, high=$$$)
3. Any dietary restrictions (vegetarian, vegan, gluten-free, halal, etc.)
4. How many people are eating
5. Their spice preference (mild, medium, hot)
6. The occasion (quick lunch, date night, family dinner, etc.)

Guidelines:
- Be warm, conversational, and enthusiastic about food
- Ask one question at a time
- Use their previous answers to make the conversation flow naturally
- If they're unsure, offer suggestions based on what they've told you
- After gathering enough info (at least cuisine and 2 other preferences), summarize what you learned and confirm before proceeding

When you have enough information, end with: "Perfect! Let me find the best spots for you."

Example conversation:
You: "Hey! I'm excited to help you find something delicious. What kind of food sounds good right now?"
User: "I'm thinking something spicy, maybe Asian?"
You: "Ooh, great choice! Are you feeling Thai, Sichuan, Korean, or maybe Indian? They all bring the heat differently!"
User: "Thai sounds perfect"
You: "Love it! Is this a solo mission or are you feeding a crew?"`,

  // Tools the agent can call
  tools: [
    {
      name: "save_preferences",
      description: "Save the user's food preferences to the database",
      parameters: {
        type: "object",
        properties: {
          cuisine: { type: "array", items: { type: "string" } },
          budget: { type: "string", enum: ["low", "medium", "high"] },
          dietaryRestrictions: { type: "array", items: { type: "string" } },
          groupSize: { type: "number" },
          spiceLevel: { type: "string", enum: ["mild", "medium", "hot"] },
          occasion: { type: "string" }
        }
      }
    }
  ]
};

export const ORDERING_AGENT_CONFIG = {
  agent_id: "YOUR_ORDERING_AGENT_ID",
  
  system_prompt: `You are calling a restaurant to place a food order on behalf of a customer. Be polite, clear, and efficient.

You are placing an order for: {{order_details}}
Restaurant: {{restaurant_name}}

Guidelines:
- Greet them politely and state you'd like to place a pickup order
- Clearly state each item with any modifications
- Confirm the total and pickup time
- Thank them and say goodbye

If they ask questions you can't answer, politely say you'll need to check and call back.

End the call by saying "Thank you, goodbye!" when the order is confirmed.`
};
```

### useVoiceAgent Hook
```typescript
// hooks/useVoiceAgent.ts
import { useState, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useVoiceAgent(sessionId: string, userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, content: string}>>([]);
  const conversationRef = useRef<any>(null);
  
  const addMessage = useMutation(api.conversations.addMessage);
  const savePreferences = useMutation(api.preferences.savePreferences);

  const startConversation = useCallback(async () => {
    // Initialize ElevenLabs WebSocket connection
    const conversation = await window.ElevenLabs.Conversation.startSession({
      agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      
      onConnect: () => {
        setIsConnected(true);
      },
      
      onDisconnect: () => {
        setIsConnected(false);
      },
      
      onMessage: (message: { role: string; content: string }) => {
        setTranscript(prev => [...prev, message]);
        addMessage({
          sessionId,
          userId,
          role: message.role,
          content: message.content
        });
      },
      
      onToolCall: async (toolName: string, params: any) => {
        if (toolName === "save_preferences") {
          const prefId = await savePreferences({
            userId,
            sessionId,
            preferences: params
          });
          return { preferenceId: prefId };
        }
      }
    });
    
    conversationRef.current = conversation;
  }, [sessionId, userId, addMessage, savePreferences]);

  const endConversation = useCallback(async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
  }, []);

  return {
    isConnected,
    transcript,
    startConversation,
    endConversation
  };
}
```

---

## Environment Variables

```env
# .env.local

# Convex
VITE_CONVEX_URL=https://your-project.convex.cloud

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# ElevenLabs
VITE_ELEVENLABS_API_KEY=xxxxx
VITE_ELEVENLABS_PREFERENCE_AGENT_ID=xxxxx
VITE_ELEVENLABS_ORDERING_AGENT_ID=xxxxx
VITE_ELEVENLABS_PHONE_NUMBER_ID=xxxxx

# N8N
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/initiate-order
```

---

## Styling (Tailwind Config)

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        accent: {
          500: "#f97316", // Orange for food theme
        }
      },
      animation: {
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.1)", opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};
```

---

## N8N Workflow Integration

### Architecture Decision

N8N is used for **ONE critical workflow**: triggering the outbound ordering call. This provides:
- Sponsor prize eligibility for "Best Product Built with N8N"
- Visual orchestration judges can see in the N8N execution log
- Clean separation between preference collection and order placement
- Minimal complexity for a 2-hour build

**What N8N handles:**
- Receiving order request from frontend
- Preparing order context with restaurant details
- Triggering ElevenLabs outbound call API
- Updating Convex with call status

**What stays in app code:**
- Preference Agent conversation (direct ElevenLabs WebSocket)
- Restaurant matching logic (Convex query)
- Real-time UI updates (Convex subscriptions)

---

### N8N Workflow: Initiate Order Call

**Webhook URL:** `https://your-n8n-instance.app.n8n.cloud/webhook/initiate-order`

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Webhook    │───▶│   Prepare    │───▶│  ElevenLabs  │───▶│   Update     │
│   Trigger    │    │   Context    │    │  Outbound    │    │   Convex     │
│              │    │              │    │   Call API   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │   Respond    │
                                        │  to Webhook  │
                                        └──────────────┘
```

---

### N8N Workflow JSON (Import Ready)

Copy this JSON and import directly into N8N:

```json
{
  "name": "FoodAgent - Initiate Order Call",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "initiate-order",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "// Prepare the context for the ordering agent\nconst input = $input.first().json;\n\n// Build the order prompt with restaurant and item details\nconst orderPrompt = `You are calling ${input.restaurantName} at ${input.restaurantPhone} to place a pickup order.\n\nOrder details:\n- Items: ${input.orderItems}\n- Customer name: ${input.customerName}\n- Pickup preference: As soon as possible\n\nBe polite, clear, and confirm the total and pickup time before ending the call.`;\n\nreturn {\n  agentId: input.agentId,\n  phoneNumberId: input.phoneNumberId,\n  toNumber: input.restaurantPhone,\n  orderPrompt: orderPrompt,\n  orderId: input.orderId,\n  restaurantName: input.restaurantName,\n  convexUrl: input.convexUrl\n};"
      },
      "id": "prepare-context",
      "name": "Prepare Order Context",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [470, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "xi-api-key",
              "value": "={{ $env.ELEVENLABS_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"agent_id\": \"{{ $json.agentId }}\",\n  \"agent_phone_number_id\": \"{{ $json.phoneNumberId }}\",\n  \"to_number\": \"{{ $json.toNumber }}\",\n  \"agent_overrides\": {\n    \"prompt\": {\n      \"prompt\": \"{{ $json.orderPrompt }}\"\n    },\n    \"first_message\": \"Hi, I'd like to place a pickup order please.\"\n  }\n}",
        "options": {}
      },
      "id": "elevenlabs-call",
      "name": "Trigger ElevenLabs Outbound Call",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [690, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Prepare Order Context').item.json.convexUrl }}/api/mutation",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"path\": \"orders:updateOrderStatus\",\n  \"args\": {\n    \"orderId\": \"{{ $('Prepare Order Context').item.json.orderId }}\",\n    \"status\": \"calling\",\n    \"callId\": \"{{ $json.call_sid || $json.conversation_id || 'pending' }}\"\n  }\n}",
        "options": {}
      },
      "id": "update-convex",
      "name": "Update Convex Order Status",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [910, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\n  \"success\": true,\n  \"callId\": \"{{ $('Trigger ElevenLabs Outbound Call').item.json.call_sid || $('Trigger ElevenLabs Outbound Call').item.json.conversation_id }}\",\n  \"orderId\": \"{{ $('Prepare Order Context').item.json.orderId }}\",\n  \"status\": \"calling\"\n}",
        "options": {}
      },
      "id": "respond-webhook",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1130, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Prepare Order Context",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Order Context": {
      "main": [
        [
          {
            "node": "Trigger ElevenLabs Outbound Call",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Trigger ElevenLabs Outbound Call": {
      "main": [
        [
          {
            "node": "Update Convex Order Status",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Convex Order Status": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

---

### N8N Setup Instructions (15 minutes)

#### Step 1: Create N8N Cloud Account (2 min)
1. Go to https://n8n.cloud
2. Sign up or redeem hackathon coupon for Pro tier
3. Create a new workflow

#### Step 2: Import Workflow (2 min)
1. Click the three dots menu → "Import from JSON"
2. Paste the JSON above
3. Click "Import"

#### Step 3: Configure Credentials (5 min)

**ElevenLabs API Key:**
1. Go to Settings → Credentials → Add Credential
2. Select "Header Auth"
3. Name: `ElevenLabs API`
4. Header Name: `xi-api-key`
5. Header Value: Your ElevenLabs API key

**Environment Variables:**
1. Go to Settings → Variables
2. Add: `ELEVENLABS_API_KEY` = your key

#### Step 4: Activate Webhook (1 min)
1. Click on the Webhook node
2. Click "Listen for Test Event" or "Production URL"
3. Copy the webhook URL

#### Step 5: Test the Workflow (5 min)
Send a test POST request:
```bash
curl -X POST https://your-n8n.app.n8n.cloud/webhook/initiate-order \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "your-ordering-agent-id",
    "phoneNumberId": "your-elevenlabs-phone-id",
    "restaurantPhone": "+1234567890",
    "restaurantName": "Thai Basil Kitchen",
    "orderItems": "1x Pad Thai, 1x Thai Iced Tea",
    "customerName": "Chris",
    "orderId": "test-order-123",
    "convexUrl": "https://your-project.convex.cloud"
  }'
```

---

### Frontend Integration

#### Hook: useOrderCall.ts
```typescript
// hooks/useOrderCall.ts
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

interface OrderCallParams {
  restaurant: {
    _id: string;
    name: string;
    phone: string;
  };
  orderItems: string[];
  customerName: string;
}

export function useOrderCall() {
  const [isInitiating, setIsInitiating] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const createOrder = useMutation(api.orders.createOrder);

  const initiateCall = async ({ restaurant, orderItems, customerName }: OrderCallParams) => {
    setIsInitiating(true);
    setError(null);
    
    try {
      // Create order in Convex first
      const orderId = await createOrder({
        restaurantId: restaurant._id,
        items: orderItems.map(item => ({ name: item, price: 0 })),
        status: "pending"
      });

      // Trigger N8N workflow
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: import.meta.env.VITE_ELEVENLABS_ORDERING_AGENT_ID,
          phoneNumberId: import.meta.env.VITE_ELEVENLABS_PHONE_NUMBER_ID,
          restaurantPhone: restaurant.phone,
          restaurantName: restaurant.name,
          orderItems: orderItems.join(", "),
          customerName,
          orderId,
          convexUrl: import.meta.env.VITE_CONVEX_URL,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate call");
      }

      const data = await response.json();
      setCallId(data.callId);
      
      return { orderId, callId: data.callId };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsInitiating(false);
    }
  };

  return {
    initiateCall,
    isInitiating,
    callId,
    error,
  };
}
```

#### Component: OrderButton.tsx
```tsx
// components/Order/OrderButton.tsx
import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { useOrderCall } from "../../hooks/useOrderCall";

interface OrderButtonProps {
  restaurant: {
    _id: string;
    name: string;
    phone: string;
  };
  orderItems: string[];
  customerName: string;
  onCallInitiated: (orderId: string, callId: string) => void;
}

export function OrderButton({ 
  restaurant, 
  orderItems, 
  customerName, 
  onCallInitiated 
}: OrderButtonProps) {
  const { initiateCall, isInitiating, error } = useOrderCall();

  const handleClick = async () => {
    try {
      const { orderId, callId } = await initiateCall({
        restaurant,
        orderItems,
        customerName,
      });
      onCallInitiated(orderId, callId);
    } catch (err) {
      console.error("Failed to initiate order call:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isInitiating}
        className={`
          w-full flex items-center justify-center gap-2 
          py-3 px-4 rounded-lg font-medium transition-colors
          ${isInitiating 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-green-500 hover:bg-green-600 text-white"
          }
        `}
      >
        {isInitiating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Initiating Call...
          </>
        ) : (
          <>
            <Phone className="w-5 h-5" />
            Order This →
          </>
        )}
      </button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
```

---

### Call Status Webhook (Optional Enhancement)

If you have time, add a second N8N workflow to receive call completion webhooks from ElevenLabs:

**Webhook URL:** `https://your-n8n-instance.app.n8n.cloud/webhook/call-complete`

```json
{
  "name": "FoodAgent - Call Complete Handler",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "call-complete",
        "options": {}
      },
      "name": "Call Complete Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "const input = $input.first().json;\n\n// Parse call result from ElevenLabs webhook\nconst success = input.call_status === 'completed';\nconst transcript = input.transcript || '';\n\n// Extract confirmation number from transcript if mentioned\nconst confirmMatch = transcript.match(/order (?:number|#)?\\s*(?:is)?\\s*([A-Z0-9-]+)/i);\nconst confirmationNumber = confirmMatch ? confirmMatch[1] : `ORD-${Date.now()}`;\n\n// Extract pickup time if mentioned\nconst timeMatch = transcript.match(/(\\d{1,2}(?::\\d{2})?\\s*(?:minutes?|mins?))/i);\nconst pickupTime = timeMatch ? timeMatch[1] : '20-25 minutes';\n\nreturn {\n  orderId: input.metadata?.orderId,\n  status: success ? 'confirmed' : 'failed',\n  transcript: transcript,\n  confirmationNumber: confirmationNumber,\n  estimatedPickupTime: pickupTime,\n  convexUrl: input.metadata?.convexUrl\n};"
      },
      "name": "Parse Call Result",
      "type": "n8n-nodes-base.code",
      "position": [470, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $json.convexUrl }}/api/mutation",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"path\": \"orders:updateOrderStatus\",\n  \"args\": {\n    \"orderId\": \"{{ $json.orderId }}\",\n    \"status\": \"{{ $json.status }}\",\n    \"callTranscript\": \"{{ $json.transcript }}\",\n    \"confirmationNumber\": \"{{ $json.confirmationNumber }}\",\n    \"estimatedPickupTime\": \"{{ $json.estimatedPickupTime }}\"\n  }\n}"
      },
      "name": "Update Order in Convex",
      "type": "n8n-nodes-base.httpRequest",
      "position": [690, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={ \"received\": true }"
      },
      "name": "Acknowledge Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [910, 300]
    }
  ],
  "connections": {
    "Call Complete Webhook": {
      "main": [[{ "node": "Parse Call Result", "type": "main", "index": 0 }]]
    },
    "Parse Call Result": {
      "main": [[{ "node": "Update Order in Convex", "type": "main", "index": 0 }]]
    },
    "Update Order in Convex": {
      "main": [[{ "node": "Acknowledge Webhook", "type": "main", "index": 0 }]]
    }
  }
}
```

Configure this webhook URL in your ElevenLabs agent settings under "Webhooks" → "Call Ended".

---

## Demo Script

### Setup (Before Demo)
1. Have one teammate's phone ready as "Thai Basil Kitchen"
2. Pre-authenticate one user account
3. Have restaurants seeded in database

### Demo Flow (2 minutes)
1. **[0:00-0:15]** "FoodAgent helps you decide what to eat and orders it for you. Watch."
2. **[0:15-0:45]** Start voice conversation: "I'm hungry, want something spicy, maybe Thai, just me, medium budget"
3. **[0:45-1:00]** Show recommendations appearing, select Thai Basil Kitchen
4. **[1:00-1:30]** Watch AI call the "restaurant" (teammate's phone), place order
5. **[1:30-1:45]** Show order confirmation screen
6. **[1:45-2:00]** "Three AI agents working together: understanding preferences, finding restaurants, and placing orders. No apps, no menus, just conversation."

---

## Success Metrics for Judging

| Criterion | Target Score | How We Hit It |
|-----------|--------------|---------------|
| Working Prototype | 5 | Full flow works end-to-end, polished UI |
| Technical Complexity | 4-5 | Multi-agent architecture, ElevenLabs + Convex + N8N |
| Innovation | 4 | Novel combination of voice preference learning + autonomous ordering |
| Real-World Impact | 4-5 | Universal problem (food decision paralysis), bypasses delivery app fees |
| Theme Alignment | 5 | Conversational agents are the entire product, multiple partner technologies |

---

## Sponsor Prize Eligibility Checklist

- [x] **ElevenLabs** - Conversational AI agents (core product)
- [x] **Convex** - Real-time database and serverless functions
- [x] **Clerk** - User authentication
- [x] **N8N** - Multi-agent orchestration workflows
- [x] **Bolt** - Frontend built with Bolt.new
- [ ] **Anam** - Stretch goal: visual avatar for preference agent

---

*End of Product Specification*
