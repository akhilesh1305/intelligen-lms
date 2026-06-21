import { DEMO_ORGANIZATION } from "./brand";
import { DEMO_COURSES } from "./courses";
import { DEMO_LEARNERS } from "./learners";

export function getDemoPlatformAnalytics() {
  const months = ["Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26"];
  const enrollmentTrend = months.map((month, i) => ({
    month,
    enrollments: 28 + i * 14 + (i % 2) * 8,
  }));

  return {
    usersByRole: [
      { role: "STUDENT", count: DEMO_LEARNERS.length },
      { role: "INSTRUCTOR", count: 6 },
      { role: "ADMIN", count: 2 },
    ],
    coursesByStatus: [
      { status: "APPROVED", count: 6 },
      { status: "PENDING_APPROVAL", count: 1 },
      { status: "DRAFT", count: 1 },
    ],
    totalEnrollments: 1738,
    completionRate: 78,
    newUsersThisMonth: 18,
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
      title: "Enterprise Sales Playbook 2026",
      instructor: { name: "Marcus Chen", email: "marcus@intelligen.lms" },
      modules: [{ _count: { lessons: 12 } }],
      createdAt: new Date("2026-06-01"),
    },
  ];
}

export function getDemoPendingInstructorCount(): number {
  return 1;
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
    organizationName: DEMO_ORGANIZATION.name,
  };
}
