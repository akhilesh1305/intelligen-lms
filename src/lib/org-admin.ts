import type { OrganizationRole, Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { getUserByEmail, hashPassword, requireAuth } from "@/lib/auth";
import { getChallengeWindow } from "@/lib/challenge-window";
import { db } from "@/lib/db";
import { parseMemberCsv } from "@/lib/org-member-csv";
import { isOrganizationAdmin, slugifyOrganizationName } from "@/lib/organizations";
import { isOrganizationOperational } from "@/lib/organization-lifecycle";
import { getCurrentWeekSlug, getWeekLabel } from "@/lib/weekly-leaderboard";

import type { SessionLike } from "@/lib/organizations";

export type OrgAccessSession = SessionLike & { id: string; role: Role };

export async function assertCanManageOrg(
  session: OrgAccessSession | null,
  organizationId: string
): Promise<NextResponse | null> {
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const allowed = await canManageOrganization(
    session.id,
    session.role,
    organizationId
  );
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export type AccessibleOrg = {
  id: string;
  name: string;
  slug: string;
};

export async function canManageOrganization(
  userId: string,
  role: Role,
  organizationId: string
): Promise<boolean> {
  if (role === "ADMIN") return true;
  return isOrganizationAdmin(userId, organizationId);
}

/** Organizations the user may manage (all for platform ADMIN; ORG_ADMIN memberships otherwise). */
export async function getAccessibleOrganizations(session: {
  id: string;
  role: Role;
}): Promise<AccessibleOrg[]> {
  if (session.role === "ADMIN") {
    return db.organization.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  }

  const memberships = await getOrgAdminMemberships(session.id);
  return memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
  }));
}

/** All organizations for the platform-admin org switcher; empty for org admins. */
export async function getOrganizationsForOrgAdminSwitcher(session: {
  id: string;
  role: Role;
}): Promise<AccessibleOrg[]> {
  if (session.role !== "ADMIN") return [];
  return db.organization.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

/** Org admins for their org; platform admins for any org. Cross-org switcher list is platform-admin-only. */
export async function requireOrganizationAdminBySlug(slug: string) {
  const session = await requireAuth();
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const allowed = await canManageOrganization(session.id, session.role, org.id);
  if (!allowed) redirect("/dashboard");

  if (
    session.role !== "ADMIN" &&
    !isOrganizationOperational(org)
  ) {
    redirect(`/org/suspended?slug=${org.slug}`);
  }

  const accessibleOrgs = await getOrganizationsForOrgAdminSwitcher(session);

  return {
    session,
    org,
    isPlatformAdmin: session.role === "ADMIN",
    accessibleOrgs,
  };
}

export async function getOrgAdminMemberships(userId: string) {
  return db.organizationMember.findMany({
    where: { userId, role: "ORG_ADMIN" },
    include: { organization: true },
    orderBy: { joinedAt: "asc" },
  });
}

export async function getOrganizationBySlug(slug: string) {
  return db.organization.findUnique({
    where: { slug },
    include: {
      _count: { select: { members: true, courses: true } },
    },
  });
}

export async function getOrgDashboardStats(organizationId: string) {
  const [memberCount, courseCount, enrollments] = await Promise.all([
    db.organizationMember.count({ where: { organizationId } }),
    db.course.count({ where: { organizationId } }),
    db.enrollment.findMany({
      where: {
        course: { organizationId },
        user: {
          organizationMembers: { some: { organizationId } },
        },
      },
      select: { progressPercent: true, completedAt: true },
    }),
  ]);

  const activeLearners = enrollments.filter((e) => e.progressPercent > 0).length;
  const completions = enrollments.filter((e) => e.completedAt).length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progressPercent, 0) /
            enrollments.length
        )
      : 0;

  return {
    memberCount,
    courseCount,
    enrollmentCount: enrollments.length,
    activeLearners,
    completions,
    avgProgress,
  };
}

