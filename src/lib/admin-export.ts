import { computeAchievementLevel } from "@/lib/achievement-levels";
import { formatRole } from "@/lib/roles";
import { csvFilename, rowsToCsv } from "@/lib/csv";
import { AUDIT_ACTION_LABELS } from "@/lib/audit";
import {
  getCurrentWeekSlug,
  getWeekLabel,
} from "@/lib/weekly-leaderboard";
import { db } from "@/lib/db";

export type AdminExportType =
  | "users"
  | "courses"
  | "enrollments"
  | "instructors"
  | "audit-logs"
  | "leaderboard";

export const ADMIN_EXPORT_TYPES: AdminExportType[] = [
  "users",
  "courses",
  "enrollments",
  "instructors",
  "audit-logs",
  "leaderboard",
];

export const ADMIN_EXPORT_LABELS: Record<AdminExportType, string> = {
  users: "All users",
  courses: "Courses",
  enrollments: "Enrollments",
  instructors: "Instructors",
  "audit-logs": "Audit logs",
  leaderboard: "Weekly leaderboard",
};

export const ADMIN_EXPORT_DESCRIPTIONS: Record<AdminExportType, string> = {
  users: "Name, email, role, points, joined date",
  courses: "Title, instructor, status, enrollments, price",
  enrollments: "Learner, course, progress, enrolled date",
  instructors: "Name, email, verification status, courses taught",
  "audit-logs": "Recent platform activity (up to 5,000 rows)",
  leaderboard: "Current week quiz rankings and all-time history",
};

function isoDate(value: Date | null | undefined): string {
  if (!value) return "";
  return value.toISOString();
}

export async function buildAdminExport(type: AdminExportType): Promise<{
  filename: string;
  csv: string;
}> {
  switch (type) {
    case "users":
      return exportUsers();
    case "courses":
      return exportCourses();
    case "enrollments":
      return exportEnrollments();
    case "instructors":
      return exportInstructors();
    case "audit-logs":
      return exportAuditLogs();
    case "leaderboard":
      return exportLeaderboard();
    default:
      throw new Error("Unknown export type");
  }
}

async function exportUsers() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      points: true,
      instructorStatus: true,
      createdAt: true,
    },
  });

  const csv = rowsToCsv(
    [
      "ID",
      "Name",
      "Email",
      "Role",
      "Phone",
      "Points",
      "Instructor Status",
      "Joined At",
    ],
    users.map((u) => [
      u.id,
      u.name,
      u.email,
      formatRole(u.role),
      u.phoneNumber,
      u.points,
      u.instructorStatus ?? "",
      isoDate(u.createdAt),
    ])
  );

  return { filename: csvFilename("users"), csv };
}

async function exportCourses() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true, email: true } },
      _count: { select: { enrollments: true } },
    },
  });

  const csv = rowsToCsv(
    [
      "ID",
      "Title",
      "Instructor",
      "Instructor Email",
      "Status",
      "Published",
      "Skill Level",
      "Price (INR)",
      "Enrollments",
      "Created At",
    ],
    courses.map((c) => [
      c.id,
      c.title,
      c.instructor.name,
      c.instructor.email,
      c.status,
      c.published ? "Yes" : "No",
      c.skillLevel,
      (c.pricePaise / 100).toFixed(2),
      c._count.enrollments,
      isoDate(c.createdAt),
    ])
  );

  return { filename: csvFilename("courses"), csv };
}

async function exportEnrollments() {
  const enrollments = await db.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const csv = rowsToCsv(
    [
      "ID",
      "Learner Name",
      "Learner Email",
      "Course",
      "Progress %",
      "Enrolled At",
      "Completed At",
    ],
    enrollments.map((e) => [
      e.id,
      e.user.name,
      e.user.email,
      e.course.title,
      e.progressPercent,
      isoDate(e.enrolledAt),
      isoDate(e.completedAt),
    ])
  );

  return { filename: csvFilename("enrollments"), csv };
}

async function exportInstructors() {
  const instructors = await db.user.findMany({
    where: { role: "INSTRUCTOR" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      instructorStatus: true,
      instructorReviewedAt: true,
      createdAt: true,
      _count: { select: { coursesTaught: true } },
    },
  });

  const csv = rowsToCsv(
    [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Courses Taught",
      "Reviewed At",
      "Joined At",
    ],
    instructors.map((i) => [
      i.id,
      i.name,
      i.email,
      i.phoneNumber,
      i.instructorStatus ?? "APPROVED",
      i._count.coursesTaught,
      isoDate(i.instructorReviewedAt),
      isoDate(i.createdAt),
    ])
  );

  return { filename: csvFilename("instructors"), csv };
}

async function exportAuditLogs() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
    include: {
      user: { select: { email: true, role: true } },
    },
  });

  const csv = rowsToCsv(
    [
      "ID",
      "Action",
      "User Email",
      "User Name",
      "User Role",
      "Target Type",
      "Target ID",
      "IP Address",
      "Created At",
      "Metadata",
    ],
    logs.map((log) => [
      log.id,
      AUDIT_ACTION_LABELS[log.action] ?? log.action,
      log.userEmail ?? log.user?.email ?? "",
      log.userName ?? "",
      log.user?.role ? formatRole(log.user.role) : "",
      log.targetType,
      log.targetId,
      log.ipAddress,
      isoDate(log.createdAt),
      log.metadata,
    ])
  );

  return { filename: csvFilename("audit-logs"), csv };
}

async function exportLeaderboard() {
  const currentWeek = getCurrentWeekSlug();

  const entries = await db.weeklyLeaderboardEntry.findMany({
    orderBy: [{ weekSlug: "desc" }, { points: "desc" }, { updatedAt: "asc" }],
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
  });

  const rankByWeek = new Map<string, number>();

  const csv = rowsToCsv(
    [
      "Week",
      "Week Period",
      "Rank",
      "Name",
      "Email",
      "Role",
      "Points",
      "Quizzes Completed",
      "Achievement Level",
      "Updated At",
    ],
    entries.map((entry) => {
      const rank = (rankByWeek.get(entry.weekSlug) ?? 0) + 1;
      rankByWeek.set(entry.weekSlug, rank);

      const weekPeriod =
        entry.weekSlug === currentWeek ? getWeekLabel() : entry.weekSlug;

      return [
        entry.weekSlug,
        weekPeriod,
        rank,
        entry.user.name,
        entry.user.email,
        formatRole(entry.user.role),
        entry.points,
        entry.quizzesCompleted,
        computeAchievementLevel(entry.points, entry.quizzesCompleted) ?? "No rank",
        isoDate(entry.updatedAt),
      ];
    })
  );

  return { filename: csvFilename("leaderboard"), csv };
}
