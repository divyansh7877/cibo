import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { VoiceState } from "../../types";

interface VoiceButtonProps {
  voiceState: VoiceState;
  onToggle: () => void;
  error?: string | null;
}

export function VoiceButton({ voiceState, onToggle, error }: VoiceButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onToggle}
        disabled={voiceState === "processing"}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2",
          voiceState === "idle" && "bg-primary-500 hover:bg-primary-600 focus:ring-primary-300",
          voiceState === "listening" && "bg-red-500 hover:bg-red-600 animate-pulse-ring focus:ring-red-300",
          voiceState === "processing" && "bg-gray-400 cursor-not-allowed focus:ring-gray-300"
        )}
      >
        {voiceState === "idle" && <Mic className="w-8 h-8 text-white" />}
        {voiceState === "listening" && <MicOff className="w-8 h-8 text-white" />}
        {voiceState === "processing" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
      </button>
      <span className="text-sm text-gray-600">
        {voiceState === "idle" && "Tap to speak"}
        {voiceState === "listening" && "Listening... tap to stop"}
        {voiceState === "processing" && "Processing..."}
      </span>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}
