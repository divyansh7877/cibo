import { internalMutation } from "./_generated/server";

export const seedAll = internalMutation({
  handler: async (ctx) => {
    const results: string[] = [];

    const existingRestaurants = await ctx.db.query("restaurants").first();
    if (!existingRestaurants) {
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
      results.push("Seeded 10 restaurants");
    } else {
      results.push("Restaurants already seeded");
    }

    const existingPreferences = await ctx.db.query("preferences").first();
    if (!existingPreferences) {
      const users = await ctx.db.query("users").collect();
      if (users.length === 0) {
        results.push("No users found. Please sign in first to create a user.");
      } else {
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
        results.push(`Seeded ${samplePreferences.length} preferences`);
      }
    } else {
      results.push("Preferences already seeded");
    }

    const existingOrders = await ctx.db.query("orders").first();
    if (!existingOrders) {
      const users = await ctx.db.query("users").collect();
      const restaurants = await ctx.db.query("restaurants").collect();
      const preferences = await ctx.db.query("preferences").collect();

      if (users.length === 0 || restaurants.length === 0 || preferences.length === 0) {
        results.push("Cannot seed orders: missing users, restaurants, or preferences");
      } else {
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
        results.push(`Seeded ${sampleOrders.length} orders`);
      }
    } else {
      results.push("Orders already seeded");
    }

    return { message: "Seeding completed", results };
  },
});
