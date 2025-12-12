import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Order } from "../types";

export function useOrder(orderId: string | null) {
  const order = useQuery(api.orders.getOrderWithDetails, orderId ? { orderId } : "skip") as Order | null | undefined;
  return {
    order,
    isLoading: orderId !== null && order === undefined,
    status: order?.status || "pending",
  };
}
