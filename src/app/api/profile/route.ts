import { NextResponse } from "next/server";
import {
  createSession,
  getSession,
  getUserByEmail,
  getUserByPhone,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { normalizePhoneNumber } from "@/lib/phone";
import { getUserOrganizationMemberships } from "@/lib/organizations";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, orgMemberships] = await Promise.all([
    db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phoneNumber: true,
        dateOfBirth: true,
        maritalStatus: true,
        role: true,
        points: true,
        createdAt: true,
      },
    }),
    getUserOrganizationMemberships(session.id),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user,
    orgMemberships: orgMemberships.map((m) => ({
      organizationId: m.organizationId,
      organizationName: m.organization.name,
      employeeId: m.employeeId,
      role: m.role,
    })),
  });
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phoneNumber,
      dateOfBirth,
      maritalStatus,
      currentPassword,
      newPassword,
    } = parsed.data;
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        phoneNumber: true,
        dateOfBirth: true,
        maritalStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail !== user.email) {
      const existing = await getUserByEmail(normalizedEmail);
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
    }

    const normalizedPhone = phoneNumber?.trim()
      ? normalizePhoneNumber(phoneNumber)
      : null;

    if (phoneNumber?.trim() && !normalizedPhone) {
      return NextResponse.json(
        { error: "Enter a valid mobile number" },
        { status: 400 }
      );
    }

    if (normalizedPhone && normalizedPhone !== user.phoneNumber) {
      const existingPhone = await getUserByPhone(normalizedPhone);
      if (existingPhone && existingPhone.id !== user.id) {
        return NextResponse.json(
          { error: "This mobile number is already in use" },
          { status: 409 }
        );
      }
    }

    const updateData: {
      name: string;
      email: string;
      phoneNumber: string | null;
      dateOfBirth: Date | null;
      maritalStatus:
        | "SINGLE"
        | "MARRIED"
        | "DIVORCED"
        | "WIDOWED"
        | "SEPARATED"
        | "PREFER_NOT_TO_SAY"
        | null;
      passwordHash?: string;
    } = {
      name: name.trim(),
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      maritalStatus: maritalStatus || null,
    };

    if (newPassword) {
      if (!(await verifyPassword(currentPassword!, user.passwordHash))) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phoneNumber: true,
        dateOfBirth: true,
        maritalStatus: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    await createSession({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    const changes: string[] = [];
    if (user.name !== updated.name) changes.push("name");
    if (user.email !== updated.email) changes.push("email");
    if (user.phoneNumber !== updated.phoneNumber) changes.push("phoneNumber");
    if (
      user.dateOfBirth?.toISOString().slice(0, 10) !==
      updated.dateOfBirth?.toISOString().slice(0, 10)
    ) {
      changes.push("dateOfBirth");
    }
    if (user.maritalStatus !== updated.maritalStatus) changes.push("maritalStatus");
    if (newPassword) changes.push("password");

    await logAudit({
      action: "USER_UPDATED",
      userId: updated.id,
      userEmail: updated.email,
      userName: updated.name,
      targetType: "User",
      targetId: updated.id,
      metadata: { changes, updateType: "profile" },
      request,
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
