/**
 * Capture marketing/demo video screenshots at 1440×900.
 * Usage: node scripts/capture-demo-screenshots.mjs
 * Env: APP_URL (default https://intelligen-lms.vercel.app)
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "screenshots");
const BASE = process.env.APP_URL || "https://intelligen-lms.vercel.app";
const VIEWPORT = { width: 1440, height: 900 };

const DEMO_ADMIN = {
  email: "demo-admin@intelligen.lms",
  password: "password123",
};
const DEMO_LEARNER = {
  email: "demo-learner@intelligen.lms",
  password: "password123",
};

const ADMIN_CANDIDATES = [DEMO_ADMIN, { email: "admin@intelligen.lms", password: "password123" }];
const LEARNER_CANDIDATES = [
  DEMO_LEARNER,
  { email: "student@intelligen.lms", password: "password123" },
];

async function enableScreenshotMode(page) {
  await page.evaluate(() => {
    sessionStorage.setItem("intelligen-screenshot-mode", "1");
    document.documentElement.setAttribute("data-screenshot-mode", "true");
  });
}

async function preparePage(page) {
  await enableScreenshotMode(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
}

async function login(page, context, { email, password }) {
  const res = await context.request.post(`${BASE}/api/auth/login`, {
    data: { identifier: email, password },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    const body = await res.text();
    throw new Error(`API login failed for ${email}: ${body}`);
  }
  const data = await res.json();
  if (data.requires2fa) {
    throw new Error(`2FA required for ${email}`);
  }
  await page.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded" });
  await preparePage(page);
}

async function loginFirstAvailable(page, context, candidates) {
  let lastError;
  for (const creds of candidates) {
    try {
      await login(page, context, creds);
      console.log(`  → signed in as ${creds.email}`);
      return creds;
    } catch (err) {
      lastError = err;
      console.warn(`  ! ${creds.email}: ${err.message}`);
    }
  }
  throw lastError ?? new Error("No credentials worked");
}

async function capture(page, filename, url, { scrollY = 0 } = {}) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await preparePage(page);
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(800);
  }
  const filePath = path.join(OUT, filename);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`  ✓ ${filename}`);
  return filePath;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Capturing screenshots from ${BASE}`);
  console.log(`Output: ${OUT}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: "light",
  });
  await context.addInitScript(() => {
    sessionStorage.setItem("intelligen-screenshot-mode", "1");
    document.documentElement.setAttribute("data-screenshot-mode", "true");
  });
  const page = await context.newPage();

  try {
    await capture(page, "homepage.png", `${BASE}/`);

    await loginFirstAvailable(page, context, LEARNER_CANDIDATES);
    await capture(page, "dashboard.png", `${BASE}/dashboard`);
    await capture(page, "ai-features.png", `${BASE}/ai`);
    await capture(page, "certificates.png", `${BASE}/certificates`);
    await capture(page, "game-hub.png", `${BASE}/games`);

    await context.clearCookies();

    await loginFirstAvailable(page, context, ADMIN_CANDIDATES);
    await capture(page, "analytics.png", `${BASE}/dashboard`, { scrollY: 720 });

    console.log("\nDone — 6 screenshots saved to docs/screenshots/");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
