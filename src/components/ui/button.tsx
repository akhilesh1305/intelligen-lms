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
  "bg-slate-100/80 text-ink shadow-sm hover:bg-slate-200/90 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-700/80";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 via-brand-500 to-accent-cyan text-white btn-glow hover:from-brand-600 hover:via-brand-500 hover:to-cyan-500 motion-safe:hover:scale-[1.02] dark:from-brand-500 dark:to-cyan-600",
  accent:
    "bg-primary text-white shadow-sm hover:bg-slate-800 motion-safe:hover:scale-[1.02] dark:bg-panel dark:text-ink dark:border dark:border-border dark:hover:bg-slate-800 dark:hover:text-white",
  secondary:
    "border border-border bg-panel/80 text-ink shadow-sm backdrop-blur-sm hover:bg-surface hover:border-brand-300/50 dark:hover:bg-slate-800/80",
  outline: softStyle,
  soft: softStyle,
  ghost:
    "text-muted hover:bg-surface hover:text-ink dark:hover:bg-slate-800/60",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm dark:bg-red-600 dark:hover:bg-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-10 min-h-11 px-4 text-sm rounded-[14px]",
  md: "h-11 px-5 text-sm font-semibold rounded-[14px]",
  lg: "h-12 px-8 text-base font-semibold rounded-[14px]",
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
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
