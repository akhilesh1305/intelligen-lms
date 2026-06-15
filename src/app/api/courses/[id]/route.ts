import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { logAudit } from "@/lib/audit";
import { rupeesToPaise } from "@/lib/currency";
import { courseSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: { instructor: true },
  });

  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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

  let status = course.status;
  let published = course.published;

  if (wantsPublish) {
    if (isAdmin) {
      status = "APPROVED";
      published = true;
    } else if (course.status !== "APPROVED") {
      status = "PENDING_APPROVAL";
      published = false;

      const admins = await db.user.findMany({ where: { role: "ADMIN" } });
      for (const admin of admins) {
        await createNotification({
          userId: admin.id,
          type: "COURSE_SUBMITTED",
          title: "Course pending approval",
          message: `${parsed.data.title} resubmitted for review`,
          link: "/admin/approvals",
        });
      }
    }
  } else {
    status = "DRAFT";
    published = false;
  }

  await db.course.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      pricePaise: rupeesToPaise(parsed.data.priceInRupees ?? 0),
      skillLevel: parsed.data.skillLevel ?? course.skillLevel,
      prerequisiteCourseId: parsed.data.prerequisiteCourseId ?? null,
      status,
      published,
    },
  });

  await logAudit({
    action: "COURSE_UPDATED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "Course",
    targetId: id,
    metadata: {
      title: parsed.data.title,
      status,
      published,
    },
    request,
  });

  return NextResponse.json({ id });
}
