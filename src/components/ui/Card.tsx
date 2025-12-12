import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-gradient-card rounded-xl shadow-card border border-slate-200 p-6 hover:shadow-md", className)} {...props} />
  )
);
Card.displayName = "Card";
