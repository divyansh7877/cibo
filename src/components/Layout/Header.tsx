import { UserButton } from "@clerk/clerk-react";
import { UtensilsCrossed } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-accent-500" />
          <span className="text-xl font-bold text-gray-900">FoodAgent</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
