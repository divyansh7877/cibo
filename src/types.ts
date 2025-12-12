export type Phase = "preference" | "discovery" | "ordering" | "complete";
export type VoiceState = "idle" | "listening" | "processing";

export interface Message {
  role: string;
  content: string;
  timestamp: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  phone: string;
  address: string;
  cuisine: string[];
  priceRange: string;
  rating: number;
  description: string;
  menuHighlights: string[];
  dietaryOptions: string[];
  spiceLevels: string[];
  distance: number;
  score?: number;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  preferenceId: string;
  items: OrderItem[];
  status: string;
  callTranscript?: string;
  confirmationNumber?: string;
  estimatedPickupTime?: string;
  createdAt: number;
  restaurant?: Restaurant;
}

export interface OrderItem {
  name: string;
  price: number;
  notes?: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  sessionId: string;
  messages: Message[];
  agentPhase: string;
  createdAt: number;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  createdAt: number;
}
