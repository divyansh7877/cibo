import { Target, Search, Phone, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Phase } from "../../types";

const steps = [
  { id: "preference", label: "Preferences", icon: Target },
  { id: "discovery", label: "Discovery", icon: Search },
  { id: "ordering", label: "Ordering", icon: Phone },
];

export function AgentStatusPanel({ currentPhase }: { currentPhase: Phase }) {
  const getStatus = (stepId: string) => {
    const order = ["preference", "discovery", "ordering", "complete"];
    const curr = order.indexOf(currentPhase);
    const step = order.indexOf(stepId);
    if (currentPhase === "complete") return "complete";
    if (step < curr) return "complete";
    if (step === curr) return "active";
    return "pending";
  };

  return (
    <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, i) => {
          const status = getStatus(step.id);
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} className={cn("flex items-center", !isLast && "flex-1")}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  status === "complete" && "bg-emerald-500 text-white shadow-md shadow-emerald-200",
                  status === "active" && "bg-gradient-accent text-white shadow-lg shadow-accent-200 scale-105",
                  status === "pending" && "bg-slate-100 text-slate-400 border border-slate-200"
                )}>
                  {status === "complete" ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <span className={cn(
                  "mt-2 text-xs sm:text-sm font-medium transition-colors duration-300",
                  status === "active" && "text-accent-600",
                  status === "complete" && "text-emerald-600",
                  status === "pending" && "text-slate-400"
                )}>{step.label}</span>
              </div>
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-4 flex items-center justify-center">
                  <div className={cn(
                    "h-0.5 w-full rounded-full transition-colors duration-500",
                    getStatus(steps[i + 1].id) !== "pending" ? "bg-emerald-400" : "bg-slate-200"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
