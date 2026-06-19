import { GamesAnimatedSection } from "@/components/games/games-animated-section";
import { PlayerProfileCard } from "@/components/games/dashboard/player-profile-card";
import { XPProgressWidget } from "@/components/games/dashboard/xp-progress-widget";
import { PersonalStatsDashboard } from "@/components/games/dashboard/personal-stats-dashboard";
import { RecentAchievementsSection } from "@/components/games/dashboard/recent-achievements-section";
import { RewardProgressTrack } from "@/components/games/dashboard/reward-progress-track";
import { BattleModeShowcase } from "@/components/games/dashboard/battle-mode-showcase";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";
import { STICKY_ANCHOR_MT } from "@/components/home/home-polish";
import { cn } from "@/lib/utils";
export function GamesPlayerDashboard({ profile }: { profile: GamesPlayerProfile }) {
  return (
    <section id="player-dashboard" className={cn("space-y-8 sm:space-y-10", STICKY_ANCHOR_MT)}>
      <GamesAnimatedSection>
        <PlayerProfileCard profile={profile} />
      </GamesAnimatedSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <GamesAnimatedSection delay={80}>
          <XPProgressWidget profile={profile} />
        </GamesAnimatedSection>
        <GamesAnimatedSection delay={120}>
          <RewardProgressTrack profile={profile} />
        </GamesAnimatedSection>
      </div>

      <GamesAnimatedSection delay={160}>
        <PersonalStatsDashboard profile={profile} />
      </GamesAnimatedSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <GamesAnimatedSection delay={200} className="lg:col-span-2">
          <RecentAchievementsSection profile={profile} />
        </GamesAnimatedSection>
        <GamesAnimatedSection delay={240}>
          <BattleModeShowcase />
        </GamesAnimatedSection>
      </div>
    </section>
  );
}
