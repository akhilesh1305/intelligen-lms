import type { ScreenshotPresentationMeta } from "@/lib/screenshot-presentation";

export const PRODUCT_TOUR_NAV = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Challenge" },
  { id: "solution", label: "Solution" },
  { id: "ai", label: "AI" },
  { id: "gamification", label: "Engagement" },
  { id: "certificates", label: "Certificates" },
  { id: "analytics", label: "Analytics" },
  { id: "benefits", label: "Benefits" },
  { id: "get-started", label: "Demo" },
] as const;

export const STORY_FLOW = [
  { step: 1, label: "Problem", id: "problem" },
  { step: 2, label: "Solution", id: "solution" },
  { step: 3, label: "AI", id: "ai" },
  { step: 4, label: "Benefits", id: "benefits" },
  { step: 5, label: "CTA", id: "get-started" },
] as const;

export const TOUR_PROBLEMS = [
  {
    title: "Content takes too long",
    description:
      "Instructors juggle slides, videos, quizzes, and LMS uploads across disconnected tools — delaying launches and burning budget.",
  },
  {
    title: "Learners disengage",
    description:
      "Static courses without motivation, recognition, or practice lead to low completion and weak skill transfer.",
  },
  {
    title: "Leaders can't prove ROI",
    description:
      "L&D teams struggle to show completion trends, credential proof, and performance insights to executives and clients.",
  },
] as const;

export const TOUR_SOLUTION_POINTS = [
  "One platform for courses, AI authoring, games, certificates, and analytics",
  "Demo-ready accounts with realistic data for sales and recruiter presentations",
  "Enterprise security — 2FA, SSO, org workspaces, audit logs, and GDPR tools",
  "Deploy on Vercel + PostgreSQL — AI-powered learning, engagement, and analytics in one platform",
] as const;

export const TOUR_AI_FEATURES = [
  {
    title: "AI Course Generator",
    description:
      "Create complete courses using AI in seconds — modules, lessons, and objectives from a topic, PDF, or video.",
    businessValue: "Reduces content creation time by up to 80% so teams ship training while demand is high.",
    bullets: ["PDF & video source ingestion", "Instructor review before publish", "Org-branded templates"],
    href: "/ai",
  },
  {
    title: "AI Quiz Builder",
    description:
      "Auto-generate assessments from lesson content with smart distractors, passing scores, and cron refresh.",
    businessValue: "Keeps compliance and product training current without manual quiz authoring overhead.",
    bullets: ["MCQ from any module", "Configurable difficulty", "One-click add to course"],
    href: "/instructor/courses",
  },
  {
    title: "AI Assistant",
    description:
      "Context-aware chat grounded in enrolled courses — summaries, Q&A, roadmaps, and career guidance in one place.",
    businessValue: "Scales learner support without adding headcount — improves completion between live sessions.",
    bullets: ["Course-grounded answers", "Learning roadmaps", "Career & interview prep"],
    href: "/assistant",
  },
] as const;

export const TOUR_GAMIFICATION = [
  {
    title: "Earn recognition",
    description: "Points for lessons, quizzes, streaks, and game completions reward consistent learning.",
    businessValue: "Turns mandatory training into a habit loop — measurable engagement beyond completion %.",
  },
  {
    title: "Drive friendly competition",
    description: "Weekly quiz and corporate game rankings by learner, team, or organization.",
    businessValue: "Friendly competition drives voluntary practice — ideal for sales and onboarding programs.",
  },
  {
    title: "Celebrate milestones",
    description: "Achievement milestones for courses, games, streaks, and mastery tiers.",
    businessValue: "Gives learners shareable proof of effort — reinforces culture and internal mobility stories.",
  },
] as const;

