import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { twoFactorBackupVerifySchema } from "@/lib/validations";
import { verifyOtpCode } from "@/lib/security/2fa-otp";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = twoFactorBackupVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { channel, code } = parsed.data;
  const otpChannel = channel === "email" ? "EMAIL" : "SMS";

  const valid = await verifyOtpCode(session.id, otpChannel, code);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid or expired verification code" },
      { status: 400 }
    );
  }

  const data =
    channel === "email"
      ? { twoFactorAltEmailVerified: true }
      : { twoFactorAltPhoneVerified: true };

  await db.user.update({
    where: { id: session.id },
    data,
  });

  await logAudit({
    action: "USER_UPDATED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    metadata: {
      updateType: "2fa_backup_verified",
      channel,
    },
    request,
  });

  return NextResponse.json({ success: true });
}
