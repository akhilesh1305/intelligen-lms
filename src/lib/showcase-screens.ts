import { GAMES_PAGE_IMAGES } from "@/lib/game-images";
import { HOME_MIND_GAME_IMAGES, HOME_SECTION_IMAGES } from "@/lib/home-images";

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
      "AI positioning and featured courses",
      "Testimonials, FAQ, and demo video",
      "Clear CTAs for trial and product tour",
    ],
    image: "/images/hero-learners.jpg",
    imageAlt: "IntelliGen LMS marketing homepage with learners collaborating",
    href: "/",
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
  },
  {
    id: "ai",
    title: "AI Feature Suite",
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
  },
];

export const SHOWCASE_NAV = SHOWCASE_SCREENS.map((s) => ({
  href: `#${s.id}`,
  label: s.title,
  id: s.id,
}));

export const SHOWCASE_STATS = [
  { label: "Platform surfaces", value: "6" },
  { label: "Tracked features", value: "87+" },
  { label: "AI capabilities", value: "11" },
  { label: "Demo-ready", value: "Yes" },
] as const;
