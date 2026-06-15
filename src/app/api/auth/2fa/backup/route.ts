import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { maskEmail, maskPhone } from "@/lib/security/2fa-otp";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      email: true,
      twoFactorEnabled: true,
      twoFactorAltEmail: true,
      twoFactorAltEmailVerified: true,
      twoFactorAltPhone: true,
      twoFactorAltPhoneVerified: true,
      twoFactorEmailEnabled: true,
      twoFactorSmsEnabled: true,
      twoFactorSecret: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    primaryEmail: user.email,
    altEmail: user.twoFactorAltEmail,
    altEmailVerified: user.twoFactorAltEmailVerified,
    altEmailMasked: user.twoFactorAltEmail
      ? maskEmail(user.twoFactorAltEmail)
      : null,
    altPhone: user.twoFactorAltPhone,
    altPhoneVerified: user.twoFactorAltPhoneVerified,
    altPhoneMasked: user.twoFactorAltPhone
      ? maskPhone(user.twoFactorAltPhone)
      : null,
    emailEnabled: user.twoFactorEmailEnabled,
    smsEnabled: user.twoFactorSmsEnabled,
    hasAuthenticator: Boolean(user.twoFactorSecret),
    twoFactorEnabled: user.twoFactorEnabled,
  });
}
