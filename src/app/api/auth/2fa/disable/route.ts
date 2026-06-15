import { NextResponse } from "next/server";
import { getSession, verifyPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import {
  disableAuthenticator,
  getUserTwoFactorSecret,
  verifyTotpCode,
} from "@/lib/security/2fa";
import { twoFactorCodeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = twoFactorCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const secret = await getUserTwoFactorSecret(session.id);
  if (!secret || !verifyTotpCode(secret, parsed.data.code)) {
    if (!body.password || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid verification code or password" },
        { status: 400 }
      );
    }
  }

  await disableAuthenticator(session.id);

  await logAudit({
    action: "TWO_FACTOR_DISABLED",
    metadata: { method: "authenticator" },
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    request,
  });

  return NextResponse.json({ success: true });
}
