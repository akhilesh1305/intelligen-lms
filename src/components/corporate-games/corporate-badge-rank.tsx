import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { CorporateBadgeRankInfo } from "@/lib/corporate-game-badges";

export function CorporateBadgeRank({
  rank,
  size = "md",
  showProgress = true,
  className,
}: {
  rank: CorporateBadgeRankInfo;
  size?: "sm" | "md";
  showProgress?: boolean;
  className?: string;
}) {
  const { tier, totalPoints, pointsToNextRank, nextTier, progressPercent } =
    rank;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full font-semibold",
            tier ? tier.bg : "bg-slate-100 dark:bg-slate-800",
            tier ? tier.color : "text-muted",
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
          )}
        >
          <span>{tier?.icon ?? "🌱"}</span>
          {tier ? tier.name.replace(" Mastery", "") : "Unranked"}
        </span>
        <span
          className={cn(
            "text-muted",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {totalPoints.toLocaleString()} corporate pts
        </span>
      </div>

      {showProgress && nextTier ? (
        <div className="space-y-1">
          <div
            className={cn(
              "flex justify-between text-muted",
              size === "sm" ? "text-[10px]" : "text-xs"
            )}
          >
            <span>
              {tier
                ? `Progress to ${nextTier.name.replace(" Mastery", "")}`
                : `Next: ${nextTier.name.replace(" Mastery", "")}`}
            </span>
            <span>
              {pointsToNextRank !== null
                ? `${pointsToNextRank} pts to go`
                : null}
            </span>
          </div>
          <ProgressBar value={progressPercent} />
        </div>
      ) : showProgress && tier ? (
        <p
          className={cn(
            "text-muted",
            size === "sm" ? "text-[10px]" : "text-xs"
          )}
        >
          Max mastery rank reached
        </p>
      ) : null}
    </div>
  );
}
