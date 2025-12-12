import { useState, useEffect } from "react";
import { Phone, CheckCircle, UtensilsCrossed, Clock, ChefHat } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import type { Restaurant } from "../../types";

interface MockOrderScreenProps {
  restaurant: Restaurant;
  customerName: string;
  onComplete: () => void;
  onNewOrder: () => void;
}

const ORDER_STEPS = [
  { label: "Connecting to restaurant", duration: 2000 },
  { label: "Placing your order", duration: 3000 },
  { label: "Confirming details", duration: 2000 },
  { label: "Order confirmed!", duration: 1500 },
];

export function MockOrderScreen({ restaurant, customerName, onComplete, onNewOrder }: MockOrderScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber] = useState(() => `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [pickupTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 25 + Math.floor(Math.random() * 15));
    return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  });

  useEffect(() => {
    if (currentStep < ORDER_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, ORDER_STEPS[currentStep].duration);
      return () => clearTimeout(timer);
    } else if (currentStep === ORDER_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, ORDER_STEPS[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const selectedItems = restaurant.menuHighlights.slice(0, 2);

  if (isComplete) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Order Placed!</h2>
            <p className="text-slate-600">Your order has been successfully placed at</p>
            <p className="text-xl font-semibold text-slate-800">{restaurant.name}</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-800 mb-4">Order Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Estimated pickup: <strong className="text-slate-800">{pickupTime}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <ChefHat className="w-5 h-5 text-emerald-500" />
              <span>Order #: <strong className="text-slate-800 font-mono">{orderNumber}</strong></span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">Items ordered:</p>
            <ul className="space-y-1">
              {selectedItems.map((item, i) => (
                <li key={i} className="text-slate-700">{item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-600">
              Ordered for: <strong>{customerName}</strong>
            </p>
            <p className="text-sm text-slate-500 mt-1">{restaurant.address}</p>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button onClick={onNewOrder}>
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            Start New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="text-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center animate-pulse shadow-lg">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 whitespace-nowrap">
              In Progress
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-800">{restaurant.name}</p>
            <p className="text-slate-500">{restaurant.phone}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Ordering on your behalf...</h3>
        <div className="space-y-3">
          {ORDER_STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                i < currentStep
                  ? "bg-emerald-50 border border-emerald-200"
                  : i === currentStep
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-slate-50 border border-slate-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i < currentStep
                    ? "bg-emerald-500 text-white"
                    : i === currentStep
                    ? "bg-amber-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm ${
                  i < currentStep
                    ? "text-emerald-700 font-medium"
                    : i === currentStep
                    ? "text-amber-700 font-medium"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
              {i === currentStep && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600 mb-2">Items being ordered:</p>
          <ul className="space-y-1">
            {selectedItems.map((item, i) => (
              <li key={i} className="text-slate-700 text-sm">{item}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
