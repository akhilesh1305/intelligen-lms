import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CORPORATE_RANKS, CORPORATE_TRAINEE } from "@/lib/corporate-game-ranks";
import {
  CORPORATE_MASTERY_TIERS,
  CORPORATE_PERFORMANCE_TIERS,
} from "@/lib/corporate-game-badges";

function TierListItem({
  icon,
  name,
  description,
  iconMuted,
}: {
  icon: string;
  name: string;
  description: string;
  iconMuted?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className={cn("text-xl", iconMuted && "text-muted")}>{icon}</span>
      <div>
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-muted">{description}</p>
      </div>
    </li>
  );
}

export function CorporateAchievementLevels({
  showWeeklyRanks = true,
  showMasteryTiers = true,
  showPerformanceTiers = false,
  className,
}: {
  showWeeklyRanks?: boolean;
  showMasteryTiers?: boolean;
  showPerformanceTiers?: boolean;
  className?: string;
}) {
  const ranksAsc = [...CORPORATE_RANKS].reverse();
  const masteryAsc = [...CORPORATE_MASTERY_TIERS].reverse();
  const performanceAsc = [...CORPORATE_PERFORMANCE_TIERS].reverse();
  const lowestRank = ranksAsc[0];

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        {showMasteryTiers ? (
          <>
            <h3 className="font-bold text-ink">Mastery badge tiers</h3>
            <p className="mt-1 text-sm text-muted">
              Lifetime corporate game points — never reset
            </p>
            <ul className="mt-4 space-y-3">
              <TierListItem
                icon="○"
                name="No badge"
                description="Below 50 total pts"
                iconMuted
              />
              {masteryAsc.map((tier) => (
                <TierListItem
                  key={tier.id}
                  icon={tier.icon}
                  name={tier.name.replace(" Mastery", "")}
                  description={`${tier.minPoints.toLocaleString()}+ total pts`}
                />
              ))}
            </ul>
          </>
        ) : null}

        {showMasteryTiers && showWeeklyRanks ? (
          <hr className="my-6 border-border" />
        ) : null}

        {showWeeklyRanks ? (
          <>
            <h3 className="font-bold text-ink">Weekly corporate ranks</h3>
            <p className="mt-1 text-sm text-muted">
              Based on this week&apos;s points or games played — resets Monday UTC
            </p>
            <ul className="mt-4 space-y-3">
              <TierListItem
                icon={CORPORATE_TRAINEE.icon}
                name={CORPORATE_TRAINEE.label}
                description={
                  lowestRank
                    ? `Below ${lowestRank.minWeeklyPoints} pts or fewer than ${lowestRank.minGamesPlayed} games this week`
                    : "Below rank thresholds this week"
                }
                iconMuted
              />
              {ranksAsc.map((rank) => (
                <TierListItem
                  key={rank.id}
                  icon={rank.icon}
                  name={rank.label}
                  description={`${rank.minWeeklyPoints}+ pts or ${rank.minGamesPlayed}+ games this week`}
                />
              ))}
            </ul>
          </>
        ) : null}

        {(showMasteryTiers || showWeeklyRanks) && showPerformanceTiers ? (
          <hr className="my-6 border-border" />
        ) : null}

        {showPerformanceTiers ? (
          <>
            <h3 className="font-bold text-ink">Session performance badges</h3>
            <p className="mt-1 text-sm text-muted">
              Earned per game based on your scenario score
            </p>
            <ul className="mt-4 space-y-3">
              {performanceAsc.map((tier) => (
                <TierListItem
                  key={tier.id}
                  icon={tier.icon}
                  name={tier.name}
                  description={
                    tier.minScore === 0
                      ? tier.description
                      : `${tier.minScore}%+ score on a corporate game`
                  }
                />
              ))}
            </ul>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
