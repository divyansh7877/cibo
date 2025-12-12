import { UserButton } from "@clerk/clerk-react";
import { UtensilsCrossed } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-accent rounded-lg shadow-warm">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">Cibo</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
