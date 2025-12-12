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
    <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-8">
      <div className="flex flex-col items-center gap-5">
        <div className={cn(
          "relative rounded-full p-1",
          voiceState === "idle" && "bg-accent-100",
          voiceState === "listening" && "bg-rose-100",
          voiceState === "processing" && "bg-slate-100"
        )}>
          {voiceState === "listening" && (
            <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-20" />
          )}
          <button
            onClick={onToggle}
            disabled={voiceState === "processing"}
            className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg focus:outline-none",
              voiceState === "idle" && "bg-gradient-accent hover:scale-105 ring-glow",
              voiceState === "listening" && "bg-rose-500 hover:bg-rose-600 shadow-rose-200",
              voiceState === "processing" && "bg-slate-400 cursor-not-allowed"
            )}
          >
            {voiceState === "idle" && <Mic className="w-8 h-8 text-white" />}
            {voiceState === "listening" && <MicOff className="w-8 h-8 text-white" />}
            {voiceState === "processing" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          </button>
        </div>
        <div className="text-center">
          <span className={cn(
            "text-sm font-medium",
            voiceState === "idle" && "text-slate-600",
            voiceState === "listening" && "text-rose-600",
            voiceState === "processing" && "text-slate-500"
          )}>
            {voiceState === "idle" && "Tap to speak"}
            {voiceState === "listening" && "Listening... tap to stop"}
            {voiceState === "processing" && "Processing..."}
          </span>
        </div>
        {error && (
          <div className="mt-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-sm text-rose-600 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