const ORG_ROLE_LABELS: Record<string, string> = {
  ORG_LEARNER: "Learner",
  ORG_INSTRUCTOR: "Instructor",
  ORG_ADMIN: "Admin",
};

export async function getOrgMembersForAdmin(organizationId: string) {
  return db.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          enrollments: {
            select: {
              progressPercent: true,
              completedAt: true,
              course: {
                select: {
                  id: true,
                  title: true,
                  organizationId: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ employeeId: "asc" }, { joinedAt: "asc" }],
  });
}

export async function getOrgLeaderboardAnalytics(userIds: string[]) {
  const weekSlug = getCurrentWeekSlug();
  const { startsAt, endsAt } = getChallengeWindow("WEEKLY");

  if (userIds.length === 0) {
    return {
      weekLabel: getWeekLabel(),
      participants: 0,
      totalAttempts: 0,
      totalPoints: 0,
      topLearners: [] as { name: string; points: number; quizzes: number }[],
      quizActivity: [] as { day: string; attempts: number; points: number }[],
    };
  }

  const [entries, weekAttempts, aggregate] = await Promise.all([
    db.weeklyLeaderboardEntry.findMany({
      where: { weekSlug, userId: { in: userIds } },
      orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
      take: 10,
      include: { user: { select: { name: true } } },
    }),
    db.challengeAttempt.findMany({
      where: {
        userId: { in: userIds },
        completedAt: { gte: startsAt, lte: endsAt },
      },
      select: { completedAt: true, pointsEarned: true },
    }),
    db.weeklyLeaderboardEntry.aggregate({
      where: { weekSlug, userId: { in: userIds } },
      _sum: { points: true, quizzesCompleted: true },
    }),
  ]);

  const activityByDay = new Map<string, { attempts: number; points: number }>();
  for (const attempt of weekAttempts) {
    const day = attempt.completedAt.toISOString().slice(0, 10);
    const current = activityByDay.get(day) ?? { attempts: 0, points: 0 };
    current.attempts += 1;
    current.points += attempt.pointsEarned;
    activityByDay.set(day, current);
  }

  const quizActivity = Array.from(activityByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, stats]) => ({
      day: new Date(day + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      attempts: stats.attempts,
      points: stats.points,
    }));

  return {
    weekLabel: getWeekLabel(),
    participants: entries.length,
    totalAttempts: weekAttempts.length,
    totalPoints: aggregate._sum.points ?? 0,
    topLearners: entries.map((entry) => ({
      name: entry.user.name,
      points: entry.points,
      quizzes: entry.quizzesCompleted,
    })),
    quizActivity,
  };
}

