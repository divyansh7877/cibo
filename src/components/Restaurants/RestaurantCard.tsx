import { Star, Trophy } from "lucide-react";
import { Button } from "../ui/Button";
import type { Restaurant } from "../../types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  rank: number;
  onSelect: () => void;
}

export function RestaurantCard({ restaurant, rank, onSelect }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            {rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
            <span className="text-sm text-gray-500 font-medium">{rank === 1 ? "Top Match" : `#${rank}`}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-1">{restaurant.name}</h3>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{restaurant.rating}</span>
        <span>{restaurant.priceRange}</span>
        <span>{restaurant.cuisine[0]}</span>
        <span>{restaurant.distance} mi</span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{restaurant.description}</p>
      <Button onClick={onSelect} className="w-full">Order This</Button>
    </div>
  );
}
