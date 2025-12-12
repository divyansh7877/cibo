import { Mic, MicOff, Loader2, UtensilsCrossed } from "lucide-react";
import { cn } from "../../lib/utils";
import type { VoiceState } from "../../types";

interface ActionBarProps {
  voiceState: VoiceState;
  onToggleVoice: () => void;
  onBrowse: () => void;
  error?: string | null;
}

export function ActionBar({ voiceState, onToggleVoice, onBrowse, error }: ActionBarProps) {
  const isListening = voiceState === "listening";
  const isProcessing = voiceState === "processing";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 pb-6 pt-4">
        {error && (
          <div className="mb-3 px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg mx-auto max-w-sm">
            <p className="text-sm text-rose-600 text-center">{error}</p>
          </div>
        )}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/80 p-3 flex items-center gap-3">
          <button
            onClick={onBrowse}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 ease-in-out group"
          >
            <UtensilsCrossed className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Browse</span>
          </button>

          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30" />
            )}
            <button
              onClick={onToggleVoice}
              disabled={isProcessing}
              className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
                voiceState === "idle" && "bg-gradient-accent hover:scale-105 focus:ring-accent-500",
                isListening && "bg-rose-500 hover:bg-rose-600 scale-110 focus:ring-rose-500",
                isProcessing && "bg-slate-400 cursor-not-allowed"
              )}
            >
              {voiceState === "idle" && <Mic className="w-7 h-7 text-white" />}
              {isListening && <MicOff className="w-7 h-7 text-white" />}
              {isProcessing && <Loader2 className="w-7 h-7 text-white animate-spin" />}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <span className={cn(
              "text-sm font-medium text-center transition-colors duration-200",
              voiceState === "idle" && "text-slate-500",
              isListening && "text-rose-600",
              isProcessing && "text-slate-400"
            )}>
              {voiceState === "idle" && "Tap to speak"}
              {isListening && "Listening..."}
              {isProcessing && "Processing..."}
            </span>
          </div>
        </div>
      </div>
      <div className="h-safe-area-inset-bottom bg-gradient-to-t from-white/80 to-transparent" />
    </div>
  );
}
