import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { twoFactorCodeSchema } from "@/lib/validations";
import {
  enableTwoFactor,
  verifyTotpCode,
} from "@/lib/security/2fa";

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

  const secret = body.secret as string | undefined;
  if (!secret) {
    return NextResponse.json({ error: "Secret is required" }, { status: 400 });
  }

  if (!verifyTotpCode(secret, parsed.data.code)) {
    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
  }

  await enableTwoFactor(session.id, secret);

  await logAudit({
    action: "TWO_FACTOR_ENABLED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    request,
  });

  return NextResponse.json({ success: true });
}
