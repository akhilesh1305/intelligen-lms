import { NextResponse } from "next/server";
import { getPending2FAUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAvailable2FAMethods } from "@/lib/security/2fa";
import { maskEmail, maskPhone } from "@/lib/security/2fa-otp";

export async function GET() {
  const userId = await getPending2FAUserId();
  if (!userId) {
    return NextResponse.json({ error: "No pending 2FA session" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      twoFactorEnabled: true,
      twoFactorSecret: true,
      twoFactorEmailEnabled: true,
      twoFactorAltEmailVerified: true,
      twoFactorAltEmail: true,
      twoFactorSmsEnabled: true,
      twoFactorAltPhoneVerified: true,
      twoFactorAltPhone: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const methods = getAvailable2FAMethods(user);

  return NextResponse.json({
    methods,
    maskedEmail: user.twoFactorAltEmail
      ? maskEmail(user.twoFactorAltEmail)
      : null,
    maskedPhone: user.twoFactorAltPhone
      ? maskPhone(user.twoFactorAltPhone)
      : null,
  });
}
