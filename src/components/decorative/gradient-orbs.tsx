import { cn } from "@/lib/utils";

export function GradientOrbs({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "section" | "subtle";
}) {
  const sizes =
    variant === "hero"
      ? "h-72 w-72 sm:h-96 sm:w-96"
      : variant === "section"
        ? "h-48 w-48 sm:h-64 sm:w-64"
        : "h-32 w-32";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "absolute -left-20 top-0 animate-float rounded-full bg-brand-500/25 blur-3xl",
          sizes
        )}
      />
      <div
        className={cn(
          "absolute -right-16 bottom-0 animate-float rounded-full bg-accent-cyan/20 blur-3xl",
          sizes
        )}
        style={{ animationDelay: "2s" }}
      />
      <div
        className={cn(
          "absolute left-1/2 top-1/3 -translate-x-1/2 animate-pulse-glow rounded-full bg-accent-violet/15 blur-3xl",
          variant === "hero" ? "h-56 w-56" : "h-40 w-40"
        )}
      />
    </div>
  );
}