export const TOUR_CERTIFICATES = [
  {
    title: "Verification",
    description: "Unique certificate numbers, public verify URLs, and fraud-resistant credential records.",
    businessValue: "Audit-ready proof for compliance, partners, and clients — no third-party badge fees.",
  },
  {
    title: "Progress",
    description: "In-progress, earned, and locked certificates in one hub with clear next steps.",
    businessValue: "Learners always know what's left — managers see credential pipeline at a glance.",
  },
  {
    title: "Achievements",
    description: "Print-ready, org-branded documents issued automatically on course completion.",
    businessValue: "Connects training spend to tangible credentials CHROs and recruiters can showcase.",
  },
] as const;

export const TOUR_ANALYTICS = [
  {
    title: "Learning trends",
    description:
      "Enrollment curves, completion rates, top courses, and role distribution — visualized for every admin.",
    businessValue: "Answer 'is training working?' with charts stakeholders understand in the first meeting.",
  },
  {
    title: "Performance insights",
    description:
      "Quiz activity, leaderboard participation, instructor metrics, and CSV export for BI workflows.",
    businessValue: "Feeds existing reporting stacks — no black-box LMS analytics locked in a silo.",
  },
] as const;

export const TOUR_BENEFITS = [
  {
    title: "Faster time-to-launch",
    stat: "80%",
    statLabel: "less authoring time",
    description: "AI course and quiz generation gets programs live in days, not quarters.",
  },
  {
    title: "Higher engagement",
    stat: "3×",
    statLabel: "practice touchpoints",
    description: "XP, games, and leaderboards keep learners returning between mandatory modules.",
  },
  {
    title: "Verifiable outcomes",
    stat: "100%",
    statLabel: "credential verify",
    description: "Every completion maps to a certificate leaders and clients can independently validate.",
  },
  {
    title: "Executive-ready reporting",
    stat: "1",
    statLabel: "unified platform",
    description: "AI-powered learning, engagement, and analytics in one place — credible ROI for budget reviews and enterprise demos.",
  },
] as const;

export const TOUR_DASHBOARD_PRESENTATION: ScreenshotPresentationMeta = {
  sceneLabel: "Dashboard",
  valueHeadline: "See learning impact before the meeting ends",
  callouts: [
    {
      id: "kpis",
      label: "Role-aware KPIs",
      value: "Every persona, one hub",
      top: 22,
      left: 50,
      accent: "brand",
    },
    {
      id: "charts",
      label: "Live charts",
      value: "Trends stakeholders trust",
      top: 50,
      left: 38,
      accent: "cyan",
    },
    {
      id: "ai",
      label: "AI layer",
      value: "Coaching without extra tools",
      top: 74,
      left: 80,
      align: "right",
      accent: "violet",
    },
  ],
};

export const TOUR_GAMIFICATION_PRESENTATION: ScreenshotPresentationMeta = {
  sceneLabel: "Leaderboard",
  valueHeadline: "Competition that drives voluntary practice",
  callouts: [
    {
      id: "rank",
      label: "Weekly ranks",
      value: "Teams compete on real progress",
      top: 28,
      left: 35,
      accent: "amber",
    },
    {
      id: "xp",
      label: "XP rewards",
      value: "Recognition brings learners back",
      top: 55,
      left: 72,
      align: "right",
      accent: "brand",
    },
    {
      id: "you",
      label: "Your standing",
      value: "Personalized motivation loop",
      top: 78,
      left: 48,
      accent: "emerald",
    },
  ],
};

export const TOUR_ANALYTICS_PRESENTATION: ScreenshotPresentationMeta = {
  sceneLabel: "Analytics",
  valueHeadline: "Prove ROI with charts executives understand",
  callouts: [
    {
      id: "progress",
      label: "Course progress",
      value: "Managers see what's left",
      top: 32,
      left: 28,
      accent: "emerald",
    },
    {
      id: "trend",
      label: "Enrollment trend",
      value: "Growth story for decks",
      top: 32,
      left: 72,
      align: "right",
      accent: "brand",
    },
    {
      id: "stats",
      label: "Summary stats",
      value: "Completion, enrollments, active learners",
      top: 82,
      left: 50,
      accent: "cyan",
    },
  ],
};
