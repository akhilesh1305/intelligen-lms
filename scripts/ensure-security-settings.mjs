import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const requireAdmin2fa = process.env.REQUIRE_ADMIN_2FA === "true";

try {
  await db.securitySettings.upsert({
    where: { id: "default" },
    create: { id: "default", requireAdmin2fa },
    update: { requireAdmin2fa },
  });
  console.log(
    requireAdmin2fa
      ? "Admin 2FA is required (REQUIRE_ADMIN_2FA=true)"
      : "Admin 2FA is optional for demo login"
  );
} finally {
  await db.$disconnect();
}