export async function getOrgAnalytics(organizationId: string) {
  const members = await db.organizationMember.findMany({
    where: { organizationId },
    select: {
      userId: true,
      role: true,
      employeeId: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          points: true,
        },
      },
    },
  });
  const userIds = members.map((m) => m.userId);
  const learnerUserIds = members
    .filter((m) => m.role === "ORG_LEARNER")
    .map((m) => m.userId);
  const instructorUserIds = members
    .filter((m) => m.role === "ORG_INSTRUCTOR")
    .map((m) => m.userId);

  const [
    membersByRole,
    coursesByStatus,
    enrollments,
    completions,
    newMembersThisMonth,
    courses,
    leaderboard,
  ] = await Promise.all([
    db.organizationMember.groupBy({
      by: ["role"],
      where: { organizationId },
      _count: true,
    }),
    db.course.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: true,
    }),
    db.enrollment.findMany({
      where: {
        course: { organizationId },
        userId: { in: userIds },
      },
      select: {
        enrolledAt: true,
        progressPercent: true,
        completedAt: true,
        userId: true,
        courseId: true,
      },
      orderBy: { enrolledAt: "asc" },
    }),
    db.enrollment.count({
      where: {
        course: { organizationId },
        userId: { in: userIds },
        completedAt: { not: null },
      },
    }),
    db.organizationMember.count({
      where: {
        organizationId,
        joinedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.course.findMany({
      where: { organizationId },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            enrollments: {
              where: { userId: { in: userIds } },
            },
          },
        },
        enrollments: {
          where: { userId: { in: userIds } },
          select: { progressPercent: true, userId: true, completedAt: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    getOrgLeaderboardAnalytics(learnerUserIds),
  ]);

  const totalEnrollments = enrollments.length;
  const completionRate =
    totalEnrollments > 0 ? Math.round((completions / totalEnrollments) * 100) : 0;

  const enrollmentByMonth = new Map<string, number>();
  for (const e of enrollments) {
    const key = e.enrolledAt.toISOString().slice(0, 7);
    enrollmentByMonth.set(key, (enrollmentByMonth.get(key) ?? 0) + 1);
  }

  const enrollmentTrend = Array.from(enrollmentByMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      enrollments: count,
    }));

  const topCourses = [...courses]
    .sort((a, b) => b._count.enrollments - a._count.enrollments)
    .slice(0, 5)
    .map((c) => ({
      title: c.title,
      enrollments: c._count.enrollments,
    }));

  const progressByUser = new Map<string, { total: number; count: number }>();
  for (const e of enrollments) {
    const entry = progressByUser.get(e.userId) ?? { total: 0, count: 0 };
    entry.total += e.progressPercent;
    entry.count += 1;
    progressByUser.set(e.userId, entry);
  }

  const memberNameMap = new Map(members.map((m) => [m.userId, m.user.name]));
  const topLearners = Array.from(progressByUser.entries())
    .filter(([userId]) => learnerUserIds.includes(userId))
    .map(([userId, stats]) => ({
      name: memberNameMap.get(userId) ?? "Member",
      progress: Math.round(stats.total / stats.count),
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 8);

  const activeLearnerIds = new Set(
    enrollments.filter((e) => e.progressPercent > 0).map((e) => e.userId)
  );
  const activeLearners = [...activeLearnerIds].filter((id) =>
    learnerUserIds.includes(id)
  ).length;

  const learnerCount = members.filter((m) => m.role === "ORG_LEARNER").length;
  const instructorCount = members.filter((m) => m.role === "ORG_INSTRUCTOR").length;
  const adminCount = members.filter((m) => m.role === "ORG_ADMIN").length;
  const pendingApprovals =
    coursesByStatus.find((c) => c.status === "PENDING_APPROVAL")?._count ?? 0;

  const instructorProfiles = members
    .filter((m) => m.role === "ORG_INSTRUCTOR")
    .map((member) => {
      const instructorCourses = courses.filter(
        (c) => c.instructorId === member.userId
      );
      const courseEnrollments = instructorCourses.flatMap((c) => c.enrollments);
      const avgProgress =
        courseEnrollments.length > 0
          ? Math.round(
              courseEnrollments.reduce((s, e) => s + e.progressPercent, 0) /
                courseEnrollments.length
            )
          : 0;

      return {
        userId: member.userId,
        name: member.user.name,
        email: member.user.email,
        employeeId: member.employeeId,
        courseCount: instructorCourses.length,
        totalEnrollments: instructorCourses.reduce(
          (s, c) => s + c._count.enrollments,
          0
        ),
        avgProgress,
        courses: instructorCourses.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          enrollments: c._count.enrollments,
          avgProgress:
            c.enrollments.length > 0
              ? Math.round(
                  c.enrollments.reduce((s, e) => s + e.progressPercent, 0) /
                    c.enrollments.length
                )
              : 0,
        })),
      };
    })
    .sort((a, b) => b.totalEnrollments - a.totalEnrollments);

  const learnerProfiles = members
    .filter((m) => m.role === "ORG_LEARNER")
    .map((member) => {
      const memberEnrollments = enrollments.filter(
        (e) => e.userId === member.userId
      );
      const completedCourses = memberEnrollments.filter(
        (e) => e.completedAt
      ).length;

      return {
        userId: member.userId,
        name: member.user.name,
        email: member.user.email,
        employeeId: member.employeeId,
        points: member.user.points,
        enrolledCourses: memberEnrollments.length,
        completedCourses,
        avgProgress:
          memberEnrollments.length > 0
            ? Math.round(
                memberEnrollments.reduce((s, e) => s + e.progressPercent, 0) /
                  memberEnrollments.length
              )
            : 0,
        joinedAt: member.joinedAt,
      };
    })
    .sort((a, b) => b.avgProgress - a.avgProgress);

  const instructorCourseDistribution = instructorProfiles
    .filter((i) => i.courseCount > 0)
    .map((i) => ({
      name: i.name.length > 16 ? i.name.slice(0, 16) + "…" : i.name,
      count: i.courseCount,
    }));

  const instructorTotals = {
    coursesCreated: courses.length,
    totalEnrollments: instructorProfiles.reduce(
      (s, i) => s + i.totalEnrollments,
      0
    ),
    avgProgress:
      instructorProfiles.length > 0
        ? Math.round(
            instructorProfiles.reduce((s, i) => s + i.avgProgress, 0) /
              instructorProfiles.length
          )
        : 0,
  };

  const learnerTotals = {
    completions: learnerProfiles.reduce((s, l) => s + l.completedCourses, 0),
    enrolled: learnerProfiles.reduce((s, l) => s + l.enrolledCourses, 0),
    avgProgress:
      learnerProfiles.length > 0
        ? Math.round(
            learnerProfiles.reduce((s, l) => s + l.avgProgress, 0) /
              learnerProfiles.length
          )
        : 0,
  };

  return {
    memberCount: members.length,
    learnerCount,
    instructorCount,
    adminCount,
    courseCount: courses.length,
    totalEnrollments,
    completionRate,
    newMembersThisMonth,
    pendingApprovals,
    avgProgress:
      totalEnrollments > 0
        ? Math.round(
            enrollments.reduce((s, e) => s + e.progressPercent, 0) /
              totalEnrollments
          )
        : 0,
    activeLearners,
    completions,
    membersByRole: membersByRole.map((r) => ({
      name: ORG_ROLE_LABELS[r.role] ?? r.role,
      count: r._count,
    })),
    coursesByStatus: coursesByStatus.map((c) => ({
      status: c.status,
      count: c._count,
    })),
    enrollmentTrend,
    topCourses,
    topLearners,
    leaderboard,
    instructorProfiles,
    learnerProfiles,
    instructorCourseDistribution,
    instructorTotals,
    learnerTotals,
    coursePerformance: courses.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      instructorName: c.instructor.name,
      enrollments: c._count.enrollments,
      avgProgress:
        c.enrollments.length > 0
          ? Math.round(
              c.enrollments.reduce((s, e) => s + e.progressPercent, 0) /
                c.enrollments.length
            )
          : 0,
    })),
  };
}

