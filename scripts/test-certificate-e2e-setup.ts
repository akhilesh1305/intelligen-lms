import { PrismaClient } from "@prisma/client";
import { syncEnrollmentProgress } from "../src/lib/progress";
import { issueCertificate } from "../src/lib/certificates";

const db = new PrismaClient();

async function completeCourseForUser(email: string, courseTitle?: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error(`User not found: ${email}`);

  const enrollment = await db.enrollment.findFirst({
    where: {
      userId: user.id,
      ...(courseTitle ? { course: { title: courseTitle } } : {}),
    },
    include: {
      course: {
        include: { modules: { include: { lessons: true } } },
      },
    },
  });

  if (!enrollment) throw new Error(`No enrollment for ${email}`);

  const lessons = enrollment.course.modules.flatMap((m) => m.lessons);
  for (const lesson of lessons) {
    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
      update: { completed: true, completedAt: new Date() },
    });
  }

  await syncEnrollmentProgress(user.id, enrollment.courseId);

  const certificate = await db.certificate.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: enrollment.courseId } },
  });

  return {
    email,
    courseTitle: enrollment.course.title,
    courseId: enrollment.courseId,
    certificate,
  };
}

async function ensureEnrollment(email: string, courseTitle: string) {
  const user = await db.user.findUnique({ where: { email } });
  const course = await db.course.findFirst({ where: { title: courseTitle } });
  if (!user || !course) throw new Error("User or course missing");

  await db.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    create: { userId: user.id, courseId: course.id, progressPercent: 0 },
    update: {},
  });

  return { email, courseTitle, courseId: course.id };
}

async function main() {
  const earned = await completeCourseForUser(
    "org.learner@intelligen.lms",
    "Acme Security & Compliance Onboarding"
  );

  const enrolled = await ensureEnrollment(
    "student@intelligen.lms",
    "Getting Started with AI Tools"
  );

  console.log(
    JSON.stringify(
      {
        earned,
        enrolled,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
