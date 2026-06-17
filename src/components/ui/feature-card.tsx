import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "from-brand-500 to-accent-cyan",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "feature-card-glow group relative overflow-hidden rounded-2xl border border-border bg-panel/80 p-6 shadow-card backdrop-blur-sm transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-card-hover",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow",
          gradient
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
