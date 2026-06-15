import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { twoFactorBackupSendSchema } from "@/lib/validations";
import { syncTwoFactorEnabled } from "@/lib/security/2fa";
import { createAndDeliverOtp } from "@/lib/security/2fa-otp";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = twoFactorBackupSendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { channel } = parsed.data;

  try {
    if (channel === "email") {
      const email = parsed.data.email!.toLowerCase().trim();
      if (email === user.email.toLowerCase()) {
        return NextResponse.json(
          { error: "Alternate email must differ from your login email" },
          { status: 400 }
        );
      }

      const existing = await db.user.findFirst({
        where: { email, NOT: { id: session.id } },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "This email is already registered on another account" },
          { status: 409 }
        );
      }

      await db.user.update({
        where: { id: session.id },
        data: {
          twoFactorAltEmail: email,
          twoFactorAltEmailVerified: false,
          twoFactorEmailEnabled: false,
        },
      });

      await syncTwoFactorEnabled(session.id);
      await createAndDeliverOtp(session.id, "EMAIL", email, "setup");
    } else {
      const phone = parsed.data.phone!.trim();
      await db.user.update({
        where: { id: session.id },
        data: {
          twoFactorAltPhone: phone,
          twoFactorAltPhoneVerified: false,
          twoFactorSmsEnabled: false,
        },
      });

      await syncTwoFactorEnabled(session.id);
      await createAndDeliverOtp(session.id, "SMS", phone, "setup");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send verification code";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
