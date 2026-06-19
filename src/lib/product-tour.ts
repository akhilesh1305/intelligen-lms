export const PRODUCT_TOUR_NAV = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Challenge" },
  { id: "solution", label: "Solution" },
  { id: "ai", label: "AI" },
  { id: "gamification", label: "Gamification" },
  { id: "certificates", label: "Certificates" },
  { id: "analytics", label: "Analytics" },
  { id: "benefits", label: "Benefits" },
  { id: "get-started", label: "Demo" },
] as const;

export const STORY_FLOW = [
  { step: 1, label: "Problem", id: "problem" },
  { step: 2, label: "Solution", id: "solution" },
  { step: 3, label: "Features", id: "ai" },
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
  "Deploy on Vercel + PostgreSQL with 87+ tracked production features",
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
    title: "XP",
    description: "Points for lessons, quizzes, streaks, and game completions reward consistent learning.",
    businessValue: "Turns mandatory training into a habit loop — measurable engagement beyond completion %.",
  },
  {
    title: "Leaderboards",
    description: "Weekly quiz and corporate game rankings by learner, team, or organization.",
    businessValue: "Friendly competition drives voluntary practice — ideal for sales and onboarding programs.",
  },
  {
    title: "Badges",
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
    stat: "87+",
    statLabel: "live features",
    description: "Analytics and exports give L&D a credible story for budget reviews and enterprise demos.",
  },
] as const;