export type OrgUserDirectoryEntry = {
  userId: string;
  employeeId: string | null;
  name: string;
  email: string;
  role: OrganizationRole;
  roleLabel: string;
  joinedAt: string;
  enrolledCourses: number;
  completedCourses: number;
  avgProgress: number;
  isActive: boolean;
  quizPoints: number;
  weeklyQuizPoints: number;
  weeklyQuizzes: number;
  corporateGamesPlayed: number;
  corporatePoints: number;
  coursesCreated: number;
  learnersTaught: number;
  courseDetails: {
    id: string;
    title: string;
    progress: number;
    completed: boolean;
  }[];
};

export async function getOrgUserDirectory(
  organizationId: string
): Promise<OrgUserDirectoryEntry[]> {
  const members = await db.organizationMember.findMany({
    where: { organizationId },
    select: {
      userId: true,
      role: true,
      employeeId: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          points: true,
        },
      },
    },
    orderBy: [{ employeeId: "asc" }, { joinedAt: "asc" }],
  });

  const userIds = members.map((m) => m.userId);
  if (userIds.length === 0) return [];

  const weekSlug = getCurrentWeekSlug();

  const [enrollments, instructorCourses, weeklyEntries, corporateStats] =
    await Promise.all([
      db.enrollment.findMany({
        where: {
          userId: { in: userIds },
          course: { organizationId },
        },
        select: {
          userId: true,
          progressPercent: true,
          completedAt: true,
          course: { select: { id: true, title: true } },
        },
      }),
      db.course.findMany({
        where: { organizationId, instructorId: { in: userIds } },
        select: {
          id: true,
          title: true,
          instructorId: true,
          _count: {
            select: {
              enrollments: { where: { userId: { in: userIds } } },
            },
          },
        },
      }),
      db.weeklyLeaderboardEntry.findMany({
        where: { userId: { in: userIds }, weekSlug },
        select: { userId: true, points: true, quizzesCompleted: true },
      }),
      db.corporateGameAttempt.groupBy({
        by: ["userId"],
        where: { userId: { in: userIds } },
        _count: true,
        _sum: { pointsEarned: true },
      }),
    ]);

  const enrollmentsByUser = new Map<string, typeof enrollments>();
  for (const e of enrollments) {
    const list = enrollmentsByUser.get(e.userId) ?? [];
    list.push(e);
    enrollmentsByUser.set(e.userId, list);
  }

  const coursesByInstructor = new Map<string, typeof instructorCourses>();
  for (const c of instructorCourses) {
    const list = coursesByInstructor.get(c.instructorId) ?? [];
    list.push(c);
    coursesByInstructor.set(c.instructorId, list);
  }

  const weeklyByUser = new Map(weeklyEntries.map((e) => [e.userId, e]));
  const corporateByUser = new Map(
    corporateStats.map((s) => [
      s.userId,
      { count: s._count, points: s._sum.pointsEarned ?? 0 },
    ])
  );

  return members.map((member) => {
    const userEnrollments = enrollmentsByUser.get(member.userId) ?? [];
    const completedCourses = userEnrollments.filter((e) => e.completedAt).length;
    const avgProgress =
      userEnrollments.length > 0
        ? Math.round(
            userEnrollments.reduce((s, e) => s + e.progressPercent, 0) /
              userEnrollments.length
          )
        : 0;

    const taught = coursesByInstructor.get(member.userId) ?? [];
    const learnersTaught = taught.reduce((s, c) => s + c._count.enrollments, 0);
    const weekly = weeklyByUser.get(member.userId);
    const corporate = corporateByUser.get(member.userId);

    return {
      userId: member.userId,
      employeeId: member.employeeId,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      roleLabel: ORG_ROLE_LABELS[member.role] ?? member.role,
      joinedAt: member.joinedAt.toISOString(),
      enrolledCourses: userEnrollments.length,
      completedCourses,
      avgProgress,
      isActive: userEnrollments.some((e) => e.progressPercent > 0),
      quizPoints: member.user.points,
      weeklyQuizPoints: weekly?.points ?? 0,
      weeklyQuizzes: weekly?.quizzesCompleted ?? 0,
      corporateGamesPlayed: corporate?.count ?? 0,
      corporatePoints: corporate?.points ?? 0,
      coursesCreated: taught.length,
      learnersTaught,
      courseDetails: userEnrollments.map((e) => ({
        id: e.course.id,
        title: e.course.title,
        progress: e.progressPercent,
        completed: Boolean(e.completedAt),
      })),
    };
  });
}

