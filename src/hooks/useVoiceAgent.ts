import { useState, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { Conversation } from "@elevenlabs/client";
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
  const conversationRef = useRef<Conversation | null>(null);
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
    try {
      setVoiceState("processing");
      setError(null);
      console.log("Requesting microphone access...");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted, starting ElevenLabs session...");
      console.log("Agent ID:", agentId);
      const conversation = await Conversation.startSession({
        agentId,
        connectionType: "websocket",
        onConnect: () => {
          console.log("ElevenLabs connected");
          setVoiceState("listening");
        },
        onDisconnect: (details) => {
          console.log("ElevenLabs disconnected:", details);
          setVoiceState("idle");
          conversationRef.current = null;
        },
        onError: (message, context) => {
          console.error("ElevenLabs error:", message, context);
          setError(message);
        },
        onMessage: (msg) => {
          console.log("ElevenLabs message:", msg);
          if (msg.source === "ai" || msg.source === "user") {
            addTranscriptMessage(msg.source, msg.message);
          }
        },
        onModeChange: (prop) => {
          console.log("ElevenLabs mode:", prop.mode);
        },
        clientTools: {
          save_preferences: async (params: SavePreferencesParams) => {
            const preferenceId = await savePreferences({
              userId: userId as Id<"users">,
              sessionId,
              preferences: params,
            });
            onPreferencesComplete(String(preferenceId));
            return JSON.stringify({ preferenceId });
          },
        },
      });
      conversationRef.current = conversation;
      setVoiceState("listening");
    } catch (err) {
      console.error("Failed to start conversation:", err);
      const message = err instanceof Error ? err.message : "Failed to start conversation";
      if (message.includes("Permission denied") || message.includes("NotAllowedError")) {
        setError("Microphone access denied. Please allow microphone access and try again.");
      } else {
        setError(message);
      }
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
