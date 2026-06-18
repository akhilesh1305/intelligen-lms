import { db } from "@/lib/db";
import { getCourseProgressDetails } from "@/lib/progress";
import {
  resolveCertificateTemplate,
  type CertificateTemplateId,
} from "@/lib/certificate-templates";

export type EarnedCertificateItem = {
  id: string;
  certificateNo: string;
  issuedAt: Date;
  courseId: string;
  courseTitle: string;
  skillLevel: string;
  template: CertificateTemplateId;
  organizationName: string | null;
};

export type LockedCertificateItem = {
  courseId: string;
  courseTitle: string;
  description: string;
  progressPercent: number;
  template: CertificateTemplateId;
  requirements: {
    lessons: { total: number; completed: number };
    quizzes: { total: number; passed: number };
    assignments: { total: number; submitted: number };
  };
  remainingSummary: string[];
  estimatedCompletionLabel: string | null;
};

export type CertificateHubData = {
  earned: EarnedCertificateItem[];
  locked: LockedCertificateItem[];
  stats: {
    earnedCount: number;
    lockedCount: number;
    inProgressCount: number;
  };
  latestEarned: EarnedCertificateItem | null;
  upcoming: LockedCertificateItem | null;
};

export type CertificateVerification = {
  valid: boolean;
  certificateNo: string;
  studentName: string;
  courseTitle: string;
  issuedAt: Date;
  template: CertificateTemplateId;
  organizationName: string | null;
  instructorName: string;
};

function estimateCompletionLabel(progressPercent: number): string | null {
  if (progressPercent >= 100) return null;
  if (progressPercent >= 75) return "Almost there — finish this week";
  if (progressPercent >= 40) return "On track — keep learning";
  if (progressPercent > 0) return "Getting started";
  return "Not started yet";
}

function buildRemainingSummary(
  progress: Awaited<ReturnType<typeof getCourseProgressDetails>>
): string[] {
  if (!progress) return [];
  const items: string[] = [];
  const lessonsLeft = progress.lessons.total - progress.lessons.completed;
  const quizzesLeft = progress.quizzes.total - progress.quizzes.passed;
  const assignmentsLeft = progress.assignments.total - progress.assignments.submitted;

  if (lessonsLeft > 0) items.push(`${lessonsLeft} lesson${lessonsLeft === 1 ? "" : "s"} remaining`);
  if (quizzesLeft > 0) items.push(`${quizzesLeft} quiz${quizzesLeft === 1 ? "" : "zes"} to pass`);
  if (assignmentsLeft > 0)
    items.push(`${assignmentsLeft} assignment${assignmentsLeft === 1 ? "" : "s"} to submit`);
  if (items.length === 0 && progress.percent < 100) items.push("Complete all course items");
  return items;
}

export async function getCertificateHubData(
  userId: string
): Promise<CertificateHubData> {
  const [earnedRows, enrollments] = await Promise.all([
    db.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            skillLevel: true,
            organizationId: true,
            organization: { select: { name: true } },
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    }),
    db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            skillLevel: true,
            organizationId: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
  ]);

  const earnedSet = new Set(earnedRows.map((c) => c.courseId));

  const earned: EarnedCertificateItem[] = earnedRows.map((c) => ({
    id: c.id,
    certificateNo: c.certificateNo,
    issuedAt: c.issuedAt,
    courseId: c.courseId,
    courseTitle: c.course.title,
    skillLevel: c.course.skillLevel,
    template: resolveCertificateTemplate(c.course),
    organizationName: c.course.organization?.name ?? null,
  }));

  const locked: LockedCertificateItem[] = [];

  for (const enrollment of enrollments) {
    if (earnedSet.has(enrollment.courseId)) continue;
    if (enrollment.progressPercent >= 100) continue;

    const details = await getCourseProgressDetails(userId, enrollment.courseId);
    if (!details) continue;

    locked.push({
      courseId: enrollment.courseId,
      courseTitle: enrollment.course.title,
      description: enrollment.course.description,
      progressPercent: details.percent,
      template: resolveCertificateTemplate(enrollment.course),
      requirements: {
        lessons: details.lessons,
        quizzes: details.quizzes,
        assignments: details.assignments,
      },
      remainingSummary: buildRemainingSummary(details),
      estimatedCompletionLabel: estimateCompletionLabel(details.percent),
    });
  }

  locked.sort((a, b) => b.progressPercent - a.progressPercent);

  const upcoming = locked[0] ?? null;

  return {
    earned,
    locked,
    stats: {
      earnedCount: earned.length,
      lockedCount: locked.length,
      inProgressCount: locked.filter((l) => l.progressPercent > 0).length,
    },
    latestEarned: earned[0] ?? null,
    upcoming,
  };
}

export async function verifyCertificateByNumber(
  certificateNo: string
): Promise<CertificateVerification | null> {
  const certificate = await db.certificate.findUnique({
    where: { certificateNo },
    include: {
      user: { select: { name: true } },
      course: {
        select: {
          title: true,
          skillLevel: true,
          organizationId: true,
          organization: { select: { name: true } },
          instructor: { select: { name: true } },
        },
      },
    },
  });

  if (!certificate) return null;

  return {
    valid: true,
    certificateNo: certificate.certificateNo,
    studentName: certificate.user.name,
    courseTitle: certificate.course.title,
    issuedAt: certificate.issuedAt,
    template: resolveCertificateTemplate(certificate.course),
    organizationName: certificate.course.organization?.name ?? null,
    instructorName: certificate.course.instructor.name,
  };
}

export function getCertificateVerifyUrl(certificateNo: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  return `${base.replace(/\/$/, "")}/certificates/verify/${encodeURIComponent(certificateNo)}`;
}