function randomPassword(): string {
  const chars =
    "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export type ImportMemberResult = {
  line: number;
  email: string;
  employeeId: string;
  status: "created" | "linked" | "updated" | "error";
  message?: string;
};

export async function importOrganizationMembersFromCsv(
  organizationId: string,
  csvText: string
): Promise<{
  results: ImportMemberResult[];
  parseErrors: { line: number; message: string }[];
  summary: {
    created: number;
    linked: number;
    updated: number;
    failed: number;
  };
}> {
  const { rows, errors: parseErrors } = parseMemberCsv(csvText);
  const results: ImportMemberResult[] = [];

  for (const row of rows) {
    try {
      const existingEmployee = await db.organizationMember.findUnique({
        where: {
          organizationId_employeeId: {
            organizationId,
            employeeId: row.employeeId,
          },
        },
        include: { user: true },
      });

      if (existingEmployee && existingEmployee.user.email !== row.email) {
        results.push({
          line: row.line,
          email: row.email,
          employeeId: row.employeeId,
          status: "error",
          message: `employee_id ${row.employeeId} already assigned to ${existingEmployee.user.email}`,
        });
        continue;
      }

      if (row.phoneNumber) {
        const phoneOwner = await db.user.findUnique({
          where: { phoneNumber: row.phoneNumber },
          select: { id: true, email: true },
        });
        if (phoneOwner) {
          const userByEmail = await getUserByEmail(row.email);
          if (!userByEmail || phoneOwner.id !== userByEmail.id) {
            results.push({
              line: row.line,
              email: row.email,
              employeeId: row.employeeId,
              status: "error",
              message: `Phone number already in use by ${phoneOwner.email}`,
            });
            continue;
          }
        }
      }

      let user = await getUserByEmail(row.email);
      let status: ImportMemberResult["status"] = "linked";

      if (!user) {
        const passwordHash = await hashPassword(randomPassword());
        user = await db.user.create({
          data: {
            email: row.email,
            name: row.name,
            passwordHash,
            role: "STUDENT",
            privacyConsentAt: new Date(),
          },
        });
        status = "created";
      }

      const existingMember = await db.organizationMember.findUnique({
        where: {
          organizationId_userId: { organizationId, userId: user.id },
        },
      });

      const memberData = {
        employeeId: row.employeeId,
        role: row.role,
        ...(row.department !== undefined ? { department: row.department } : {}),
        ...(row.location !== undefined ? { location: row.location } : {}),
      };

      if (existingMember) {
        await db.organizationMember.update({
          where: { id: existingMember.id },
          data: memberData,
        });
        if (status !== "created") status = "updated";
      } else {
        await db.organizationMember.create({
          data: {
            organizationId,
            userId: user.id,
            ...memberData,
          },
        });
      }

      const userUpdates: { name?: string; phoneNumber?: string } = {};
      if (row.name && user.name !== row.name) {
        userUpdates.name = row.name;
      }
      if (row.phoneNumber && user.phoneNumber !== row.phoneNumber) {
        userUpdates.phoneNumber = row.phoneNumber;
      }
      if (Object.keys(userUpdates).length > 0) {
        await db.user.update({
          where: { id: user.id },
          data: userUpdates,
        });
      }

      results.push({
        line: row.line,
        email: row.email,
        employeeId: row.employeeId,
        status,
        message:
          status === "created"
            ? "New account created — user can reset password via login"
            : undefined,
      });
    } catch (err) {
      results.push({
        line: row.line,
        email: row.email,
        employeeId: row.employeeId,
        status: "error",
        message: err instanceof Error ? err.message : "Import failed",
      });
    }
  }

  const summary = {
    created: results.filter((r) => r.status === "created").length,
    linked: results.filter((r) => r.status === "linked").length,
    updated: results.filter((r) => r.status === "updated").length,
    failed:
      results.filter((r) => r.status === "error").length + parseErrors.length,
  };

  return { results, parseErrors, summary };
}

