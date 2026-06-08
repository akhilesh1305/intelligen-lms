import { NextResponse } from "next/server";
import {
  createSession,
  getUserByEmail,
  verifyPassword,
} from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await getUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      await logAudit({
        action: "LOGIN_FAILED",
        userEmail: email.toLowerCase(),
        metadata: { email: email.toLowerCase() },
        request,
      });

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await logAudit({
      action: "LOGIN",
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      targetType: "User",
      targetId: user.id,
      request,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
