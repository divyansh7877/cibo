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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const status = getStatus(step.id);
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  status === "complete" && "bg-green-500 text-white",
                  status === "active" && "bg-primary-500 text-white animate-pulse-ring",
                  status === "pending" && "bg-gray-200 text-gray-400"
                )}>
                  {status === "complete" ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={cn("mt-2 text-sm font-medium",
                  status === "active" && "text-primary-600",
                  status === "complete" && "text-green-600",
                  status === "pending" && "text-gray-400"
                )}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("w-16 md:w-24 h-0.5 mx-2 md:mx-4 transition-colors",
                  getStatus(steps[i + 1].id) !== "pending" ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
