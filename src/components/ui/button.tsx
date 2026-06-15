import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "soft"
  | "ghost"
  | "danger"
  | "accent";
type Size = "sm" | "md" | "lg";

const softStyle =
  "bg-slate-100/80 text-ink shadow-sm hover:bg-slate-200/90 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm hover:from-brand-600 hover:to-brand-700 active:from-brand-700 active:to-brand-800 dark:from-brand-500 dark:to-brand-600 dark:hover:from-brand-400 dark:hover:to-brand-500",
  accent:
    "bg-ink text-white shadow-sm hover:bg-slate-800 active:bg-black dark:bg-panel dark:text-ink dark:border dark:border-border dark:hover:bg-slate-800 dark:hover:text-white",
  secondary:
    "border border-border bg-panel text-ink shadow-sm hover:bg-surface dark:hover:bg-slate-800",
  outline: softStyle,
  soft: softStyle,
  ghost:
    "text-muted hover:bg-surface hover:text-ink dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-10 min-h-11 px-4 text-sm",
  md: "h-11 px-5 text-sm font-semibold",
  lg: "h-12 px-8 text-base font-semibold",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
