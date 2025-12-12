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
    <div className="bg-gradient-card rounded-xl shadow-card p-6 border border-slate-200 hover:shadow-md hover:border-slate-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            {rank === 1 && <Trophy className="w-5 h-5 text-amber-500" />}
            <span className={`text-sm font-medium ${rank === 1 ? "text-amber-600" : "text-slate-500"}`}>
              {rank === 1 ? "Top Match" : `#${rank}`}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mt-1">{restaurant.name}</h3>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{restaurant.rating}</span>
        <span className="text-slate-400">|</span>
        <span>{restaurant.priceRange}</span>
        <span className="text-slate-400">|</span>
        <span>{restaurant.cuisine[0]}</span>
        <span className="text-slate-400">|</span>
        <span>{restaurant.distance} mi</span>
      </div>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{restaurant.description}</p>
      <Button onClick={onSelect} className="w-full">Order This</Button>
    </div>
  );
}
