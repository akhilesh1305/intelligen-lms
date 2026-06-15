import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { logAudit } from "@/lib/audit";
import { rupeesToPaise } from "@/lib/currency";
import { courseSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import {
  canManageOrganizationCourses,
  getOrgCourseCreatorContext,
  resolveCourseVisibilityForCreate,
} from "@/lib/organizations";

export async function POST(request: Request) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  const parsed = courseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const wantsPublish = parsed.data.published;
  const isAdmin = session.role === "ADMIN";
  const creatorContext = await getOrgCourseCreatorContext(session.id, session.role);

  let organizationId = parsed.data.organizationId ?? null;
  if (!isAdmin && !organizationId && creatorContext.defaultOrganizationId) {
    organizationId = creatorContext.defaultOrganizationId;
  }

  if (organizationId) {
    const canCreate = await canManageOrganizationCourses(
      session.id,
      organizationId,
      session.role
    );
    if (!canCreate) {
      return NextResponse.json(
        { error: "You cannot create courses for this organization" },
        { status: 403 }
      );
    }
  }

  const visibilityFields = resolveCourseVisibilityForCreate(organizationId);

  const course = await db.course.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      pricePaise: rupeesToPaise(parsed.data.priceInRupees ?? 0),
      skillLevel: parsed.data.skillLevel ?? "BEGINNER",
      prerequisiteCourseId: parsed.data.prerequisiteCourseId || null,
      published: isAdmin && wantsPublish,
      status: wantsPublish
        ? isAdmin
          ? "APPROVED"
          : "PENDING_APPROVAL"
        : "DRAFT",
      instructorId: session.id,
      ...visibilityFields,
    },
  });

  if (course.status === "PENDING_APPROVAL") {
    const admins = await db.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: "COURSE_SUBMITTED",
        title: "Course pending approval",
        message: `${parsed.data.title} submitted by instructor`,
        link: "/admin/approvals",
      });
    }
  }

  await logAudit({
    action: "COURSE_CREATED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "Course",
    targetId: course.id,
    metadata: { title: course.title, status: course.status },
    request,
  });

  return NextResponse.json({ id: course.id }, { status: 201 });
}
