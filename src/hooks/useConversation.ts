import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Conversation } from "../types";

export function useConversation(sessionId: string) {
  const conversation = useQuery(api.conversations.getConversation, { sessionId }) as Conversation | null | undefined;
  return {
    messages: conversation?.messages || [],
    agentPhase: conversation?.agentPhase || "preference",
    isLoading: conversation === undefined,
  };
}
