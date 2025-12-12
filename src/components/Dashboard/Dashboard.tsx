import { useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { UtensilsCrossed } from "lucide-react";
import { Header } from "../Layout/Header";
import { AgentStatusPanel } from "./AgentStatusPanel";
import { ConversationPanel } from "./ConversationPanel";
import { VoiceButton } from "../Voice/VoiceButton";
import { RecommendationList } from "../Restaurants/RecommendationList";
import { CallInProgress } from "../Order/CallInProgress";
import { OrderConfirmation } from "../Order/OrderConfirmation";
import { Button } from "../ui/Button";
import { useUserSync } from "../../hooks/useUserSync";
import { useVoiceAgent } from "../../hooks/useVoiceAgent";
import { useOrderCall } from "../../hooks/useOrderCall";
import { generateSessionId } from "../../lib/utils";
import type { Phase, Restaurant } from "../../types";

export function Dashboard() {
  const { user } = useUser();
  const { userId, isLoading: isUserLoading } = useUserSync();
  const [phase, setPhase] = useState<Phase>("preference");
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePreferencesComplete = useCallback((prefId: string) => {
    setPreferenceId(prefId);
    setPhase("discovery");
  }, []);

  const { voiceState, transcript, error, toggleConversation } = useVoiceAgent({
    sessionId,
    userId,
    onPreferencesComplete: handlePreferencesComplete,
  });

  const { initiateCall, isInitiating } = useOrderCall();

  const handleSelectRestaurant = async (restaurant: Restaurant) => {
    if (!userId) return;
    setSelectedRestaurant(restaurant);
    setPhase("ordering");
    try {
      const result = await initiateCall({
        restaurant,
        orderItems: restaurant.menuHighlights.slice(0, 2),
        customerName: user?.fullName || user?.firstName || "Customer",
        userId,
        preferenceId: preferenceId || undefined,
      });
      setOrderId(result.orderId);
    } catch {
      setPhase("discovery");
    }
  };

  const handleNewOrder = () => {
    setPhase("preference");
    setSessionId(generateSessionId());
    setPreferenceId(null);
    setSelectedRestaurant(null);
    setOrderId(null);
  };

  if (isUserLoading) {
    return <div className="min-h-screen bg-gradient-warm flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <AgentStatusPanel currentPhase={phase} />
        {phase === "preference" && (
          <>
            <ConversationPanel messages={transcript} />
            <VoiceButton voiceState={voiceState} onToggle={toggleConversation} error={error} />
            <div className="mt-6 flex justify-center">
              <Button variant="secondary" onClick={() => setPhase("discovery")}>
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Browse Restaurants
              </Button>
            </div>
          </>
        )}
        {phase === "discovery" && (
          <RecommendationList preferenceId={preferenceId} onSelectRestaurant={handleSelectRestaurant} onRefine={() => setPhase("preference")} onStartOver={handleNewOrder} />
        )}
        {phase === "ordering" && selectedRestaurant && orderId && (
          <CallInProgress restaurant={selectedRestaurant} orderId={orderId} onComplete={() => setPhase("complete")} onCancel={() => { setPhase("discovery"); setOrderId(null); }} />
        )}
        {phase === "ordering" && isInitiating && (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" /><span className="ml-3 text-gray-600">Initiating call...</span></div>
        )}
        {phase === "complete" && orderId && (
          <OrderConfirmation orderId={orderId} onNewOrder={handleNewOrder} />
        )}
      </main>
    </div>
  );
}
