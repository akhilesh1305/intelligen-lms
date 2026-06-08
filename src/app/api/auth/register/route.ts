import { NextResponse } from "next/server";
import { createSession, getUserByEmail, hashPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { registerSchema } from "@/lib/validations";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    if (await getUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await logAudit({
      action: "REGISTER",
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      targetType: "User",
      targetId: user.id,
      metadata: { role: user.role },
      request,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
