import { db } from "./db";

export async function isCourseCompleted(
  userId: string,
  courseId: string
): Promise<boolean> {
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) return false;
  return enrollment.completedAt !== null || enrollment.progressPercent >= 100;
}

export async function getPrerequisiteStatus(
  userId: string,
  courseId: string
): Promise<{
  required: boolean;
  met: boolean;
  prerequisite: { id: string; title: string } | null;
}> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      prerequisiteCourseId: true,
      prerequisiteCourse: { select: { id: true, title: true } },
    },
  });

  if (!course?.prerequisiteCourseId || !course.prerequisiteCourse) {
    return { required: false, met: true, prerequisite: null };
  }

  const met = await isCourseCompleted(userId, course.prerequisiteCourseId);

  return {
    required: true,
    met,
    prerequisite: course.prerequisiteCourse,
  };
}

export async function assertPrerequisitesMet(
  userId: string,
  courseId: string
): Promise<string | null> {
  const status = await getPrerequisiteStatus(userId, courseId);
  if (status.required && !status.met && status.prerequisite) {
    return `Complete "${status.prerequisite.title}" before enrolling in this course.`;
  }
  return null;
}
