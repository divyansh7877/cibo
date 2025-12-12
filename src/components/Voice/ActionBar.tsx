import { Mic, MicOff, Loader2, Search } from "lucide-react";
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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6 pt-3 sm:pt-4">
        {error && (
          <div className="mb-3 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg mx-auto max-w-sm">
            <p className="text-xs sm:text-sm text-rose-600 text-center">{error}</p>
          </div>
        )}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/80 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-4">
          <button
            onClick={onToggleVoice}
            disabled={isProcessing}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl transition-all duration-200 ease-in-out",
              isListening
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Mute</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Speak</span>
              </>
            )}
          </button>

          <div className="relative shrink-0">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30" />
            )}
            <div
              className={cn(
                "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
                voiceState === "idle" && "bg-gradient-accent",
                isListening && "bg-rose-500 scale-110",
                isProcessing && "bg-slate-400"
              )}
            >
              {voiceState === "idle" && <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              {isListening && <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />}
              {isProcessing && <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />}
            </div>
          </div>

          <button
            onClick={onBrowse}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 ease-in-out"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}
