import { PrismaClient } from "@prisma/client";

const TITLES = [
  "Cybersecurity Essentials for Teams",
  "Excel & Data Literacy for Professionals",
  "Effective Communication at Work",
  "Getting Started with AI Tools",
];

const db = new PrismaClient();

async function main() {
  const courses = await db.course.findMany({
    where: { title: { in: TITLES } },
    select: { id: true, title: true },
  });
  const ids = courses.map((c) => c.id);
  if (ids.length === 0) {
    console.log("Nothing to delete.");
    return;
  }
  await db.course.updateMany({
    where: { prerequisiteCourseId: { in: ids } },
    data: { prerequisiteCourseId: null },
  });
  await db.learningPathCourse.deleteMany({ where: { courseId: { in: ids } } });
  await db.course.deleteMany({ where: { id: { in: ids } } });
  console.log(`Deleted ${ids.length} course(s) for regeneration.`);
}

main()
  .finally(() => db.$disconnect());
