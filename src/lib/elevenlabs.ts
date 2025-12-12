export interface SavePreferencesParams {
  cuisine?: string[];
  budget?: string;
  dietaryRestrictions?: string[];
  groupSize?: number;
  spiceLevel?: string;
  occasion?: string;
  location?: string;
}

export function getAgentId(): string {
  return import.meta.env.VITE_ELEVENLABS_AGENT_ID || "";
}