export async function createOrganizationWithAdmin(
  orgData: {
    name: string;
    slug?: string;
    allowedDomains?: string[];
    allowPublicCourses?: boolean;
  },
  adminData: {
    name: string;
    email: string;
    employeeId: string;
    password: string;
  }
) {
  const slug = orgData.slug ?? slugifyOrganizationName(orgData.name);

  const existing = await db.organization.findUnique({ where: { slug } });
  if (existing) {
    throw new Error("An organization with this slug already exists");
  }

  const domains = (orgData.allowedDomains ?? []).map((d) =>
    d.replace(/^@/, "").toLowerCase()
  );

  return db.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: orgData.name,
        slug,
        allowedDomains: domains,
        allowPublicCourses: orgData.allowPublicCourses ?? true,
      },
    });

    const email = adminData.email.toLowerCase();
    const existingEmployee = await tx.organizationMember.findUnique({
      where: {
        organizationId_employeeId: {
          organizationId: organization.id,
          employeeId: adminData.employeeId,
        },
      },
    });

    if (existingEmployee) {
      throw new Error(
        `employee_id ${adminData.employeeId} is already in use`
      );
    }

    let user = await tx.user.findUnique({ where: { email } });
    if (!user) {
      user = await tx.user.create({
        data: {
          email,
          name: adminData.name,
          passwordHash: await hashPassword(adminData.password),
          role: "STUDENT",
          privacyConsentAt: new Date(),
        },
      });
    } else {
      await tx.user.update({
        where: { id: user.id },
        data: {
          name: adminData.name,
          passwordHash: await hashPassword(adminData.password),
        },
      });
    }

    const member = await tx.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        employeeId: adminData.employeeId,
        role: "ORG_ADMIN",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return { organization, member };
  });
}

