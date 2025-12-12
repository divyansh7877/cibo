import { useState, useEffect } from "react";
import { Phone, X } from "lucide-react";
import { useOrder } from "../../hooks/useOrder";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import type { Restaurant } from "../../types";

interface CallInProgressProps {
  restaurant: Restaurant;
  orderId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export function CallInProgress({ restaurant, orderId, onComplete, onCancel }: CallInProgressProps) {
  const [duration, setDuration] = useState(0);
  const { order } = useOrder(orderId);

  useEffect(() => {
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (order?.status === "confirmed" || order?.status === "failed") onComplete();
  }, [order?.status, onComplete]);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <Card className="text-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-pulse-ring">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Connected</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{restaurant.name}</p>
            <p className="text-gray-500">{restaurant.phone}</p>
          </div>
          <p className="text-3xl font-mono text-gray-700">{formatDuration(duration)}</p>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Live Transcript</h3>
        <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-48 overflow-y-auto">
          {order?.callTranscript ? <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.callTranscript}</p> : <p className="text-sm text-gray-400 italic">Transcript will appear here...</p>}
        </div>
      </Card>
      <div className="flex justify-center">
        <Button variant="danger" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel Call</Button>
      </div>
    </div>
  );
}
