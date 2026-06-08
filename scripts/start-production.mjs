import { execSync } from "node:child_process";

const port = process.env.PORT || "3001";

console.log("Applying database schema...");
execSync("npx prisma db push", { stdio: "inherit" });

if (process.env.RUN_SEED === "true") {
  console.log("RUN_SEED=true — seeding database...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
}

console.log(`Starting server on port ${port}...`);
execSync(`npx next start -H 0.0.0.0 -p ${port}`, { stdio: "inherit" });
