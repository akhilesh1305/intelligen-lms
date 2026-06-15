export type CorporateRankId =
  | "TRAINEE"
  | "ASSOCIATE"
  | "SPECIALIST"
  | "DIRECTOR"
  | "EXECUTIVE";

export type CorporateRank = {
  id: CorporateRankId;
  label: string;
  icon: string;
  minWeeklyPoints: number;
  minGamesPlayed: number;
  color: string;
  bg: string;
};

export const CORPORATE_RANKS: CorporateRank[] = [
  {
    id: "EXECUTIVE",
    label: "Executive",
    icon: "🏆",
    minWeeklyPoints: 200,
    minGamesPlayed: 12,
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-950/40",
  },
  {
    id: "DIRECTOR",
    label: "Director",
    icon: "💼",
    minWeeklyPoints: 120,
    minGamesPlayed: 8,
    color: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-100 dark:bg-indigo-950/40",
  },
  {
    id: "SPECIALIST",
    label: "Specialist",
    icon: "⭐",
    minWeeklyPoints: 60,
    minGamesPlayed: 5,
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-950/40",
  },
  {
    id: "ASSOCIATE",
    label: "Associate",
    icon: "📈",
    minWeeklyPoints: 25,
    minGamesPlayed: 2,
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
  },
];

export const CORPORATE_TRAINEE = {
  id: "TRAINEE" as const,
  label: "Trainee",
  icon: "🌱",
  color: "text-muted",
  bg: "bg-slate-100 dark:bg-slate-800",
};

export function computeCorporateRank(
  weeklyPoints: number,
  gamesPlayed: number
): CorporateRank | typeof CORPORATE_TRAINEE {
  for (const rank of CORPORATE_RANKS) {
    if (
      weeklyPoints >= rank.minWeeklyPoints ||
      gamesPlayed >= rank.minGamesPlayed
    ) {
      return rank;
    }
  }
  return CORPORATE_TRAINEE;
}
