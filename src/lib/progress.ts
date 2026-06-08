import { db } from "./db";
import { calculateProgress } from "./utils";
import { issueCertificate } from "./certificates";
import { addPoints, checkAndAwardBadges } from "./gamification";

export async function getCourseProgressDetails(userId: string, courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: { include: { lessons: true } },
      quizzes: { include: { attempts: { where: { userId } } } },
      assignments: { include: { submissions: { where: { userId } } } },
    },
  });
  if (!course) return null;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lessonIds = allLessons.map((l) => l.id);

  const completedLessons = await db.lessonProgress.count({
    where: { userId, lessonId: { in: lessonIds }, completed: true },
  });

  const quizzesTotal = course.quizzes.length;
  const quizzesPassed = course.quizzes.filter((q) =>
    q.attempts.some((a) => a.passed)
  ).length;

  const assignmentsTotal = course.assignments.length;
  const assignmentsSubmitted = course.assignments.filter(
    (a) => a.submissions.length > 0
  ).length;

  const totalItems =
    allLessons.length + quizzesTotal + assignmentsTotal;
  const completedItems =
    completedLessons + quizzesPassed + assignmentsSubmitted;

  const percent =
    totalItems > 0 ? calculateProgress(totalItems, completedItems) : 0;

  const isComplete =
    allLessons.length === completedLessons &&
    quizzesTotal === quizzesPassed &&
    assignmentsTotal === assignmentsSubmitted &&
    totalItems > 0;

  return {
    percent,
    isComplete,
    lessons: { total: allLessons.length, completed: completedLessons },
    quizzes: { total: quizzesTotal, passed: quizzesPassed },
    assignments: { total: assignmentsTotal, submitted: assignmentsSubmitted },
  };
}

export async function syncEnrollmentProgress(userId: string, courseId: string) {
  const details = await getCourseProgressDetails(userId, courseId);
  if (!details) return null;

  const enrollment = await db.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      progressPercent: details.percent,
      completedAt: details.isComplete ? new Date() : null,
    },
  });

  if (details.isComplete) {
    await issueCertificate(userId, courseId);
    await addPoints(userId, 100);
  }

  await checkAndAwardBadges(userId);
  return { enrollment, details };
}
