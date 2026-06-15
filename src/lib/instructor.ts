import { InstructorStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { SessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export function isInstructorApproved(
  role: Role,
  status: InstructorStatus | null | undefined
): boolean {
  if (role === "ADMIN") return true;
  if (role !== "INSTRUCTOR") return false;
  if (status === "APPROVED") return true;
  if (status == null) return true;
  return false;
}

export async function getInstructorApprovalState(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      instructorStatus: true,
      instructorRejectionReason: true,
    },
  });
}

export function instructorAccessDeniedMessage(
  status: InstructorStatus | null | undefined
): string {
  if (status === "REJECTED") {
    return "Your instructor application was not approved. Contact support if you believe this is a mistake.";
  }
  return "Your instructor account is pending admin approval. You can create courses after verification.";
}

export async function instructorApiGuard(
  session: SessionUser | null
): Promise<NextResponse | SessionUser> {
  if (!session || !["INSTRUCTOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "ADMIN") return session;

  const user = await getInstructorApprovalState(session.id);
  if (!user || !isInstructorApproved(user.role, user.instructorStatus)) {
    return NextResponse.json(
      { error: instructorAccessDeniedMessage(user?.instructorStatus) },
      { status: 403 }
    );
  }

  return session;
}

export async function requireApprovedInstructorPage(session: SessionUser) {
  if (session.role === "ADMIN") return;

  const user = await getInstructorApprovalState(session.id);
  if (!user || !isInstructorApproved(user.role, user.instructorStatus)) {
    const param =
      user?.instructorStatus === "REJECTED" ? "rejected" : "pending";
    redirect(`/dashboard?instructor=${param}`);
  }
}

export async function getPendingInstructors() {
  return db.user.findMany({
    where: { role: "INSTRUCTOR", instructorStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function countPendingInstructors() {
  return db.user.count({
    where: { role: "INSTRUCTOR", instructorStatus: "PENDING" },
  });
}

export async function getActiveInstructors() {
  return db.user.findMany({
    where: {
      role: "INSTRUCTOR",
      OR: [{ instructorStatus: "APPROVED" }, { instructorStatus: null }],
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      instructorStatus: true,
      createdAt: true,
      _count: { select: { coursesTaught: true } },
    },
  });
}
