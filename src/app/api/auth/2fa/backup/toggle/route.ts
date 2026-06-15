import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { setBackupTwoFactor } from "@/lib/security/2fa";
import { twoFactorBackupToggleSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = twoFactorBackupToggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    await setBackupTwoFactor(
      session.id,
      parsed.data.channel,
      parsed.data.enabled
    );

    await logAudit({
      action: parsed.data.enabled
        ? "TWO_FACTOR_ENABLED"
        : "TWO_FACTOR_DISABLED",
      userId: session.id,
      userEmail: session.email,
      userName: session.name,
      metadata: {
        method: parsed.data.channel,
        updateType: "2fa_backup",
      },
      request,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update 2FA setting";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
