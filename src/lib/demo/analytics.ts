import { DEMO_COURSES } from "./courses";
import { DEMO_LEARNERS } from "./learners";

export function getDemoPlatformAnalytics() {
  const months = ["Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26"];
  const enrollmentTrend = months.map((month, i) => ({
    month,
    enrollments: 42 + i * 18 + (i % 2) * 12,
  }));

  return {
    usersByRole: [
      { role: "STUDENT", count: 58 },
      { role: "INSTRUCTOR", count: 8 },
      { role: "ADMIN", count: 2 },
    ],
    coursesByStatus: [
      { status: "APPROVED", count: 6 },
      { status: "PENDING_APPROVAL", count: 1 },
      { status: "DRAFT", count: 2 },
    ],
    totalEnrollments: 1738,
    completionRate: 78,
    newUsersThisMonth: 24,
    enrollmentTrend,
    topCourses: DEMO_COURSES.map((c) => ({
      title: c.title,
      enrollments: c.enrollmentCount,
    })),
  };
}

export function getDemoPendingCourses() {
  return [
    {
      id: "demo-pending-1",
      title: "Advanced Prompt Engineering",
      instructor: { name: "Dr. Ananya Rao", email: "ananya@intelligen.lms" },
      modules: [{ _count: { lessons: 14 } }],
      createdAt: new Date("2026-06-01"),
    },
  ];
}

export function getDemoPendingInstructorCount(): number {
  return 2;
}

export function getDemoLearnerStatsSummary() {
  const totalXp = DEMO_LEARNERS.reduce((s, l) => s + l.xp, 0);
  const avgProgress = Math.round(
    DEMO_LEARNERS.reduce((s, l) => s + l.progressPercent, 0) / DEMO_LEARNERS.length
  );
  return {
    learnerCount: DEMO_LEARNERS.length,
    totalXp,
    avgProgress,
    certificatesIssued: 428,
  };
}
