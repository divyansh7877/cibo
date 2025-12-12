import { useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { Header } from "../Layout/Header";
import { AgentStatusPanel } from "./AgentStatusPanel";
import { ConversationPanel } from "./ConversationPanel";
import { ActionBar } from "../Voice/ActionBar";
import { RecommendationList } from "../Restaurants/RecommendationList";
import { MockOrderScreen } from "../Order/MockOrderScreen";
import { useUserSync } from "../../hooks/useUserSync";
import { useVoiceAgent } from "../../hooks/useVoiceAgent";
import { generateSessionId } from "../../lib/utils";
import type { Phase, Restaurant } from "../../types";

export function Dashboard() {
  const { user } = useUser();
  const { userId, isLoading: isUserLoading } = useUserSync();
  const [phase, setPhase] = useState<Phase>("preference");
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handlePreferencesComplete = useCallback((prefId: string) => {
    setPreferenceId(prefId);
    setPhase("discovery");
  }, []);

  const { voiceState, transcript, error, toggleConversation } = useVoiceAgent({
    sessionId,
    userId,
    onPreferencesComplete: handlePreferencesComplete,
  });

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setPhase("ordering");
  };

  const handleNewOrder = () => {
    setPhase("preference");
    setSessionId(generateSessionId());
    setPreferenceId(null);
    setSelectedRestaurant(null);
  };

  if (isUserLoading) {
    return <div className="min-h-screen bg-gradient-warm flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>;
  }

  return (
    <div className="h-screen bg-gradient-warm flex flex-col overflow-hidden">
      <Header />
      {phase === "preference" ? (
        <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 min-h-0">
          <AgentStatusPanel currentPhase={phase} />
          <ConversationPanel messages={transcript} />
          <ActionBar
            voiceState={voiceState}
            onToggleVoice={toggleConversation}
            onBrowse={() => setPhase("discovery")}
            error={error}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 overflow-y-auto">
          <AgentStatusPanel currentPhase={phase} />
          {phase === "discovery" && (
            <RecommendationList preferenceId={preferenceId} onSelectRestaurant={handleSelectRestaurant} onRefine={() => setPhase("preference")} onStartOver={handleNewOrder} />
          )}
          {(phase === "ordering" || phase === "complete") && selectedRestaurant && (
            <MockOrderScreen
              restaurant={selectedRestaurant}
              customerName={user?.fullName || user?.firstName || "Customer"}
              onComplete={() => setPhase("complete")}
              onNewOrder={handleNewOrder}
            />
          )}
        </main>
      )}
    </div>
  );
}
