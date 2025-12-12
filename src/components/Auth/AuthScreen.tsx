import { SignInButton } from "@clerk/clerk-react";
import { UtensilsCrossed, Mic, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function AuthScreen() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-gradient-card rounded-2xl shadow-card border border-slate-200 p-10 max-w-md w-full">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-accent rounded-xl shadow-warm">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Cibo</h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Tell me what you're craving.<br />I'll find it and order it.
            </p>

            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-accent-500" />
                <span>Voice powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>AI ordering</span>
              </div>
            </div>

            <SignInButton mode="modal">
              <Button size="lg" className="w-full">Get Started</Button>
            </SignInButton>
          </div>
        </div>
      </div>
      <footer className="py-6 text-center">
        <p className="text-sm text-slate-500">Built with ElevenLabs, Convex, Clerk, and N8N</p>
      </footer>
    </div>
  );
}
