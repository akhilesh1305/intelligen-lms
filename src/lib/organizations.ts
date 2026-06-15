import type { Course, CourseVisibility, Prisma, Role } from "@prisma/client";

import { db } from "@/lib/db";

export type SessionLike = {
  id: string;
  role: Role;
} | null;

const publishedApproved = {
  published: true,
  status: "APPROVED" as const,
};

export async function getUserOrganizationMemberships(userId: string) {
  return db.organizationMember.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { joinedAt: "asc" },
  });
}

export async function getUserOrganizationIds(userId: string): Promise<string[]> {
  const memberships = await db.organizationMember.findMany({
    where: { userId },
    select: { organizationId: true },
  });
  return memberships.map((m) => m.organizationId);
}

export async function isOrganizationMember(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const member = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: { organizationId, userId },
    },
  });
  return Boolean(member);
}

export async function isOrganizationAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const member = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: { organizationId, userId },
    },
  });
  return member?.role === "ORG_ADMIN";
}

export async function canManageOrganizationCourses(
  userId: string,
  organizationId: string,
  platformRole: Role
): Promise<boolean> {
  if (platformRole === "ADMIN") return true;
  const member = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: { organizationId, userId },
    },
  });
  return (
    member?.role === "ORG_ADMIN" || member?.role === "ORG_INSTRUCTOR"
  );
}

export function userHidesPublicCatalog(
  memberships: { organization: { allowPublicCourses: boolean } }[]
): boolean {
  if (memberships.length === 0) return false;
  return memberships.every((m) => !m.organization.allowPublicCourses);
}

export function buildAccessibleCoursesWhere(
  session: SessionLike,
  orgIds: string[],
  hidePublic: boolean
): Prisma.CourseWhereInput {
  if (session?.role === "ADMIN") {
    return publishedApproved;
  }

  const orgCourseFilter: Prisma.CourseWhereInput = {
    ...publishedApproved,
    visibility: "ORGANIZATION",
    organizationId: { in: orgIds },
  };

  if (!session) {
    return {
      ...publishedApproved,
      visibility: "PUBLIC",
    };
  }

  if (orgIds.length === 0 || hidePublic) {
    if (hidePublic && orgIds.length > 0) {
      return orgCourseFilter;
    }
    return {
      ...publishedApproved,
      visibility: "PUBLIC",
    };
  }

  return {
    ...publishedApproved,
    OR: [
      { visibility: "PUBLIC" },
      orgCourseFilter,
    ],
  };
}

type CourseAccessFields = Pick<
  Course,
  "id" | "visibility" | "organizationId" | "instructorId" | "status" | "published"
>;

export async function canUserViewCourse(
  session: SessionLike,
  course: CourseAccessFields
): Promise<boolean> {
  if (session?.role === "ADMIN") return true;
  if (session?.id === course.instructorId) return true;

  if (course.status !== "APPROVED" || !course.published) {
    if (course.organizationId && session) {
      return canManageOrganizationCourses(
        session.id,
        course.organizationId,
        session.role
      );
    }
    return false;
  }

  if (course.visibility === "PUBLIC") {
    if (!session) return true;
    const memberships = await getUserOrganizationMemberships(session.id);
    if (userHidesPublicCatalog(memberships)) return false;
    return true;
  }

  if (course.visibility === "ORGANIZATION") {
    if (!course.organizationId || !session) return false;
    return isOrganizationMember(session.id, course.organizationId);
  }

  return false;
}

export async function assertCourseViewable(
  session: SessionLike,
  course: CourseAccessFields | null
): Promise<boolean> {
  if (!course) return false;
  return canUserViewCourse(session, course);
}

export async function getAccessibleCoursesWhereForUser(
  session: SessionLike
): Promise<Prisma.CourseWhereInput> {
  if (!session) {
    return buildAccessibleCoursesWhere(null, [], false);
  }

  if (session.role === "ADMIN") {
    return publishedApproved;
  }

  const memberships = await getUserOrganizationMemberships(session.id);
  const orgIds = memberships.map((m) => m.organizationId);
  const hidePublic = userHidesPublicCatalog(memberships);

  return buildAccessibleCoursesWhere(session, orgIds, hidePublic);
}

export async function getOrganizationsForAdmin() {
  return db.organization.findMany({
    include: {
      _count: { select: { members: true, courses: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getOrganizationById(id: string) {
  return db.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
      courses: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { enrollments: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

export function slugifyOrganizationName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function joinOrganizationsByEmailDomain(
  userId: string,
  email: string
): Promise<void> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return;

  const orgs = await db.organization.findMany({
    where: { allowedDomains: { has: domain } },
    select: { id: true },
  });

  for (const org of orgs) {
    await db.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId,
        },
      },
      create: {
        organizationId: org.id,
        userId,
        role: "ORG_LEARNER",
      },
      update: {},
    });
  }
}

export async function getOrgCourseCreatorContext(userId: string, platformRole: Role) {
  if (platformRole === "ADMIN") {
    const orgs = await db.organization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return { organizations: orgs, defaultOrganizationId: orgs[0]?.id ?? null };
  }

  const memberships = await db.organizationMember.findMany({
    where: {
      userId,
      role: { in: ["ORG_ADMIN", "ORG_INSTRUCTOR"] },
    },
    include: { organization: { select: { id: true, name: true, slug: true } } },
  });

  return {
    organizations: memberships.map((m) => m.organization),
    defaultOrganizationId: memberships[0]?.organizationId ?? null,
  };
}

export function resolveCourseVisibilityForCreate(
  organizationId: string | null | undefined
): { visibility: CourseVisibility; organizationId: string | null } {
  if (organizationId) {
    return { visibility: "ORGANIZATION", organizationId };
  }
  return { visibility: "PUBLIC", organizationId: null };
}
