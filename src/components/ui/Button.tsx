import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-gradient-accent text-white hover:scale-[1.02] shadow-warm focus:ring-accent-500",
        variant === "secondary" && "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 focus:ring-slate-400",
        variant === "success" && "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm focus:ring-emerald-500",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600 shadow-sm focus:ring-rose-500",
        variant === "ghost" && "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
