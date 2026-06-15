import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { z } from "zod";

const reviewSchema = z.object({
  approved: z.boolean(),
  reason: z.string().max(500).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const instructor = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      instructorStatus: true,
    },
  });

  if (!instructor || instructor.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
  }

  if (instructor.instructorStatus !== "PENDING") {
    return NextResponse.json(
      { error: "This instructor is not pending review" },
      { status: 400 }
    );
  }

  const { approved, reason } = parsed.data;

  await db.user.update({
    where: { id },
    data: {
      instructorStatus: approved ? "APPROVED" : "REJECTED",
      instructorRejectionReason: approved ? null : reason?.trim() || null,
      instructorReviewedAt: new Date(),
    },
  });

  await createNotification({
    userId: instructor.id,
    type: approved ? "INSTRUCTOR_APPROVED" : "INSTRUCTOR_REJECTED",
    title: approved ? "Instructor account approved" : "Instructor application declined",
    message: approved
      ? "You can now create and manage courses on IntelliGen LMS."
      : reason?.trim()
        ? `Your application was not approved. Reason: ${reason.trim()}`
        : "Your instructor application was not approved at this time.",
    link: "/dashboard",
  });

  await logAudit({
    action: approved ? "INSTRUCTOR_APPROVED" : "INSTRUCTOR_REJECTED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "User",
    targetId: instructor.id,
    metadata: {
      instructorEmail: instructor.email,
      instructorName: instructor.name,
      reason: reason?.trim() || null,
    },
    request,
  });

  return NextResponse.json({ success: true });
}
