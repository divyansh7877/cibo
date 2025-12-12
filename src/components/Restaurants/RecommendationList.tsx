import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { RefreshCw, Mic } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { RestaurantCard } from "./RestaurantCard";
import { Button } from "../ui/Button";
import type { Restaurant } from "../../types";

interface RecommendationListProps {
  preferenceId?: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onRefine: () => void;
  onStartOver: () => void;
}

export function RecommendationList({
  preferenceId,
  onSelectRestaurant,
  onRefine,
  onStartOver,
}: RecommendationListProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredRecommendations = useQuery(
    api.restaurants.getRecommendations,
    preferenceId ? { preferenceId: preferenceId as Id<"preferences"> } : "skip"
  ) as Restaurant[] | undefined;

  const allRestaurants = useQuery(
    api.restaurants.getAllRestaurants,
    preferenceId ? "skip" : {}
  ) as Restaurant[] | undefined;

  const recommendations = preferenceId ? filteredRecommendations : allRestaurants;

  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      setVisibleCards([]);
      setIsLoading(true);
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        recommendations.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards((prev) => [...prev, index]);
          }, index * 150);
        });
      }, 800);
      return () => clearTimeout(loadingTimer);
    }
  }, [recommendations]);

  if (recommendations === undefined || isLoading) {
    return (
      <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" />
          <p className="text-sm text-slate-500">Finding the perfect spots for you...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-8 text-center">
        <p className="text-slate-600 mb-4">
          No restaurants found matching your preferences.
        </p>
        <Button variant="secondary" onClick={onStartOver}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-600 mb-4 font-medium">
        {preferenceId
          ? "Based on your preferences, here are my top picks:"
          : "Browse our available restaurants:"}
      </p>

      <div className="space-y-4 mb-6">
        {recommendations.map((restaurant: Restaurant, index: number) => (
          <div
            key={restaurant._id}
            className={`transform transition-all duration-500 ease-in-out ${
              visibleCards.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <RestaurantCard
              restaurant={restaurant}
              rank={index + 1}
              onSelect={() => onSelectRestaurant(restaurant)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" onClick={onStartOver}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
        <Button variant="ghost" onClick={onRefine}>
          <Mic className="w-4 h-4 mr-2" />
          Refine Preferences
        </Button>
      </div>
    </div>
  );
}
