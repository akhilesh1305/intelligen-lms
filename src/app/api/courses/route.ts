import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { courseSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !["INSTRUCTOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const course = await db.course.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      published: isAdmin && wantsPublish,
      status: wantsPublish
        ? isAdmin
          ? "APPROVED"
          : "PENDING_APPROVAL"
        : "DRAFT",
      instructorId: session.id,
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
