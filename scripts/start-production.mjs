import { execSync } from "node:child_process";

const port = process.env.PORT || "3001";

console.log("Applying database schema...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("Backfilling corporate game day slugs...");
execSync("node scripts/backfill-corporate-day-slug.mjs", { stdio: "inherit" });

console.log("Applying security settings...");
execSync("node scripts/ensure-security-settings.mjs", { stdio: "inherit" });

console.log("Ensuring demo organization accounts...");
execSync("npx tsx prisma/seed-demo-org.ts", { stdio: "inherit" });

if (process.env.RUN_SEED === "true") {
  console.log("RUN_SEED=true — seeding database...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
}

console.log(`Starting server on port ${port}...`);
execSync(`npx next start -H 0.0.0.0 -p ${port}`, { stdio: "inherit" });
