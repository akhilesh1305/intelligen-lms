import { DEMO_ORGANIZATION } from "./brand";

export type DemoLearningHistoryEntry = {
  id: string;
  date: Date;
  action: "completed" | "started" | "certificate" | "quiz" | "badge" | "game";
  title: string;
  detail: string;
  xp?: number;
};

export function getDemoLearningHistory(): DemoLearningHistoryEntry[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      id: "h1",
      date: new Date(now - day),
      action: "started",
      title: "Cybersecurity Essentials",
      detail: `Continuing required compliance training for ${DEMO_ORGANIZATION.name}`,
      xp: 25,
    },
    {
      id: "h2",
      date: new Date(now - day * 2),
      action: "quiz",
      title: "Weekly Sales Enablement Quiz",
      detail: "Scored 88% — Gold rank on the team leaderboard",
      xp: 45,
    },
    {
      id: "h3",
      date: new Date(now - day * 4),
      action: "game",
      title: "Enterprise Sales Simulation",
      detail: "Corporate scenario — 92% score, top 10% in department",
      xp: 80,
    },
    {
      id: "h4",
      date: new Date(now - day * 5),
      action: "completed",
      title: "AI Fundamentals",
      detail: "Finished final module — 100% complete",
      xp: 120,
    },
    {
      id: "h5",
      date: new Date(now - day * 6),
      action: "certificate",
      title: "AI Professional",
      detail: "Credential issued for AI Fundamentals",
    },
    {
      id: "h6",
      date: new Date(now - day * 8),
      action: "badge",
      title: "Quiz Champion",
      detail: "Top 10% on weekly quiz leaderboard",
      xp: 50,
    },
    {
      id: "h7",
      date: new Date(now - day * 10),
      action: "certificate",
      title: "Leadership Expert",
      detail: "Credential issued for Leadership Excellence",
    },
    {
      id: "h8",
      date: new Date(now - day * 12),
      action: "completed",
      title: "Leadership Excellence",
      detail: `Completed with distinction — ${DEMO_ORGANIZATION.department} cohort`,
      xp: 100,
    },
  ];
}
