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
        "feature-card-glow glass-card group relative overflow-hidden rounded-[20px] border border-border/80 p-7 shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-card-hover",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-lg transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:shadow-glow",
          gradient
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-6 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
