import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

try {
  const legacy = await db.corporateGameAttempt.findMany({
    where: { daySlug: "legacy" },
    select: { id: true, completedAt: true },
  });

  for (const row of legacy) {
    const daySlug = row.completedAt.toISOString().slice(0, 10);
    await db.corporateGameAttempt.update({
      where: { id: row.id },
      data: { daySlug },
    });
  }

  if (legacy.length > 0) {
    console.log(
      `Backfilled daySlug for ${legacy.length} corporate game attempt(s)`
    );
  }
} finally {
  await db.$disconnect();
}
