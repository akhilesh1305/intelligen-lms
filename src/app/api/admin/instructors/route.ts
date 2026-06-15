import { NextResponse } from "next/server";
import { getSession, getUserByEmail, hashPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { adminCreateInstructorSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = adminCreateInstructorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (await getUserByEmail(normalizedEmail)) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "INSTRUCTOR",
      instructorStatus: "APPROVED",
      instructorReviewedAt: new Date(),
      privacyConsentAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      instructorStatus: true,
      createdAt: true,
    },
  });

  await createNotification({
    userId: user.id,
    type: "INSTRUCTOR_APPROVED",
    title: "Instructor account created",
    message:
      "An administrator created your instructor account. Sign in to start creating courses.",
    link: "/login",
  });

  await logAudit({
    action: "INSTRUCTOR_APPROVED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "User",
    targetId: user.id,
    metadata: {
      instructorEmail: user.email,
      instructorName: user.name,
      createdByAdmin: true,
    },
    request,
  });

  return NextResponse.json({ user }, { status: 201 });
}
