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
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/80 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onToggleVoice}
            disabled={isProcessing}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 sm:gap-2.5 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-medium transition-all duration-200 ease-in-out",
              isListening && "bg-gradient-accent text-white shadow-lg animate-pulse-glow",
              isProcessing && "bg-slate-200 text-slate-500 cursor-not-allowed",
              voiceState === "idle" && "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base">Processing...</span>
              </>
            ) : isListening ? (
              <>
                <MicOff className="w-5 h-5 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Speak</span>
              </>
            )}
          </button>

          <button
            onClick={onBrowse}
            className="flex-1 flex items-center justify-center gap-2 sm:gap-2.5 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all duration-200 ease-in-out"
          >
            <Search className="w-5 h-5 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}
