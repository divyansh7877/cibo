import { useState, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { getAgentId, type SavePreferencesParams } from "../lib/elevenlabs";
import type { Message, VoiceState } from "../types";

interface UseVoiceAgentProps {
  sessionId: string;
  userId: string | null;
  onPreferencesComplete: (preferenceId: string) => void;
}

export function useVoiceAgent({ sessionId, userId, onPreferencesComplete }: UseVoiceAgentProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<{ endSession: () => Promise<void> } | null>(null);
  const addMessage = useMutation(api.conversations.addMessage);
  const savePreferences = useMutation(api.preferences.savePreferences);

  const addTranscriptMessage = useCallback((role: string, content: string) => {
    const message: Message = { role, content, timestamp: Date.now() };
    setTranscript((prev) => [...prev, message]);
    if (userId) addMessage({ sessionId, userId: userId as Id<"users">, role, content });
  }, [sessionId, userId, addMessage]);

  const startConversation = useCallback(async () => {
    if (!userId) { setError("User not authenticated"); return; }
    const agentId = getAgentId();
    if (!agentId) { setError("ElevenLabs agent not configured"); return; }
    if (!window.ElevenLabs) { setError("ElevenLabs SDK not loaded"); return; }
    try {
      setVoiceState("listening");
      setError(null);
      const conversation = await window.ElevenLabs.Conversation.startSession({
        agentId,
        onConnect: () => setVoiceState("listening"),
        onDisconnect: () => { setVoiceState("idle"); conversationRef.current = null; },
        onMessage: (msg: any) => addTranscriptMessage(msg.role, msg.content),
        onToolCall: async (toolName: string, params: any) => {
          if (toolName === "save_preferences") {
            const preferenceId = await savePreferences({
              userId: userId as Id<"users">,
              sessionId,
              preferences: params as SavePreferencesParams,
            });
            onPreferencesComplete(String(preferenceId));
            return { preferenceId };
          }
          return {};
        },
      });
      conversationRef.current = conversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start conversation");
      setVoiceState("idle");
    }
  }, [userId, sessionId, addTranscriptMessage, savePreferences, onPreferencesComplete]);

  const endConversation = useCallback(async () => {
    if (conversationRef.current) {
      setVoiceState("processing");
      await conversationRef.current.endSession();
      conversationRef.current = null;
      setVoiceState("idle");
    }
  }, []);

  const toggleConversation = useCallback(async () => {
    if (voiceState === "idle") await startConversation();
    else if (voiceState === "listening") await endConversation();
  }, [voiceState, startConversation, endConversation]);

  return { voiceState, transcript, error, startConversation, endConversation, toggleConversation };
}
