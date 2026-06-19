export type ScreenshotGuide = {
  id: string;
  title: string;
  href: string;
  viewport: { width: number; height: number; label: string };
  section: string;
  dataState: string;
  theme: "light" | "dark" | "either";
  instructions: string[];
};

export const SCREENSHOT_GUIDES: ScreenshotGuide[] = [
  {
    id: "homepage",
    title: "Homepage",
    href: "/",
    viewport: { width: 1440, height: 900, label: "1440 × 900 (desktop)" },
    section: "Hero above the fold — headline, subcopy, primary CTA, and trust row",
    dataState:
      "Signed out. Use light theme for marketing polish. Scroll to hero only; crop above “Featured courses”.",
    theme: "light",
    instructions: [
      "Open `/` in a private window (no session) or log out.",
      "Set browser zoom to 100% and resize to 1440 × 900.",
      "Enable Screenshot Mode, then hard-refresh the page.",
      "Capture from the top through the hero CTA row (exclude long page scroll).",
      "Optional: capture the demo video band as a second asset at 1440 × 800.",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    viewport: { width: 1440, height: 900, label: "1440 × 900 (desktop)" },
    section: "Admin platform overview — KPI stat cards and enrollment trend chart",
    dataState:
      "Sign in as `demo-admin@intelligen.lms` (rich mock analytics) or platform `admin@intelligen.lms`.",
    theme: "either",
    instructions: [
      "Sign in with the demo admin account (see Demo Credentials on README).",
      "Navigate to `/dashboard` and wait for charts to render.",
      "Enable Screenshot Mode to hide promo bars and assistant widget.",
      "Frame the page title, four KPI cards, and the first analytics chart row.",
      "Avoid capturing approval queues or empty states — seed data if needed.",
    ],
  },
  {
    id: "certificates",
    title: "Certificates",
    href: "/certificates",
    viewport: { width: 1280, height: 900, label: "1280 × 900 (desktop)" },
    section: "Certificate collection header and earned-certificate grid",
    dataState:
      "Sign in as `demo-learner@intelligen.lms` for a populated earned + in-progress collection.",
    theme: "light",
    instructions: [
      "Sign in as demo learner (`demo-learner@intelligen.lms` / `password123`).",
      "Open `/certificates` and ensure the earned grid shows at least 3 cards.",
      "Use light theme so certificate gradients read clearly on white panels.",
      "Capture the collection header (stats line) plus the first row of earned certificates.",
      "Open one certificate detail in a second shot for print-layout portfolio use.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    href: "/dashboard",
    viewport: { width: 1440, height: 1000, label: "1440 × 1000 (desktop)" },
    section: "Charts grid — enrollment trend, top courses, role distribution, course status",
    dataState:
      "Admin or demo-admin session with platform analytics visible (four chart cards).",
    theme: "either",
    instructions: [
      "Stay on `/dashboard` as admin or demo-admin.",
      "Scroll until all four analytics charts are in view (2 × 2 grid).",
      "Enable Screenshot Mode before capture to remove notification and promo chrome.",
      "Use dark theme for a “product UI” look, or light for documentation.",
      "Export at 2× pixel ratio in DevTools → Capture screenshot for retina clarity.",
    ],
  },
  {
    id: "game-hub",
    title: "Game Hub",
    href: "/games",
    viewport: { width: 1440, height: 900, label: "1440 × 900 (desktop)" },
    section: "Games hero and corporate games row (player dashboard if signed in)",
    dataState:
      "Sign in as `demo-learner@intelligen.lms` for player stats and completed-game highlights.",
    theme: "either",
    instructions: [
      "Sign in as demo learner and open `/games`.",
      "Wait for the hero and corporate games cards to load.",
      "Capture from the games hero through the first corporate game card row.",
      "Include the player dashboard strip when signed in — it shows engagement metrics.",
      "For a second asset, scroll to Knowledge Games (`/games#knowledge-games`).",
    ],
  },
  {
    id: "ai-features",
    title: "AI Features",
    href: "/ai",
    viewport: { width: 1280, height: 900, label: "1280 × 900 (desktop)" },
    section: "AI tools hub — feature grid and capability cards",
    dataState: "Any signed-in user. OpenAI optional; UI renders without API key.",
    theme: "light",
    instructions: [
      "Sign in (student or instructor) and navigate to `/ai`.",
      "Ensure the tools hub grid is fully visible without scrolling on 1280px width.",
      "Enable Screenshot Mode to hide the floating assistant (full-page AI has its own layout).",
      "Capture the section header and the full feature card grid.",
      "Optional: capture `/assistant` in a separate frame for the chat experience.",
    ],
  },
];
