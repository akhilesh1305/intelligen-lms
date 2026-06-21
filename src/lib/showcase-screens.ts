import { GAMES_PAGE_IMAGES } from "@/lib/game-images";
import { HOME_MIND_GAME_IMAGES, HOME_SECTION_IMAGES } from "@/lib/home-images";
import type { ScreenshotPresentationMeta } from "@/lib/screenshot-presentation";
export type ShowcaseCapability = {
  title: string;
  description: string;
  businessValue: string;
};

export type ShowcaseScreen = {
  id: string;
  title: string;
  description: string;
  businessValue: string;
  /** Short capability bullets for quick scanning in decks */
  highlights: string[];
  image: string;
  imageAlt: string;
  href: string;
  /** Use live React mock instead of static image */
  variant?: "image" | "dashboard-mock";
  /** Optional sub-capabilities (e.g. AI tools under one screenshot) */
  capabilities?: ShowcaseCapability[];
  /** Visual storytelling — callouts and value strip on the framed screenshot */
  presentation: ScreenshotPresentationMeta;
};

export const SHOWCASE_SCREENS: ShowcaseScreen[] = [
  {
    id: "homepage",
    title: "Marketing Homepage",
    description:
      "A conversion-ready landing experience that positions IntelliGen LMS as an AI-native enterprise platform — with trust signals, product proof, and a single path to trial or demo.",
    businessValue:
      "Gives recruiters and sales teams a polished first impression that answers buyer questions before the live call, shortening evaluation cycles.",
    highlights: [
      "Hero with product proof and social trust",
      "AI outcomes and featured courses",
      "Testimonials, FAQ, and demo video",
      "Clear CTAs for trial and product tour",
    ],
    image: "/images/hero-learners.jpg",
    imageAlt: "IntelliGen LMS marketing homepage with learners collaborating",
    href: "/",
    presentation: {
      sceneLabel: "Homepage",
      valueHeadline: "Convert evaluators before the first sales call",
      callouts: [
        {
          id: "hero",
          label: "Hero proof",
          value: "AI-native positioning in one glance",
          top: 22,
          left: 28,
          accent: "brand",
        },
        {
          id: "trust",
          label: "Social trust",
          value: "Outcomes teams can cite",
          top: 58,
          left: 72,
          align: "right",
          accent: "emerald",
        },
        {
          id: "cta",
          label: "Clear path",
          value: "Trial, tour, or demo — no friction",
          top: 38,
          left: 55,
          accent: "cyan",
        },
      ],
    },
  },
  {
    id: "dashboard",
    title: "Role-Aware Dashboard",
    description:
      "One hub for every persona — students track progress and certificates, instructors monitor courses, and admins see platform-wide KPIs, charts, and approval queues.",
    businessValue:
      "Replaces scattered spreadsheets with a single command center so L&D and IT leaders can report outcomes to executives in minutes, not days.",
    highlights: [
      "Student progress, streaks, and recommendations",
      "Admin analytics with live chart grid",
      "Certificate widget and course discovery",
      "Instructor performance at a glance",
    ],
    image: HOME_SECTION_IMAGES.heroMain,
    imageAlt: "IntelliGen LMS learner and admin dashboard",
    href: "/dashboard",
    variant: "dashboard-mock",
    presentation: {
      sceneLabel: "Dashboard",
      valueHeadline: "One command center for every learning role",
      callouts: [
        {
          id: "kpis",
          label: "Live KPIs",
          value: "Completion & enrollment at a glance",
          top: 24,
          left: 50,
          accent: "brand",
        },
        {
          id: "trend",
          label: "Trend chart",
          value: "Prove training is working",
          top: 52,
          left: 35,
          accent: "cyan",
        },
        {
          id: "coach",
          label: "AI coach",
          value: "Scale support without headcount",
          top: 72,
          left: 78,
          align: "right",
          accent: "violet",
        },
      ],
    },
  },
  {
    id: "ai",
    title: "AI That Accelerates Learning",
    description:
      "AI is embedded across the platform — not bolted on. Instructors generate content faster; learners get coaching, summaries, and career tools inside the same LMS.",
    businessValue:
      "Differentiates your pitch from legacy LMS vendors and proves modern, production-ready AI integration that reduces content cost and improves learner completion.",
    highlights: [
      "Course & quiz generation for instructors",
      "Context-aware learning assistant",
      "Corporate coach and career tools",
      "Summaries, narration, and interview prep",
    ],
    image: HOME_MIND_GAME_IMAGES.showcase,
    imageAlt: "IntelliGen LMS AI tools hub",
    href: "/ai",
    capabilities: [
      {
        title: "AI Course Generator",
        description:
          "Create complete course outlines, modules, and lessons from a topic, PDF, or video — then refine in the course builder before publish.",
        businessValue:
          "Cuts instructor content creation time from weeks to hours, so teams ship training programs while demand is still hot.",
      },
      {
        title: "AI Quiz Builder",
        description:
          "Auto-generate multiple-choice assessments from lesson content with cron-backed refresh for recurring compliance training.",
        businessValue:
          "Keeps quizzes current without manual authoring overhead — critical for regulated industries and fast-moving product teams.",
      },
      {
        title: "AI Learning Assistant",
        description:
          "A context-aware chat companion helps learners summarize lessons, ask questions, and stay on track inside the platform.",
        businessValue:
          "Scales 1:1 support without adding headcount — improves satisfaction and reduces drop-off between live sessions.",
      },
      {
        title: "Corporate Coach & Career Tools",
        description:
          "Roadmaps, interview prep, resume builder, and coaching flows turn learning data into career outcomes.",
        businessValue:
          "Connects training spend to talent retention and internal mobility — a story CHROs and recruiters want to hear.",
      },
    ],
    presentation: {
      sceneLabel: "AI",
      valueHeadline: "Ship content faster — coach learners in the same app",
      callouts: [
        {
          id: "generate",
          label: "Course gen",
          value: "Weeks of authoring → hours",
          top: 28,
          left: 25,
          accent: "brand",
        },
        {
          id: "assistant",
          label: "Assistant",
          value: "24/7 learner support",
          top: 45,
          left: 68,
          align: "right",
          accent: "violet",
        },
        {
          id: "coach",
          label: "Career coach",
          value: "Learning → career outcomes",
          top: 68,
          left: 42,
          accent: "cyan",
        },
      ],
    },
  },
  {
    id: "certificates",
    title: "Verifiable Certificates",
    description:
      "Premium credentials with unique IDs, org-branded templates, print-ready layouts, and a public verification portal anyone can trust.",
    businessValue:
      "Gives clients audit-ready proof of completion for compliance, partner certification, and employee credentialing — without third-party badge fees.",
    highlights: [
      "Earned and in-progress certificate hub",
      "Org-branded and professional templates",
      "Print-ready, shareable documents",
      "Public verify by certificate number",
    ],
    image: "/promo/poster.png",
    imageAlt: "IntelliGen LMS certificate collection and verification",
    href: "/certificates/demo",
    presentation: {
      sceneLabel: "Certificates",
      valueHeadline: "Audit-ready proof stakeholders can verify",
      callouts: [
        {
          id: "earned",
          label: "Earned creds",
          value: "Shareable, branded credentials",
          top: 35,
          left: 30,
          accent: "amber",
        },
        {
          id: "verify",
          label: "Public verify",
          value: "Independent validation — no badge fees",
          top: 55,
          left: 70,
          align: "right",
          accent: "emerald",
        },
        {
          id: "progress",
          label: "Pipeline view",
          value: "Learners always know what's next",
          top: 72,
          left: 48,
          accent: "brand",
        },
      ],
    },
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    description:
      "Enrollment trends, completion rates, quiz leaderboards, role distribution, and org-level insights — visualized for stakeholders and exportable for compliance.",
    businessValue:
      "Turns learning activity into board-ready metrics so buyers see ROI, not just course counts — with CSV export for existing BI workflows.",
    highlights: [
      "Enrollment and completion trend charts",
      "Quiz activity and weekly leaderboard",
      "Top courses and role distribution",
      "Admin CSV export for reporting",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=788&fit=crop&q=80",
    imageAlt: "IntelliGen LMS analytics and reporting dashboard",
    href: "/dashboard",
    presentation: {
      sceneLabel: "Analytics",
      valueHeadline: "Board-ready metrics — not just course counts",
      callouts: [
        {
          id: "enrollment",
          label: "Enrollment",
          value: "Spot growth trends early",
          top: 30,
          left: 28,
          accent: "brand",
        },
        {
          id: "completion",
          label: "Completion",
          value: "Answer “is training working?”",
          top: 48,
          left: 62,
          accent: "emerald",
        },
        {
          id: "export",
          label: "CSV export",
          value: "Feeds your existing BI stack",
          top: 70,
          left: 75,
          align: "right",
          accent: "cyan",
        },
      ],
    },
  },
  {
    id: "games",
    title: "Game Hub & Engagement",
    description:
      "Corporate simulations, timed quiz challenges, and knowledge mini-games — tied to XP, badges, and leaderboards so training feels rewarding, not mandatory.",
    businessValue:
      "Drives voluntary practice and measurable engagement — especially for sales, compliance, and onboarding programs where completion alone is not enough.",
    highlights: [
      "Cybersecurity, sales, and leadership sims",
      "Daily and weekly quiz challenges",
      "Knowledge games and flashcards",
      "Player profile and mastery ranks",
    ],
    image: GAMES_PAGE_IMAGES.hero,
    imageAlt: "IntelliGen LMS games hub and leaderboards",
    href: "/games",
    presentation: {
      sceneLabel: "Engagement",
      valueHeadline: "Turn mandatory training into practice people choose",
      callouts: [
        {
          id: "sims",
          label: "Corp sims",
          value: "Real workplace decisions",
          top: 32,
          left: 32,
          accent: "cyan",
        },
        {
          id: "leaderboard",
          label: "Leaderboard",
          value: "Friendly competition drives practice",
          top: 50,
          left: 72,
          align: "right",
          accent: "amber",
        },
        {
          id: "xp",
          label: "XP & badges",
          value: "Recognition that brings learners back",
          top: 68,
          left: 45,
          accent: "violet",
        },
      ],
    },
  },
];

export const SHOWCASE_NAV = SHOWCASE_SCREENS.map((s) => ({
  href: `#${s.id}`,
  label: s.title,
  id: s.id,
}));

export const SHOWCASE_STATS = [
  { label: "Demo surfaces", value: "6" },
  { label: "Platform", value: "Unified" },
  { label: "AI-powered", value: "Core" },
  { label: "Demo-ready", value: "Yes" },
] as const;
