import { cn } from "@/lib/utils";
import type { CorporatePerformanceTier } from "@/lib/corporate-game-badges";

export function CorporateGameBadge({
  icon,
  name,
  description,
  tier,
  size = "md",
  className,
}: {
  icon: string;
  name: string;
  description?: string;
  tier?: Pick<CorporatePerformanceTier, "color" | "bg">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        size === "sm" && "gap-1",
        size === "md" && "gap-2",
        size === "lg" && "gap-3",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          tier?.bg ?? "bg-slate-100 dark:bg-slate-800",
          tier?.color ?? "text-ink",
          size === "sm" && "h-10 w-10 text-lg",
          size === "md" && "h-14 w-14 text-2xl",
          size === "lg" && "h-16 w-16 text-3xl"
        )}
      >
        {icon}
      </span>
      <div>
        <p
          className={cn(
            "font-semibold text-ink",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {name}
        </p>
        {description ? (
          <p
            className={cn(
              "text-muted",
              size === "sm" && "text-[10px]",
              size === "md" && "text-xs",
              size === "lg" && "text-sm"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
