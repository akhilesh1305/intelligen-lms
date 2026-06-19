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
      action: "completed",
      title: "AI Fundamentals",
      detail: "Finished final module — 100% complete",
      xp: 120,
    },
    {
      id: "h2",
      date: new Date(now - day * 2),
      action: "certificate",
      title: "AI Professional",
      detail: "Certificate issued for AI Fundamentals",
    },
    {
      id: "h3",
      date: new Date(now - day * 3),
      action: "quiz",
      title: "Weekly GK Challenge",
      detail: "Scored 88% — Gold rank progress",
      xp: 45,
    },
    {
      id: "h4",
      date: new Date(now - day * 4),
      action: "game",
      title: "Cybersecurity Escape",
      detail: "Corporate simulation — 92% score",
      xp: 80,
    },
    {
      id: "h5",
      date: new Date(now - day * 5),
      action: "started",
      title: "Generative AI for Business",
      detail: "Enrolled — 85% progress so far",
      xp: 30,
    },
    {
      id: "h6",
      date: new Date(now - day * 7),
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
      detail: "Certificate issued for Leadership Excellence",
    },
    {
      id: "h8",
      date: new Date(now - day * 12),
      action: "completed",
      title: "Leadership Excellence",
      detail: "Course completed with distinction",
      xp: 100,
    },
  ];
}
