import { useQuery } from "convex/react";
import { RefreshCw, Mic } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { RestaurantCard } from "./RestaurantCard";
import { Button } from "../ui/Button";
import type { Restaurant } from "../../types";

interface RecommendationListProps {
  preferenceId: string;
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
  const recommendations = useQuery(api.restaurants.getRecommendations, {
    preferenceId,
  }) as Restaurant[] | undefined;

  if (recommendations === undefined) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-600 mb-4">
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
      <p className="text-gray-600 mb-4">
        Based on your preferences, here are my top picks:
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
