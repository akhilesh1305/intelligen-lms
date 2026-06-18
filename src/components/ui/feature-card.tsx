import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "from-brand-500 to-accent-cyan",
  compact = false,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "feature-card-glow glass-card group relative overflow-hidden rounded-[20px] border border-border/80 shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-brand-400/30 motion-safe:hover:shadow-card-hover",
        compact ? "p-5" : "p-7",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-lg transition-transform duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:shadow-glow",
          gradient
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className={cn("text-lg font-bold text-ink", compact ? "mt-4" : "mt-6")}>{title}</h3>
      <p className={cn("text-sm leading-relaxed text-muted", compact ? "mt-2" : "mt-2.5")}>
        {description}
      </p>
    </article>
  );
}
