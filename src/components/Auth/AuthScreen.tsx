import { SignInButton } from "@clerk/clerk-react";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "../ui/Button";

export function AuthScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <UtensilsCrossed className="w-12 h-12 text-accent-500" />
            <h1 className="text-4xl font-bold text-gray-900">FoodAgent</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Tell me what you're craving.<br />I'll find it and order it.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" className="w-full max-w-xs">Sign in with Google</Button>
          </SignInButton>
        </div>
      </div>
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-500">Built with ElevenLabs, Convex, Clerk, and N8N</p>
      </footer>
    </div>
  );
}
