import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { initiateOrderCall } from "../lib/n8n";
import type { Restaurant } from "../types";

interface OrderCallParams {
  restaurant: Restaurant;
  orderItems: string[];
  customerName: string;
  userId: string;
  preferenceId: string;
}

export function useOrderCall() {
  const [isInitiating, setIsInitiating] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createOrder = useMutation(api.orders.createOrder);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const initiateCall = async ({ restaurant, orderItems, customerName, userId, preferenceId }: OrderCallParams) => {
    setIsInitiating(true);
    setError(null);
    try {
      const orderId = await createOrder({
        userId: userId as Id<"users">,
        restaurantId: restaurant._id as Id<"restaurants">,
        preferenceId: preferenceId as Id<"preferences">,
      });
      await updateOrderStatus({ orderId, status: "calling" });
      const response = await initiateOrderCall({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || "",
        phoneNumberId: "",
        restaurantPhone: restaurant.phone,
        restaurantName: restaurant.name,
        orderItems: orderItems.join(", "),
        customerName,
        orderId: String(orderId),
        convexUrl: import.meta.env.VITE_CONVEX_URL || "",
      });
      setCallId(response.callId);
      return { orderId: String(orderId), callId: response.callId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initiate call";
      setError(message);
      throw err;
    } finally {
      setIsInitiating(false);
    }
  };

  return { initiateCall, isInitiating, callId, error };
}
