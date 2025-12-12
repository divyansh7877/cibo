import { makeFunctionReference } from "convex/server";

export const api = {
  users: {
    getOrCreateUser: makeFunctionReference<"mutation", any, any>("users:getOrCreateUser"),
    getUser: makeFunctionReference<"query", any, any>("users:getUser"),
  },
  preferences: {
    savePreferences: makeFunctionReference<"mutation", any, any>("preferences:savePreferences"),
    getPreferencesBySession: makeFunctionReference<"query", any, any>("preferences:getPreferencesBySession"),
  },
  restaurants: {
    getRecommendations: makeFunctionReference<"query", any, any>("restaurants:getRecommendations"),
    seedRestaurants: makeFunctionReference<"mutation", any, any>("restaurants:seedRestaurants"),
  },
  orders: {
    createOrder: makeFunctionReference<"mutation", any, any>("orders:createOrder"),
    updateOrderStatus: makeFunctionReference<"mutation", any, any>("orders:updateOrderStatus"),
    getOrderById: makeFunctionReference<"query", any, any>("orders:getOrderById"),
    getOrderWithDetails: makeFunctionReference<"query", any, any>("orders:getOrderWithDetails"),
  },
  conversations: {
    addMessage: makeFunctionReference<"mutation", any, any>("conversations:addMessage"),
    getConversation: makeFunctionReference<"query", any, any>("conversations:getConversation"),
    updateAgentPhase: makeFunctionReference<"mutation", any, any>("conversations:updateAgentPhase"),
  },
};
