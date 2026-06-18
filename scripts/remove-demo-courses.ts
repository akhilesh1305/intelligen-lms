/**
 * Remove seeded demo courses from the database.
 * Run: npx tsx scripts/remove-demo-courses.ts
 */

import { PrismaClient } from "@prisma/client";

const DEMO_COURSE_TITLES = [
  "Introduction to Web Development",
  "Python for Data Science",
  "UI/UX Design Fundamentals",
  "Introduction to Machine Learning",
  "Digital Marketing Essentials",
  "Project Management Basics",
  "Advanced React Patterns",
] as const;

const db = new PrismaClient();

async function main() {
  const courses = await db.course.findMany({
    where: { title: { in: [...DEMO_COURSE_TITLES] } },
    select: { id: true, title: true },
  });

  if (courses.length === 0) {
    console.log("No demo courses found.");
    return;
  }

  const ids = courses.map((c) => c.id);
  console.log(`Removing ${courses.length} demo course(s):`);
  for (const c of courses) console.log(`  - ${c.title}`);

  await db.course.updateMany({
    where: { prerequisiteCourseId: { in: ids } },
    data: { prerequisiteCourseId: null },
  });

  await db.learningPathCourse.deleteMany({
    where: { courseId: { in: ids } },
  });

  const result = await db.course.deleteMany({
    where: { id: { in: ids } },
  });

  console.log(`\nDeleted ${result.count} course(s) and related content (modules, lessons, enrollments, etc.).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
