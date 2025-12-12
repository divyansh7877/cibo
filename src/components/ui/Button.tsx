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
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
        variant === "secondary" && "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
        variant === "success" && "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
        variant === "ghost" && "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
