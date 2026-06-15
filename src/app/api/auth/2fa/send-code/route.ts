import { NextResponse } from "next/server";
import { getPending2FAUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { twoFactorSendCodeSchema } from "@/lib/validations";
import { getAvailable2FAMethods } from "@/lib/security/2fa";
import { createAndDeliverOtp } from "@/lib/security/2fa-otp";

export async function POST(request: Request) {
  const userId = await getPending2FAUserId();
  if (!userId) {
    return NextResponse.json({ error: "No pending 2FA session" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = twoFactorSendCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
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
  if (!methods.includes(parsed.data.method)) {
    return NextResponse.json(
      { error: "This verification method is not available" },
      { status: 400 }
    );
  }

  try {
    if (parsed.data.method === "email") {
      if (!user.twoFactorAltEmail) {
        return NextResponse.json({ error: "No alternate email configured" }, { status: 400 });
      }
      await createAndDeliverOtp(userId, "EMAIL", user.twoFactorAltEmail, "login");
    } else {
      if (!user.twoFactorAltPhone) {
        return NextResponse.json({ error: "No alternate phone configured" }, { status: 400 });
      }
      await createAndDeliverOtp(userId, "SMS", user.twoFactorAltPhone, "login");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send verification code";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
