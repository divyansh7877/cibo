import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRecommendations = query({
  args: { preferenceId: v.id("preferences") },
  handler: async (ctx, args) => {
    const preference = await ctx.db.get(args.preferenceId);
    if (!preference) return [];
    const allRestaurants = await ctx.db.query("restaurants").collect();
    const scored = allRestaurants.map((restaurant) => {
      let score = 0;
      if (preference.cuisine?.some((c) => restaurant.cuisine.map((rc) => rc.toLowerCase()).includes(c.toLowerCase()))) score += 30;
      const budgetMap: Record<string, string> = { low: "$", medium: "$$", high: "$$$" };
      if (preference.budget && restaurant.priceRange === budgetMap[preference.budget]) score += 20;
      if (preference.dietaryRestrictions?.some((d) => restaurant.dietaryOptions.map((rd) => rd.toLowerCase()).includes(d.toLowerCase()))) score += 25;
      if (preference.spiceLevel && restaurant.spiceLevels.includes(preference.spiceLevel)) score += 15;
      score += restaurant.rating * 2;
      return { ...restaurant, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  },
});

export const seedRestaurants = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("restaurants").first();
    if (existing) return { message: "Already seeded" };
    const restaurants = [
      { name: "Thai Basil Kitchen", phone: "+1-212-555-0101", address: "123 Main St, New York, NY", cuisine: ["Thai", "Asian"], priceRange: "$$", rating: 4.7, description: "Authentic Bangkok street food", menuHighlights: ["Pad Thai", "Green Curry", "Tom Yum"], dietaryOptions: ["vegetarian", "vegan", "gluten-free"], spiceLevels: ["mild", "medium", "hot"], distance: 0.3 },
      { name: "Spice Route Indian", phone: "+1-212-555-0102", address: "456 Oak Ave, New York, NY", cuisine: ["Indian", "South Asian"], priceRange: "$$", rating: 4.5, description: "Northern Indian cuisine", menuHighlights: ["Tikka Masala", "Vindaloo", "Naan"], dietaryOptions: ["vegetarian", "vegan", "halal"], spiceLevels: ["mild", "medium", "hot"], distance: 0.5 },
      { name: "Sichuan House", phone: "+1-212-555-0103", address: "789 Elm Blvd, New York, NY", cuisine: ["Chinese", "Sichuan"], priceRange: "$$", rating: 4.6, description: "Fiery Sichuan specialties", menuHighlights: ["Mapo Tofu", "Kung Pao", "Dan Dan Noodles"], dietaryOptions: ["vegetarian"], spiceLevels: ["mild", "medium", "hot"], distance: 0.4 },
      { name: "Napoli Pizza", phone: "+1-212-555-0104", address: "321 Pine St, New York, NY", cuisine: ["Italian", "Pizza"], priceRange: "$", rating: 4.4, description: "Wood-fired Neapolitan pizza", menuHighlights: ["Margherita", "Pepperoni", "Tiramisu"], dietaryOptions: ["vegetarian", "gluten-free"], spiceLevels: ["mild"], distance: 0.2 },
      { name: "Sakura Sushi", phone: "+1-212-555-0105", address: "555 Cherry Ln, New York, NY", cuisine: ["Japanese", "Sushi"], priceRange: "$$$", rating: 4.8, description: "Premium omakase", menuHighlights: ["Omakase", "Sashimi", "Dragon Roll"], dietaryOptions: ["gluten-free", "pescatarian"], spiceLevels: ["mild"], distance: 0.6 },
      { name: "El Mariachi Tacos", phone: "+1-212-555-0106", address: "888 Cactus Way, New York, NY", cuisine: ["Mexican", "Latin"], priceRange: "$", rating: 4.3, description: "Street-style tacos", menuHighlights: ["Carne Asada", "Al Pastor", "Churros"], dietaryOptions: ["vegetarian", "vegan", "gluten-free"], spiceLevels: ["mild", "medium", "hot"], distance: 0.3 },
      { name: "Mediterranean Grill", phone: "+1-212-555-0107", address: "222 Olive Dr, New York, NY", cuisine: ["Mediterranean", "Greek"], priceRange: "$$", rating: 4.5, description: "Fresh Mediterranean platters", menuHighlights: ["Gyro", "Falafel", "Hummus"], dietaryOptions: ["vegetarian", "vegan", "halal"], spiceLevels: ["mild", "medium"], distance: 0.4 },
      { name: "Seoul Kitchen", phone: "+1-212-555-0108", address: "999 Kimchi Blvd, New York, NY", cuisine: ["Korean", "BBQ"], priceRange: "$$", rating: 4.6, description: "Authentic Korean BBQ", menuHighlights: ["Korean BBQ", "Bibimbap", "Bulgogi"], dietaryOptions: ["vegetarian", "gluten-free"], spiceLevels: ["mild", "medium", "hot"], distance: 0.5 },
      { name: "Burger & Brew", phone: "+1-212-555-0109", address: "444 Patty Lane, New York, NY", cuisine: ["American", "Burgers"], priceRange: "$", rating: 4.2, description: "Craft burgers", menuHighlights: ["Smash Burger", "Truffle Fries", "Milkshakes"], dietaryOptions: ["vegetarian", "gluten-free"], spiceLevels: ["mild"], distance: 0.2 },
      { name: "Pho Vietnam", phone: "+1-212-555-0110", address: "777 Noodle St, New York, NY", cuisine: ["Vietnamese", "Asian"], priceRange: "$", rating: 4.5, description: "Traditional pho", menuHighlights: ["Pho Bo", "Banh Mi", "Spring Rolls"], dietaryOptions: ["vegetarian", "gluten-free"], spiceLevels: ["mild", "medium", "hot"], distance: 0.3 },
    ];
    for (const r of restaurants) await ctx.db.insert("restaurants", r);
    return { message: "Seeded 10 restaurants" };
  },
});
