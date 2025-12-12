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
  const filteredRecommendations = useQuery(
    api.restaurants.getRecommendations,
    preferenceId ? { preferenceId: preferenceId as Id<"preferences"> } : "skip"
  ) as Restaurant[] | undefined;

  const allRestaurants = useQuery(
    api.restaurants.getAllRestaurants,
    preferenceId ? "skip" : {}
  ) as Restaurant[] | undefined;

  const recommendations = preferenceId ? filteredRecommendations : allRestaurants;

  if (recommendations === undefined) {
    return (
      <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" />
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
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            rank={index + 1}
            onSelect={() => onSelectRestaurant(restaurant)}
          />
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