export async function upsertOrgMember(
  organizationId: string,
  data: {
    email: string;
    name?: string;
    employeeId: string;
    role: OrganizationRole;
    password?: string;
    department?: string;
    location?: string;
    phoneNumber?: string;
  }
) {
  const email = data.email.toLowerCase();
  const existingEmployee = await db.organizationMember.findUnique({
    where: {
      organizationId_employeeId: {
        organizationId,
        employeeId: data.employeeId,
      },
    },
    include: { user: true },
  });

  if (existingEmployee && existingEmployee.user.email !== email) {
    throw new Error(
      `employee_id ${data.employeeId} is already used by ${existingEmployee.user.email}`
    );
  }

  if (data.phoneNumber) {
    const phoneOwner = await db.user.findUnique({
      where: { phoneNumber: data.phoneNumber },
      select: { id: true, email: true },
    });
    if (phoneOwner) {
      const userByEmail = await getUserByEmail(email);
      if (!userByEmail || phoneOwner.id !== userByEmail.id) {
        throw new Error(`Phone number already in use by ${phoneOwner.email}`);
      }
    }
  }

  let user = await getUserByEmail(email);
  if (!user) {
    const passwordHash = await hashPassword(data.password ?? randomPassword());
    user = await db.user.create({
      data: {
        email,
        name: data.name ?? email.split("@")[0],
        passwordHash,
        role: "STUDENT",
        privacyConsentAt: new Date(),
        ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
      },
    });
  } else {
    const userUpdates: { name?: string; phoneNumber?: string } = {};
    if (data.name && user.name !== data.name) {
      userUpdates.name = data.name;
    }
    if (data.phoneNumber && user.phoneNumber !== data.phoneNumber) {
      userUpdates.phoneNumber = data.phoneNumber;
    }
    if (Object.keys(userUpdates).length > 0) {
      await db.user.update({ where: { id: user.id }, data: userUpdates });
    }
  }

  const memberFields = {
    employeeId: data.employeeId,
    role: data.role,
    ...(data.department !== undefined ? { department: data.department } : {}),
    ...(data.location !== undefined ? { location: data.location } : {}),
  };

  return db.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId, userId: user.id },
    },
    create: {
      organizationId,
      userId: user.id,
      ...memberFields,
    },
    update: memberFields,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}
