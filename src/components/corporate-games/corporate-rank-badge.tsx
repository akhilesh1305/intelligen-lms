import { cn } from "@/lib/utils";
import {
  computeCorporateRank,
  type CorporateRank,
  CORPORATE_TRAINEE,
} from "@/lib/corporate-game-ranks";

export function CorporateRankBadge({
  weeklyPoints,
  gamesPlayed,
  size = "md",
}: {
  weeklyPoints: number;
  gamesPlayed: number;
  size?: "sm" | "md";
}) {
  const rank = computeCorporateRank(weeklyPoints, gamesPlayed);
  const isTrainee = rank.id === CORPORATE_TRAINEE.id;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        isTrainee ? CORPORATE_TRAINEE.bg : (rank as CorporateRank).bg,
        isTrainee ? CORPORATE_TRAINEE.color : (rank as CorporateRank).color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      )}
    >
      <span>{rank.icon}</span>
      {rank.label}
    </span>
  );
}
