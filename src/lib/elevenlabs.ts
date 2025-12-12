export interface SavePreferencesParams {
  cuisine?: string[];
  budget?: string;
  dietaryRestrictions?: string[];
  groupSize?: number;
  spiceLevel?: string;
  occasion?: string;
  location?: string;
}

declare global {
  interface Window {
    ElevenLabs?: {
      Conversation: {
        startSession: (config: any) => Promise<{ endSession: () => Promise<void> }>;
      };
    };
  }
}

export function getAgentId(): string {
  return import.meta.env.VITE_ELEVENLABS_AGENT_ID || "";
}
